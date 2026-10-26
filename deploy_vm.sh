#!/usr/bin/env bash
# ==============================================================================
# AYMS Conf 2026 - One-Step Cloud Server Deployment Script
# Automatically clones repo, sets up 1-minute auto-deploy cron, and configures Caddy.
# ==============================================================================
set -e

echo "=== [1/4] Перевірка та клонування репозиторію AYMS ==="
USER_HOME=$(eval echo ~$USER)
TARGET_DIR="$USER_HOME/AYMS"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Клонування AYMS у $TARGET_DIR..."
    git clone https://github.com/brslvdrkchv/AYMS.git "$TARGET_DIR"
else
    echo "Оновлення AYMS у $TARGET_DIR..."
    cd "$TARGET_DIR"
    git pull origin main
fi

cd "$TARGET_DIR"
chmod +x auto_deploy.sh

echo "=== [2/4] Налаштування автоматичного автодеплою (cron раз на хвилину) ==="
CRON_JOB="* * * * * $TARGET_DIR/auto_deploy.sh >> $TARGET_DIR/deploy.log 2>&1"
if crontab -l 2>/dev/null | grep -F "$TARGET_DIR/auto_deploy.sh" >/dev/null; then
    echo "Cron задача вже налаштована."
else
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "Cron задачу успішно додано!"
fi

echo "=== [3/4] Налаштування веб-сервера Caddy ==="
CADDYFILE="/etc/caddy/Caddyfile"
if [ -f "$CADDYFILE" ]; then
    if grep -F "$TARGET_DIR" "$CADDYFILE" >/dev/null; then
        echo "Конфігурація AYMS вже присутня у $CADDYFILE."
    else
        echo "Додавання блоку AYMS до $CADDYFILE..."
        sudo tee -a "$CADDYFILE" > /dev/null <<EOF

# --- AYMS Conf 2026 (порт 8080 до підключення красивого домену) ---
:8080 {
    root * $TARGET_DIR
    file_server
    encode zstd gzip
}
EOF
        echo "Перезапуск Caddy..."
        sudo systemctl reload caddy || sudo systemctl restart caddy
    fi
else
    echo "Увага: $CADDYFILE не знайдено. Перевірте, чи встановлено Caddy."
fi

echo "=== [4/4] Готово! ==="
IP=$(curl -s -m 3 ifconfig.me || echo "34.170.54.138")
echo "=========================================================="
echo "✅ AYMS Conf 2026 успішно розгорнуто!"
echo "🌐 Локальний порт: http://$IP:8080"
echo "🔄 Автодеплой: активний (будь-який git push main оновлюється за 60 секунд)"
echo "=========================================================="
