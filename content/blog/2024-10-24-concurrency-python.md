---
title: 2024-10-24 Concurrency In Python
description: 
tags:
  - blog
  - python
  - concurrency
date: 2024-10-24
---

There are several types of concurrency and parallelism in python: multiprocessing, multithreading, and asynchronous. Before comparing them, I'll explain each with definitions and analogies to make them easier to understand.

## Definition
### Multiprocessing

Multiprocessing is a programming technique that allows a program to run multiple processes, each with its own memory space and resources, on multiple CPU cores. This enable true parallel execution, making it ideal for CPU-bound tasks. Since processes do not share memory, they can execute independently without conflicts, maximizing CPU utilization for compute-intensive workloads.

It's like having several workers, each with their own tools and workspace. They can work independently without waiting to use shared resources. So, multiprocessing is better for CPU-bound tasks or heavy computation, because each worker has its own resources and doesn't need to worry about other workers.

### Multithreading

Multithreading is a programming technique that enables a program to run multiple threads (smaller units of process) within the same process. These threads shared the same memroy space and resources, allowing tasks to run concurrently within a process.

It's like having several workers, each working on the same type of tasks but in shifts, sharing the same tools and workspace (resources). They can work simultaneously, but they need to wait for others to finish using the resources. This method is efficient for I/O-bound tasks like reading files, but since they share resources, they have to take turns to avoid conflicts, often by using resource locking.

### Asynchronous

Asynchronous is a programming technique where tasks are initiated and managed in a non-blocking manner, allowing the program to continue executing other tasks while waiting for slow operations, like network request or file I/O to complete. Rather than relying on multiple threads or processes, asynchronous programming use callbacks or event loops to handle tasks as they finish, making it efficient for handling I/O bound tasks with minimal overhead.

Asynchronous processing is like having workers acting as secretaries. They need to make and receive calls and messages while aslo handling other administrative tasks. So, while waiting for an external response (in this case, calls or messages), they continue working on other tasks to stay efficient. This method is ideal for I/O-bound tasks that rely on external sources. Without multitasking, waiting idly for responses would definitely hinder the progress of other tasks.

## Tradeoff

Now let's compare the tradeoffs of each method.

### Multiprocessing

Pros:
- True parallelism for CPU-bound tasks
- No memory sharing problem (race condition or deadlock)
Cons:
- Higher memory usage
- Slower communication
- More costly to create and switch between processes

### Multithreading

Pros:
- Efficient for I/O-bound tasks
- Lower memory usage
- Faster context switching
Cons:
- Concurrency issues (race condition or deadlock)
- Limited performance improvements for CPU-bound tasks

### Asynchronous

Pros:
- Highly efficient for I/O bound tasks
- Minimal overhead since it doesn't require multiple threads or processes
Cons:
- Difficult to debug
- Not suitable for CPU-bound tasks

## Example
### Multiprocessing

Image processing.

Each image can be processed independently, and multiprocessing leverages multiple CPU cores, allowing true parallelism for computationally intensive tasks.

### Multithreading

File reading and logging.

File I/O is typically slow, so while one thread is waiting for the disk to read data, other threads can perform logging or process data.

### Asynchronous

Web scraping.

It's perfect for tasks like waiting for network responses. While one request is pending, the program can send other requests or process previously retrieved data, maximizing efficiency.

## Summary

As a rule of thumb:
> Use **multiprocessing** for tasks that need high CPU power.

> Use **asynchronous** when you have many I/O-bound tasks especially network calls.

> Use **multithreading** when it's neither of the two above.
