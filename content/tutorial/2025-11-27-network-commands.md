---
title: Essential Linux Network Commands for Debugging
description: A cheat sheet for identifying IPs, ports, and DNS issues in Linux.
tags:
  - tutorial
  - ubuntu
  - network
date: 2025-11-27
---

## Find Your IP Address

You can find your IP address by using command:
```
ip addr
```

You can also use `hostname` command:
```
hostname -i
```

## Find All Processes Listen on a Port

```
lsof -i -P | grep LISTEN
```

## Check DNS

Using nslookup:
```
nslookup google.com
```

Using dig:
```
dig google.com
```

Once you've verified your network settings, you can move on to more advanced tasks like [[2025-03-09-proxy-testing]] or setting up secure access via [[2025-06-11-ssh-port-forwarding]].
