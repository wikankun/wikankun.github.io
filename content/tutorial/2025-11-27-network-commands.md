---
title: 2025-11-27 Network Commands
description: 
tags:
  - tutorial
  - ubuntu
  - network
date: 2025-11-27
---

# Find Your IP Address

You can find your IP address by using command:
```
ip addr
```

You can also use `hostname` command:
```
hostname -i
```

# Find All Processes Listen on a Port

```
lsof -i -P | grep LISTEN
```
