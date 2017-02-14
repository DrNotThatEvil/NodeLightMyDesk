#!/bin/bash
SESSION=$USER

tmux -2 new-session -d -s $SESSION

# Setup the Development enviroment for my system.
tmux new-window -t $SESSION:1 -n 'NodeLightMyDesk'
tmux split-window -h
tmux select-pane -t 1
tmux resize-pane -R 18
tmux send-keys "nvim" C-m
tmux select-pane -t 2
tmux send-keys "ssh wilvin@192.168.1.103" C-m 
tmux send-keys "cd NodeLightMyDesk" C-m
tmux resize-pane -D 50 
tmux split-window -v 
tmux select-pane -t 3 
tmux send-keys "git branch" C-m


# Set default window
tmux select-window -t $SESSION:1

# Attach to session
tmux -2 attach-session -t $SESSION
