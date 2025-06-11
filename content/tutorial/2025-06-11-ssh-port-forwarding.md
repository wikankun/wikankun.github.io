---
title: 2025-06-11 SSH Port Forwarding
description: 
tags:
  - tutorial
  - ssh
  - server
date: 2025-06-11
---

Let's talk about SSH port forwarding. It's a tool that is super useful but often ignored until you're in that "well, shit" moment of needing it.

## What Is SSH Port Forwarding?

SSH port forwarding (aka SSH tunneling) is like sneaking your network traffic through a secret tunnel. Instead of exposing ports publicly or punching holes in firewalls like a maniac, you just tell SSH to quietly forward traffic from one machine to another.

In simpler terms:

- You have your local dev laptop
- You want to access something on remote server
- That "something" is locked behind firewall or only accessible from that remote server
- SHH port forwarding lets yoy "pretend" that the service is running on your local machine

## Types of SSH Port Forwarding

There are three types:

1. Local Forwarding

    You forward a local port on your machine to a remote address. Example use case: accessing a database that's only open on localhost of the remote machine.

2. Remote Forwarding

    You open a port on the remote machine and forward it back to your local machine. Example use case: letting someone SSH into your local dev machine via a remote server.

3. Dynamic Forwarding

    You basically make your SSH client act like a SOCKS proxy. It's like a running a poor man's VPN.

## How to Do It

1. Local Port Forwarding

    ```
    ssh -L 8080:localhost:3000 user@remote.server
    ```

    Explanation:
    - `-L`: local forwarding
    - `8080`: port on your local machine
    - `localhost:3000`: where the remote service lives
    - `user@remote.server`: the SSH target

    Or you can add it into your ~/.ssh/config file:

    ```
    Host remote.server
        HostName remote.server
        User user
        IdentityFile ~/.ssh/ssh_pubkey
        LocalForward 8080 localhost:3000
    ```

    Now when you access localhost:8080 on your laptop, it's showing `remote.server:3000`

2. Remote Port Forwarding

    ```
    ssh -R 8080:localhost:3000 user@remote.server
    ```

    This makes port 8080 on `remote.server` forward to your local port 3000

3. Dynamic Port Forwarding

    ```
    ssh -D 1080 user@remote.server
    ```

    Then set your browser to use `localhost:1080` as a SOCKS5 proxy. Boom, traffic goes through the server.

## Why Should Devs Care?

Honestly, port forwarding saves your ass in a lot of dev and ops scenarios. Here's how:

- Secure Access to Internal Services: Need to check a Grafana dashboard or internal DB on a staging server? Tunnel it.

- Bypass Firewall Restrictions: You’re at a sketchy Wi-Fi café that blocks weird ports? Tunnel through port 22 (SSH is rarely blocked).

- Expose Local Dev Servers for Remote Testing: Working on a web service locally but want a teammate to test it? Use remote forwarding.

- Proxying Web Traffic: Want to pretend you’re browsing from Singapore while working from your kampung? Dynamic forwarding + SOCKS proxy.

## TL;DR

SSH port forwarding is basically networking dark magic that lets you route traffic through secure tunnels. Use it to:

- Access remote services as if they’re local.

- Avoid exposing ports to the public internet.

- Make life less painful in dev environments.

It’s like Swiss Army knife stuff. Learn it once, and you’ll thank yourself in every weird debugging session, staging environment, or when dealing with that one server that refuses to behave like a normal human being.
