---
title: Clearing Disk Space: Finding Large Files Fast
description: A quick guide to identifying and removing the files eating your server's storage.
tags:
  - tutorial
  - linux
  - storage
  - debugging
date: 2026-04-09
---

Nothing stops a project faster than a "No space left on device" error. When your disk is full, you need to find the culprits quickly without scanning every single directory manually.

## Find the Biggest Directories

The `du` (disk usage) command is your best friend here. Use this one-liner to see the size of all items in your current directory, sorted by size:

```bash
sudo du -sh * | sort -h
```

- `-s`: Summary (don't list every sub-file).
- `-h`: Human-readable (KB, MB, GB).
- `sort -h`: Sorts the output by human-readable sizes (putting the GBs at the bottom).

## Scan the Entire System

If you aren't sure where the leak is, start from the root (`/`) but exclude other file systems (like network mounts or external drives):

```bash
sudo du -xhd 1 / | sort -h
```

- `-x`: Stay on one file system.
- `-d 1`: Only show one level of depth.

## The Interactive Way: ncdu

If you want a more visual experience, install `ncdu`:

```bash
sudo apt install ncdu
ncdu /
```

This tool allows you to navigate your folders with arrow keys and see exactly where the space is going in real-time.

## Quick Wins for Cleaning

Once you find the large files, here are the common areas to check:

1.  **APT Cache:** `sudo apt clean` removes downloaded `.deb` files.
2.  **Old Logs:** Check `/var/log` for large `.gz` files.
3.  **Docker Volumes:** `docker system prune` can often recover gigabytes of "dangling" data.
