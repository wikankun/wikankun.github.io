---
title: 5 Critical First Steps for Securing Your New VPS
description: Essential security and configuration tasks for every new server deployment.
tags:
  - tutorial
  - ubuntu
  - vps
  - server
date: 2024-12-27
---

## The very first steps whenever I rented a VPS

1. Update and upgrade all software

    ```
    sudo apt update
    sudo apt upgrade
    ```

2. Create a non-root user
   1. Create new user
        ```
        adduser {newuser}
        ```
   2. Grant sudo privilege to new user
        ```
        usermod -aG sudo {newuser}
        ```

3. Create ssh connection to new user
   1. Create a authorized_keys file
        ```
        nano /home/{newuser}/.ssh/authorized_keys
        ```
   2. Add your public key to authorized_keys file
   3. Log out to log in to new user. (If you run into permission errors here, see my [[2026-04-09-fix-linux-permissions]] guide).

4. Install docker (using convenience script)

    ```
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh ./get-docker.sh
    ```

5. Manage docker as a non-root user (docker post-install)
    ```
    sudo groupadd docker
    sudo usermod -aG docker $USER
    newgrp docker
    ```

For a more detailed breakdown of why this step is important and how it works, see [[2026-04-10-docker-socket-permissions]].
