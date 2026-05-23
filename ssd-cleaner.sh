#!/bin/bash
# ==============================================================================
# ✊ NM Socialists - SSD Optimizer & Google Drive Local Cache Cleaner
# ==============================================================================
# A fast utility wrapper to scan, optimize, and clean duplicates & package caches
# ==============================================================================

echo -e "\033[1;33m🔍 Reclaiming disk space on your SSD...\033[0m"

# 1. Clear Homebrew Cache
if command -v brew &> /dev/null; then
  echo -e "\n\033[1;36m🍺 Purging Homebrew cache & formula downloads...\033[0m"
  brew cleanup --prune=all
fi

# 2. Clear NPM Cache
if command -v npm &> /dev/null; then
  echo -e "\n\033[1;36m📦 Purging NPM cache logs...\033[0m"
  npm cache clean --force
fi

# 3. Run Python Duplicate Scanner
SCRIPT_PATH="/Users/xavasena/.gemini/antigravity/scratch/ssd_cleaner.py"
if [ -f "$SCRIPT_PATH" ]; then
  echo -e "\n\033[1;35m🚀 Running deep scan & active duplicate file cleanup...\033[0m"
  python3 "$SCRIPT_PATH" "$@"
else
  echo -e "\n\033[1;31m❌ Duplicate scanner script not found at $SCRIPT_PATH\033[0m"
fi

# 4. Check ending disk space
echo -e "\n\033[1;32m✅ Optimization complete! Checking remaining SSD space:\033[0m"
df -h /Users/xavasena/
echo -e "=============================================================================="
