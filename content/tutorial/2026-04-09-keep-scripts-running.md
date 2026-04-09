---
title: Running Scripts in the Background with tmux and nohup
description: Ensure your long-running tasks continue executing even after you disconnect from the terminal.
tags:
  - tutorial
  - linux
  - automation
  - server
date: 2026-04-09
---

When you log into a remote server via SSH, the processes you start are children of that SSH session. If you close your laptop or the connection drops, your script will stop. Here is how to keep them running.

## Method 1: The Quick Fix with nohup

If you have a script you want to fire and forget, use `nohup` (no hang up):

```bash
nohup python my_script.py &
```

- `nohup`: Prevents the script from being killed when the terminal closes.
- `&`: Runs the process in the background.

By default, any output from the script will be written to a file named `nohup.out` in the current directory.

## Method 2: The Pro Way with tmux

`tmux` is a terminal multiplexer that allows you to start a session and then "detach" from it. The session stays alive on the server, even if you log out.

### 1. Start a New Session

```bash
tmux new -s my-session
```

### 2. Run Your Script

Now you are inside the `tmux` window. Run your script normally:

```bash
python my_script.py
```

### 3. Detach (The Magic Step)

Press `Ctrl + B`, then let go and press `D`. You will be back in your normal terminal, but your script is still running in the background.

### 4. Re-attach Later

When you log back in later and want to check on your script:

```bash
tmux attach -t my-session
```

## When to Use Which?

- Use **nohup** for simple, one-off scripts where you only care about the log output.
- Use **tmux** for interactive tasks, complex debugging, or when you want to return and see the terminal output as it happened.
