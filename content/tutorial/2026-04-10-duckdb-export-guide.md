---
title: Exporting Data: Saving DuckDB Tables to Parquet and CSV
description: A quick reference for exporting your DuckDB analytical results into portable, high-performance file formats.
tags:
  - tutorial
  - duckdb
  - data-engineering
  - sql
date: 2026-04-10
---

As we explored in [[2026-04-03-duckdb-cloud-cost-optimization]], DuckDB is fantastic for local processing and distribution. Once you've analyzed or filtered your data, you'll need to export it for downstream users.

## Exporting to Parquet (Recommended)

Parquet is the best choice for data engineering tasks because it's compressed, columnar, and stores schema information.

```sql
COPY (SELECT * FROM my_table) 
TO 'output.parquet' (FORMAT PARQUET);
```

### Why Use Parquet?
- **Speed:** Faster to read than CSV.
- **Portability:** Can be easily consumed by Polars or Pandas (see [[2025-03-09-pandas-vs-polars]]).
- **Compression:** Saves significant disk space.

## Exporting to CSV

If you need the data to be human-readable or compatible with Excel, export it to CSV:

```sql
COPY (SELECT * FROM my_table) 
TO 'output.csv' (HEADER, DELIMITER ',');
```

- `HEADER`: Includes column names in the first row.
- `DELIMITER`: Sets the separator (comma is standard).

## Exporting an Entire Database

If you want to move your whole DuckDB session to another machine:

```sql
EXPORT DATABASE 'my_export_folder';
```

This will generate a series of Parquet files and a `schema.sql` file that you can re-import later:

```sql
IMPORT DATABASE 'my_export_folder';
```

## Using the DuckDB UI

If you prefer a visual experience, as seen in [[2026-01-10-duckdb-ui]], you can run these `COPY` commands directly in the notebook cells to generate files locally.
