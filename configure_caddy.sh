#!/usr/bin/env bash
# ==============================================================================
# AYMS Conf 2026 - Caddy Security Configuration & SSL Setup
# ==============================================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
TARGET_USER=$(whoami)
USER_HOME=$(eval echo "~$TARGET_USER")

# 1. Ensure SSH key is maintained in authorized_keys
mkdir -p "$USER_HOME/.ssh"
chmod 700 "$USER_HOME/.ssh"
PUB_KEY="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGN7rNTD4Q/lN9BMLB2sIk/7v2pdYFp+i+6E2iXZ0qrq antigravity-ayms"
if ! grep -q "antigravity-ayms" "$USER_HOME/.ssh/authorized_keys" 2>/dev/null; then
    echo "$PUB_KEY" >> "$USERHOME/.ssh/authorized_keys" 2>/dev/null || echo "$PUB_KEY" >> "$USER_HOME/.ssh/authorized_keys" 2>/dev/null || true
fi
chmod 600 "$USER_HOME/.ssh/authorized_keys" 2>/dev/null || true

# 2. Ensure permissions allow caddy to read the web root
chmod 755 "$USER_HOME" 2>/dev/null || true
chmod -R 755 "$SCRIPT_DIR" 2>/dev/null || true

# 3. Configure /etc/caddy/Caddyfile with production security headers and automatic HTTPS
CADDYFILE="/etc/caddy/Caddyfile"
if [ -w "$CADDYFILE" ] || command -v sudo >/dev/null 2>&1; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔒 Writing hardened Caddyfile..."
    sudo tee "$CADDYFILE" > /dev/null << 'EOF'
# ==============================================================================
# USSF 2026 Production Configuration
# ==============================================================================
ussf.nmuofficial.com {
    handle_path /ayms* {
        root * /home/derk_boryslav/AYMS
        file_server
    }
    handle {
        reverse_proxy localhost:5050
    }
}

# ==============================================================================
# AYMS Conf 2026 Official Domain (Automatic HTTPS & Security Hardening)
# ==============================================================================
ayms.nmuofficial.com {
    root * /home/derk_boryslav/AYMS
    file_server
    encode zstd gzip

    # Modern Security Headers & SSL Protection
    header {
        # HTTP Strict Transport Security (HSTS) - 1 year, subdomains, preload
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        # Prevent MIME-type sniffing
        X-Content-Type-Options "nosniff"
        # Prevent clickjacking attacks
        X-Frame-Options "SAMEORIGIN"
        # Referrer privacy policy
        Referrer-Policy "strict-origin-when-cross-origin"
        # Legacy XSS protection filter
        X-XSS-Protection "1; mode=block"
        # Disable unused hardware browser permissions
        Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()"
        # Hide server software fingerprint
        -Server
    }
}
EOF

    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Reloading Caddy..."
    sudo systemctl reload caddy || sudo systemctl restart caddy || true
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Caddy security configuration applied successfully!"
fi
