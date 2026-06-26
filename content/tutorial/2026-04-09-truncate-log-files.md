---
title: How to Safely Truncate Massive Log Files
description: Clear disk space by emptying logs without breaking the applications writing to them.
tags:
  - tutorial
  - linux
  - storage
  - server
date: 2026-04-09
---

When a server runs for a long time, its log files can grow to several gigabytes, potentially filling up your disk. If you delete the log file using `rm`, the application writing to it might crash or continue writing to a "ghost" file that still occupies disk space.

The solution is **truncation**.

## The Truncation Trick

To empty a log file without deleting it, use the redirection operator:

```bash
> /var/log/my_app.log
```

This instantly sets the file size to 0 bytes while keeping the file descriptor open for the application. The app doesn't need to be restarted.

## Other Ways to Truncate

You can also use the `truncate` command:

```bash
sudo truncate -s 0 /var/log/my_app.log
```

Or the `true` command:

```bash
true > /var/log/my_app.log
```

## Why Not Use `rm`?

When an application opens a file, it holds a file descriptor. If you `rm` the file, the entry is removed from the directory, but the file descriptor stays open. The disk space won't actually be freed until the application is restarted, and you won't be able to see where the data is being written.

## Long-term Solution: logrotate

Manually truncating files is a temporary fix. For a permanent solution, use `logrotate`. It automatically rotates, compresses, and deletes old logs.

Most Linux distributions have it installed by default. You can find configurations in `/etc/logrotate.d/`.
