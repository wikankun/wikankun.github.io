---
title: Simplify Server Access with SSH Config Aliases
description: Stop memorizing IPs and start using short aliases to connect to your remote servers.
tags:
  - tutorial
  - ssh
  - productivity
  - linux
date: 2026-04-09
---

Stop typing `ssh username@192.168.1.199` every time you want to connect to your homelab. With an SSH config file, you can use shortcuts like `ssh homelab`.

## Why Use an SSH Config?

- **Simplicity:** No need to remember IP addresses.
- **Efficiency:** Store usernames and identity files once.
- **Clarity:** Organizes your remote connections in one place.

## How to Set It Up

The config file lives in your local machine's `.ssh` directory. If it doesn't exist, create it:

```bash
mkdir -p ~/.ssh
touch ~/.ssh/config
chmod 600 ~/.ssh/config
```

## Adding Your First Alias

Open the file with your favorite editor (`nano ~/.ssh/config`) and add your server details:

```text
Host homelab
    HostName 192.168.1.199
    User ubuntu
    IdentityFile ~/.ssh/my_private_key
```

Now, instead of the long command, you only need:

```bash
ssh homelab
```

## More Advanced Options

You can add multiple hosts and even set default options:

```text
Host *
    ServerAliveInterval 60
    AddKeysToAgent yes

Host production
    HostName 10.0.1.5
    User deployer
    Port 2222
```

## Port Forwarding Integration

You can even store your port forwarding rules (like from our SSH tunneling guide) directly in the config:

```text
Host db-tunnel
    HostName 10.0.1.5
    User admin
    LocalForward 5432 localhost:5432
```

Now, running `ssh db-tunnel` automatically sets up the tunnel while logging you in.
