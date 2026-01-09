---
title: 2025-12-04 SQL Query Optimization 101
description: 
tags:
  - blog
  - sql
  - query
  - optimization
date: 2025-12-04
---

Think this as a starter pack if you wanna run queries that works efficiently.

1. Select only columns you need

    `SELECT *` pulls in every columns, so your query will feel slower and use more resources.

2. Use proper indexing

    Index works like a dictionary, it speeds up the search process. But don't overdo it, as it can slow down INSERTs and UPDATEs.

3. Filter early with WHERE clause

    Put filters to WHERE clause to reduce the amount of data that needs to be processed.

4. Avoid using functions on indexed columns

    Avoid using functions on indexed columns as it can prevent the use of indexes.

5. Joins > subqueries

    Joins are more efficient than subqueries as they can be optimized by the database engine.

6. Limit and offset

    Don't fetch more data than you need it.

7. Use EXPLAIN to analyze performance

    Identify potential bottlenecks and optimize your queries accordingly. Look out for full table scans.

8. Watch out for wildcards

    Wildcards can slow down your queries as they require full table scans. Use them sparingly and consider using LIKE instead of %.

9. Denormalize or cache when needed

    Denormalization can improve query performance by reducing the number of joins required. Caching can also improve performance by reducing the number of queries to the database.

10. Keep it simple

    Keep your queries simple and avoid unnecessary complexity. Use clear and concise language to make your queries easy to understand and maintain.
