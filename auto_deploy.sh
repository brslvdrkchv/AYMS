#!/usr/bin/env bash
# ==============================================================================
# AYMS Conf 2026 - Automatic GitHub Continuous Deployment Watcher
# Runs via cron every minute: checks for remote changes, pulls & updates static site.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Prevent concurrent runs
PIDFILE="$SCRIPT_DIR/.deploy.pid"
if [ -f "$PIDFILE" ]; then
    PID=$(cat "$PIDFILE")
    if ps -p "$PID" > /dev/null 2>&1; then
        exit 0
    fi
fi
echo "$$" > "$PIDFILE"
trap 'rm -f "$PIDFILE"' EXIT

# Fetch origin for current active branch
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
git fetch origin "$BRANCH" > /dev/null 2>&1 || exit 0

LOCAL=$(git rev-parse HEAD 2>/dev/null)
REMOTE=$(git rev-parse "origin/$BRANCH" 2>/dev/null)

if [ -n "$LOCAL" ] && [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    echo "=========================================================="
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 New updates detected on branch $BRANCH!"
    echo "Local:  $LOCAL"
    echo "Remote: $REMOTE"

    # Pull clean latest changes
    git pull origin "$BRANCH"

    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ AYMS Conf 2026 successfully updated!"
    echo "=========================================================="
fi
