---
title: Fixing 'Permission Denied': A Quick chmod and chown Guide
description: A cheat sheet for resetting file and directory ownership safely in Linux.
tags:
  - tutorial
  - linux
  - security
  - guide
date: 2026-04-09
---

The "Permission Denied" error is a common headache in Linux. Usually, it means one of two things: the wrong user owns the file, or the file doesn't have the right access permissions.

## Who Owns the File? (chown)

If you created a file as `root` but now want to edit it as your normal user (`ubuntu`), you need to change the owner:

```bash
# Change owner of a single file
sudo chown ubuntu:ubuntu my_file.txt

# Change owner of an entire folder and all its contents
sudo chown -R ubuntu:ubuntu my_project_folder/
```

- `ubuntu`: The new owner.
- `:ubuntu`: The new group (usually the same as the owner).
- `-R`: Recursive (affects all files inside).

## Who Can Access the File? (chmod)

Permissions are set for three groups: **Owner**, **Group**, and **Others**.

### The Numerical Way

- `7`: Read, Write, Execute (Full Access).
- `6`: Read, Write (Standard for Files).
- `5`: Read, Execute (Standard for Folders).
- `4`: Read Only.

### Common Recommended Settings

```bash
# Secure Folders (755) - Owner can do everything, others can see/enter
chmod 755 my_folder/

# Secure Files (644) - Owner can read/write, others can only read
chmod 644 my_file.txt

# Executable Scripts (700 or 755) - Let the owner run the script
chmod +x my_script.sh
```

## Troubleshooting Tip

If you're still getting errors:

1.  Check the current permissions: `ls -la`
2.  Avoid `chmod 777` if possible, as it gives everyone on the system full control over the file.
3.  Ensure your user is part of the necessary group (e.g., `sudo usermod -aG docker $USER`).
