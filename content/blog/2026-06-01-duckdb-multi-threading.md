---
title: "Solving the DuckDB Threading Puzzle: Faster Pipelines Without the High Costs"
description: "How we upgraded our data pipeline from single-threaded to multi-threaded, solving performance bottlenecks while avoiding common technical traps."
tags:
  - blog
  - duckdb
  - data-engineering
  - performance
  - python
date: 2026-06-01
---

> **TL;DR:** After reducing our cloud costs by 95% using DuckDB, I focused on the next big challenge: **speed**. By moving to a multi-threaded architecture with a file-backed database, we cut our processing time from 9 minutes down to 2. This post explains how I solved the performance bottleneck of network latency and avoided a tricky "memory-only" bug that often traps developers.

## Introduction: Moving Beyond Cost Savings

In my previous post, [Cutting Cloud Costs by 95% with DuckDB](/blog/2026-04-03-duckdb-cloud-cost-optimization), I shared how we saved thousands of dollars by moving computation from BigQuery to a local DuckDB instance. 

While the cost was now very low ($0.25 per run), our pipeline was still running **sequentially**: one task at a time. This meant our total runtime was limited by how fast a single thread could upload files to Google Cloud Storage (GCS) and wait for BigQuery to process them. 

To a Data Engineer, this is a clear "I/O bottleneck." To a CTO or VP of Engineering, this is a "scaling opportunity." I decided to implement multi-threading to see how much speed we could gain. Since the main delays are caused by waiting for the network and external APIs, we can expect the speed to increase proportionally with the number of worker threads we use.

## The Challenge: Why Was It Slow?

Our pipeline handles data for several different regions, distributing it into over 100 different tables. In a single-threaded loop, the process looked like this:

1. Filter data in DuckDB.
2. Upload result to GCS (Wait for network).
3. Append data to BigQuery (Wait for API).
4. **Repeat over 100 times.**

The CPU was mostly idle while waiting for the network. Total time: **9 minutes**.

## The Solution: Multi-Threading with Shared State

The goal was simple: Run multiple uploads and BigQuery jobs at the same time. However, DuckDB connections are not "thread-safe": you cannot easily share one connection across many workers.

### The Wrong Way: The "Data Multiplication" Trap
My first thought was to give every thread its own DuckDB connection. But there was a catch: each thread then tried to re-download the same source data from BigQuery. What was supposed to be 2 simple queries became hundreds of queries. This would have destroyed our cost savings.

### The Right Way: File-Backed Shared Database
I solved this by using a **two-phase architecture**:

1. **Phase 1 (Setup):** One single thread pulls the data from BigQuery once and saves it into a physical `.duckdb` file on the disk.
2. **Phase 2 (Parallel Execution):** Multiple worker threads open that same file in **read-only mode**. 

Because they are only reading, they can all work at the same time without locking or crashing. By having multiple workers share the same file-backed database, we successfully isolated the actual bottleneck: the network latency for uploads and BigQuery ingestion. This approach allowed our execution speed to scale almost linearly with the thread count.

```python
# Phase 2: Concurrent Workers
def process_data(table_name, db_path):
    # Every thread opens the same file read-only
    con = duckdb.connect(db_path, read_only=True)
    try:
        # Perform calculation and upload to GCS
        upload_to_gcs(con.execute(query))
    finally:
        con.close()

# Start multiple workers at once
with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    executor.map(process_data, tables, db_paths)
```

## Solving the "Invisible Table" Bug (`register()` vs `CREATE TABLE`)

During development, I hit a major bottleneck: my worker threads kept saying the tables didn't exist, even though I just created them.

I discovered that I was using the `db.register()` command. In DuckDB, `register()` creates a temporary view that only exists in the computer's memory for that specific connection. As soon as that connection closes, the data disappears.

**The Fix:** I switched to `CREATE TABLE AS SELECT`. This forces DuckDB to write the data permanently to the `.duckdb` file on the disk. This ensured that the data was waiting for the worker threads when they started.

## Improving System Visibility

When running multiple threads at once, logs become a mess. If several threads error at the same time, the logs look like a puzzle. To keep the system maintainable for our EM and fellow engineers, I implemented a **thread-safe accumulator**. Instead of every thread shouting its status, they silently record their progress, and a clean summary is printed at the very end.

## The Results

By solving these technical bottlenecks, we achieved a nearly **4.5x speedup** without increasing our costs.

| Metric | Single-Threaded | Multi-Threaded | Result |
|---|---|---|---|
| **Wall-clock Time** | 9 Minutes | **2 Minutes** | **~4.5x Faster** |
| **Cost per Run** | $0.25 | $0.25 | Same Low Cost |
| **I/O Efficiency** | Low (Sequential) | **High (Parallel)** | Scaling with Threads |

## Conclusion

This project was a great lesson in system architecture. It showed that being a good Data Engineer isn't just about writing SQL; it is about:
- **Identifying Bottlenecks:** Recognizing that the network, not the CPU, was the slow part.
- **Architecting for Scale:** Designing a system where speed increases proportionally with the number of threads.
- **Attention to Detail:** Solving deep-level bugs like the `register()` trap.

By moving to multi-threading, we did not just save money; we built a high-performance system that can handle much larger data volumes in the future.

---
*Are you using DuckDB in production? I’d love to hear how you handle concurrency and performance!*
