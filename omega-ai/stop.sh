#!/bin/bash

# Omega AI Desktop - One Click Stop Script
echo "🛑 Stopping Omega AI Desktop..."

# Read PIDs
if [ -f /tmp/omega_backend.pid ]; then
    BACKEND_PID=$(cat /tmp/omega_backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
        sleep 1
        kill -9 $BACKEND_PID 2>/dev/null || true
    fi
    rm /tmp/omega_backend.pid
fi

if [ -f /tmp/omega_frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/omega_frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
        sleep 1
        kill -9 $FRONTEND_PID 2>/dev/null || true
    fi
    rm /tmp/omega_frontend.pid
fi

# Kill any remaining Omega AI processes
echo "🔍 Cleaning up remaining processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite.*omega" 2>/dev/null || true
pkill -f "electron.*omega" 2>/dev/null || true
pkill -f "Omega AI Desktop" 2>/dev/null || true

# Remove lock files
rm -f /tmp/omega_*.pid

echo ""
echo "=========================================="
echo "✅ Omega AI Desktop has been stopped."
echo "=========================================="
echo "💡 To start again, run: ./start.sh"
echo "=========================================="

exit 0
