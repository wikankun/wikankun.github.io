---
title: Running Docker Without Sudo = A Quick Permissions Fix
description: Stop typing sudo for every Docker command by adding your user to the docker group.
tags:
  - tutorial
  - docker
  - linux
  - security
date: 2026-04-10
---

After completing your [[2024-12-27-vps-first-step]] or [[2024-10-27-after-install-ubuntu]], you might notice that running `docker ps` returns a "Permission Denied" error unless you prefix it with `sudo`. This happens because the Docker daemon binds to a Unix socket owned by the `root` user.

## The Solution: The Docker Group

Docker provides a specific Unix group called `docker`. Any user added to this group is granted permissions to communicate with the Docker daemon without `sudo`.

### 1. Create the Docker Group

On most systems, this group is created automatically during installation, but you can ensure it exists with:

```bash
sudo groupadd docker
```

### 2. Add Your User to the Group

Replace `$USER` with your actual username if you aren't currently logged in as the target user:

```bash
sudo usermod -aG docker $USER
```

### 3. Apply the Changes

For the group change to take effect, you normally need to log out and log back in. However, you can "refresh" your current shell session immediately:

```bash
newgrp docker
```

## Verify the Fix

Run a simple Docker command without `sudo` to confirm it works:

```bash
docker run hello-world
```

## A Security Warning

While this makes development significantly more convenient, be aware that adding a user to the `docker` group is security-equivalent to granting them `root` access. Ensure only trusted users have this permission on your production servers.
