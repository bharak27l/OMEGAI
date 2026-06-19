#!/bin/bash

# Omega AI Desktop - One Click Start Script
echo "🚀 Starting Omega AI Desktop..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Change to project directory
cd "$(dirname "$0")"

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install --silent
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install --silent
    cd ..
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp .env.example .env
    echo "Please edit .env and add your API keys!"
fi

# Kill any existing processes
echo "🔍 Cleaning up existing processes..."
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo "❌ Backend failed to start. Check logs/backend.log for details."
    exit 1
fi

echo "✅ Backend started (PID: $BACKEND_PID)"

# Start frontend/Electron
echo "🖥️  Starting Omega AI Desktop application..."
cd frontend
npm run electron:dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "✨ Omega AI Desktop is starting!"
echo "=========================================="
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "💡 The app window should open shortly..."
echo "💡 To stop the app, run: ./stop.sh"
echo "=========================================="

# Save PIDs for stop script
echo "$BACKEND_PID" > /tmp/omega_backend.pid
echo "$FRONTEND_PID" > /tmp/omega_frontend.pid

exit 0
