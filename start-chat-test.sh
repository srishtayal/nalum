#!/bin/bash

echo "=========================================="
echo "Starting NALUM Chat Feature Test"
echo "=========================================="
echo ""

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "tmux not installed. Installing terminals separately..."
    echo ""
    echo "Terminal 1: Starting Backend..."
    cd backend && npm run dev &
    BACKEND_PID=$!
    
    sleep 5
    
    echo "Terminal 2: Starting Frontend..."
    cd frontend && npm run dev &
    FRONTEND_PID=$!
    
    echo ""
    echo "=========================================="
    echo "Services started!"
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo "=========================================="
    echo ""
    echo "Access the chat at: http://localhost:5173/dashboard/chat"
    echo ""
    echo "Press Ctrl+C to stop both services"
    
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
    wait
else
    echo "Starting services in tmux session..."
    tmux new-session -d -s nalum-chat
    
    # Backend window
    tmux send-keys -t nalum-chat "cd $(pwd)/backend && npm run dev" C-m
    
    # Frontend window
    tmux split-window -h -t nalum-chat
    tmux send-keys -t nalum-chat "cd $(pwd)/frontend && npm run dev" C-m
    
    echo ""
    echo "=========================================="
    echo "Services started in tmux session 'nalum-chat'"
    echo "=========================================="
    echo ""
    echo "To view the session: tmux attach -t nalum-chat"
    echo "To detach: Press Ctrl+B then D"
    echo "To kill session: tmux kill-session -t nalum-chat"
    echo ""
    echo "Access the chat at: http://localhost:5173/dashboard/chat"
    
    sleep 2
    tmux attach -t nalum-chat
fi
