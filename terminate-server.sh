#!/bin/bash
# ==============================================================================
# ✊ NM Socialists - Local Test Server & Task Cleanup Utility
# ==============================================================================
# This utility locates and terminates any active local development HTTP servers
# running on port 8081 (or custom ports) and helps clean up active tasks.
# ==============================================================================

PORT=${1:-8081}

echo -e "\033[1;33m🔍 Searching for active local servers on port $PORT...\033[0m"

# Find PID running on the specified port
PID=$(lsof -t -i :$PORT)

if [ -z "$PID" ]; then
  # Fallback: search for python http.server processes
  echo -e "\033[1;30mNo active connection found on port $PORT. Searching for python http.server...\033[0m"
  PID=$(ps aux | grep 'python3 -m http.server' | grep -v 'grep' | awk '{print $2}')
fi

if [ -n "$PID" ]; then
  echo -e "\033[1;32m🎯 Found active server process with PID(s): $PID\033[0m"
  for p in $PID; do
    echo -e "\033[1;31m💥 Terminating process $p...\033[0m"
    kill -9 "$p" 2>/dev/null
  done
  echo -e "\033[1;32m✅ Local test server on port $PORT has been successfully terminated!\033[0m"
else
  echo -e "\033[1;36m✨ No active local test servers are currently running.\033[0m"
fi

# Print instruction on task/schedule management for the AI Agent
echo -e "\n\033[1;35m🛠️  Agent Background Task Cleanup Reminder:\033[0m"
echo -e "To terminate running background tasks or scheduled notifications inside the IDE:"
echo -e "  1. View active tasks: \033[1;36mmanage_task('list')\033[0m"
echo -e "  2. Terminate a task:  \033[1;36mmanage_task('kill', TaskId='<task-id>')\033[0m"
echo -e "  3. Check task status: \033[1;36mmanage_task('status', TaskId='<task-id>')\033[0m"
echo -e "=============================================================================="
