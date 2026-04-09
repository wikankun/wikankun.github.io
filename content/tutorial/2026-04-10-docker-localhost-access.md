---
title: Connecting Docker Containers to Localhost Services
description: How to bridge the networking gap so your Docker containers can talk to services running on your host machine.
tags:
  - tutorial
  - docker
  - networking
  - dev-workflow
date: 2026-04-10
---

A common frustration for developers is when a Docker container cannot "see" a database or API running on the host machine. You try `localhost:5432` from inside the container, but it fails. This is because "localhost" inside a container refers to the container itself, not your laptop or server.

## The Magic Hostname: host.docker.internal

Docker provides a special hostname that maps to the IP address of your host machine. Instead of using `localhost` in your connection strings, use `host.docker.internal`.

### Example Connection String

If you're running a PostgreSQL database on your host and trying to connect from a containerized Python app:

```text
# Incorrect (inside a container)
DB_HOST=localhost

# Correct
DB_HOST=host.docker.internal
```

## Platform Differences

Depending on your OS, you might need extra steps:

### 1. Docker Desktop (Windows/macOS)
`host.docker.internal` is supported out of the box. No extra configuration is needed.

### 2. Docker on Linux
If you followed my [[2024-12-27-vps-first-step]] guide and are using Docker Engine on Linux, you must manually enable this in your `docker-compose.yml`:

```yaml
services:
  my-app:
    image: my-python-app
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

## Verify Your Connection

If you're debugging connectivity, you can use the `curl` or `ip addr` commands we discussed in [[2025-11-27-network-commands]]:

```bash
# From inside the container
curl http://host.docker.internal:8000
```

## Summary

Use `host.docker.internal` whenever a containerized app needs to reach:
- A local database (PostgreSQL, MySQL, Redis)
- A local development API
- An SSH tunnel established on the host (see [[2025-06-11-ssh-port-forwarding]])
