---
title: Building a Windows 11 Homelab with Ubuntu Server and Hyper-V
description: Setting up a dedicated, stable homelab foundation using native Windows virtualization.
tags:
  - blog
  - ubuntu
  - virtual-machine
  - server
date: 2026-01-22
---

## Ubuntu Server on Hyper-V for a Windows 11 Homelab

### Background

I’m running a Windows 11 PC and want to build a **proper homelab server**. The goal isn’t just Docker for development, but something closer to a real always-on server for things like self-hosted services, reverse proxy, DNS, and maybe k3s.

Running Docker directly on Windows via Docker Desktop works, but it feels more like a dev setup than a server. It has extra overhead, weird networking edge cases, and updates that can randomly break stuff. For a homelab, stability and predictability matter more than convenience.

So the decision was to run Ubuntu Server inside a virtual machine, and treat it like an actual server.

---

### Why Ubuntu Server

* Linux ecosystem for Docker and homelab tools
* Stable
* Matches production environments
* Lightweight compared to desktop Linux
* Huge community and documentation

Ubuntu Server LTS (24.04) is my choice.

---

### Why Hyper-V

Since the host OS is **Windows 11 Pro**, Hyper-V is already available.

Reasons for choosing Hyper-V:

* Built into Windows, no extra software
* Low overhead and solid performance
* Stable for long-running VMs
* Clean networking with external virtual switch
* Feels closer to real infrastructure than WSL2

Compared to VirtualBox or VMware Player, Hyper-V wins on integration and stability for an always-on homelab.

---

### High-Level Architecture

Windows 11 (Host)
→ Hyper-V
→ Ubuntu Server VM
→ Docker + Docker Compose or k3s
→ Homelab services (DNS, proxy, apps)

The Ubuntu VM gets its own LAN IP so it behaves like a real machine on the network.

---

### Step-by-Step Installation

#### 1. Enable Hyper-V

Make sure virtualization is enabled in BIOS (SVM for AMD, VT-x for Intel).

In Windows:

* Control Panel → Programs → Turn Windows features on or off
* Enable:

  * Hyper-V
  * Hyper-V Management Tools
  * Hyper-V Platform
* Reboot

---

#### 2. Download Ubuntu Server ISO

Download **Ubuntu Server 24.04 LTS** from the official Ubuntu website.

File name looks like:
`ubuntu-24.04.x-live-server-amd64.iso`

---

#### 3. Create External Virtual Switch (Important)

This allows the VM to get a real IP from the router.

* Open Hyper-V Manager
* Virtual Switch Manager
* Create new → External
* Select your physical network adapter (I choose WLAN)
* Enable "Allow management OS to share this network adapter"
* Name it something like `External-WLAN`

---

#### 4. Create the Virtual Machine

* New → Virtual Machine
* Name: `ubuntu-homelab`
* Generation: **Generation 2**
* Memory:

  * 4–8 GB recommended
  * Disable Dynamic Memory (Docker behaves better)
* Network: `External-WLAN`
* Disk:

  * 40–60 GB minimum
* Installation:

  * Use the Ubuntu Server ISO

---

#### 5. VM Settings (Before Boot)

In VM Settings:

**Processor**

* 2–4 vCPUs
* Enable virtualization extensions (future-proofing)

**Security**

* Enable Secure Boot
* Secure Boot template: **Microsoft UEFI Certificate Authority**

This step is required or Ubuntu will fail to boot.

---

#### 6. Install Ubuntu Server

Installer defaults are mostly fine:

* Language and keyboard: default
* Network: DHCP
* Storage: Use entire disk + LVM
* Profile:

  * Set username, password
  * Hostname: `homelab`
* Enable OpenSSH server
* Skip featured snaps

Wait for install → reboot.

---

#### 7. First Boot Setup

Update system:

```
sudo apt update && sudo apt upgrade -y
```

Check IP address:

```
ip a
```

---

#### 8. (Optional) Set Static IP

Edit netplan config:

```
sudo nano /etc/netplan/00-installer-config.yaml
```

Example:

```
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.1.199/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```

Apply:

```
sudo netplan apply
```

---

#### 9. Test SSH Access

From Windows:

```
ssh username@192.168.1.199
```

If this works, the VM is fully usable without the Hyper-V console.

---

### Gotchas and Lessons Learned

* Docker Desktop is fine for dev, but annoying for homelab
* Disable Dynamic Memory in Hyper-V for Docker stability
* Always use an **External** virtual switch for homelab services
* Secure Boot must use **Microsoft UEFI Certificate Authority**
* Docker eats disk faster than expected, allocate more storage early
* Static IP saves a lot of pain later (DNS, reverse proxy, bookmarks)

---

### What Comes Next

Typical next steps after this setup:

* I recommend following my tutorial [[2024-12-27-vps-first-step]]
* Deploy:

  * Portainer or Dockge
  * Nginx Proxy Manager or Traefik
  * DNS (AdGuard Home / Pi-hole)
* Later upgrade path:

  * k3s

This setup is simple, stable, and scales well as a real homelab foundation.
