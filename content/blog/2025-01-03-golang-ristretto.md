---
title: 2025-01-03 Golang Ristretto
description: 
tags:
  - blog
  - thought
  - golang
  - package
date: 2025-01-03
---
## Observation

While working on [pricehistory.id](https://pricehistory.id), I'm also looking for a golang package to handle local in-memory cache. I found several potential packages, they're allegro/bigcache, coocood/freecache, and dgraph-io/ristretto. Three of them are all popular package for in-memory cache. So I did my research on several key aspects: maintainer's activity, performance, features. After some careful consideration, my choice went to dgraph-io/ristretto. Besides of it's performance outperforms the other two, it also have the feature I need. It's the dynamic expiration.

## Overview & Features

[Ristretto](https://github.com/dgraph-io/ristretto) is a fast, concurrent cache library built with a focus on performance and correctness.

The motivation to build Ristretto comes from the need for a contention-free cache in [Dgraph](https://github.com/dgraph-io/dgraph).

Features:

- **High Hit Ratios** - with our unique admission/eviction policy pairing, Ristretto's performance is best in class.
    - **Eviction: SampledLFU** - on par with exact LRU and better performance on Search and Database traces.
    - **Admission: TinyLFU** - extra performance with little memory overhead (12 bits per counter).
- **Fast Throughput** - we use a variety of techniques for managing contention and the result is excellent throughput.
- **Cost-Based Eviction** - any large new item deemed valuable can evict multiple smaller items (cost could be anything).
- **Fully Concurrent** - you can use as many goroutines as you want with little throughput degradation.
- **Metrics** - optional performance metrics for throughput, hit ratios, and other stats.
- **Simple API** - just figure out your ideal `Config` values and you're off and running.

## Implementation & Breakdown

The dgraph-io/risretto implementation is quite simple:

1. First we need to install the package:

	```
	$ go get github.com/dgraph-io/ristretto/v2
	```

2. Then we need to instantiate a ristretto cache with these configs:

	```
	cache, err := ristretto.NewCache(&ristretto.Config{
		NumCounters: 1e7,     // Num keys to track frequency of (10M).
		MaxCost:     1 << 30, // Maximum cost of cache (1GB).
		BufferItems: 64,      // Number of keys per Get buffer.
	})
	```

	NumCounters is assigned with 1e7, it means the number of keys to track frequency of is 10^7 = 10 millions. MaxCost is assigned with 1 << 30, it means the maximum cost of cache is 1 times by 2, 30 times bytes. Or you can write that as 2^30 bytes = 1 GB. The last config is BufferItems, the default value is 64, don't change this value unless you know what you are doing.

3. Set the key-value pair

	```
	cache.SetWithTTL("key", "value", 0, 10*time.Minute)
	```

	0 means the cost is determined by ristretto, and 10\*time.Minute means the cache will be expired after 10 minutes.

4. Get the key-value pair

	```
	value, found := cache.Get("key")
	```

## Full Code

```
package main

import (
	"fmt"

	"github.com/dgraph-io/ristretto/v2"
)

func main() {
	cache, err := ristretto.NewCache(&ristretto.Config[string, string]{
		NumCounters: 1e7,     // number of keys to track frequency of (10M).
		MaxCost:     1 << 30, // maximum cost of cache (1GB).
		BufferItems: 64,      // number of keys per Get buffer.
	})
	if err != nil {
		panic(err)
	}
	defer cache.Close()

	// set a value with a cost of 1
	cache.SetWithTTL("key", "value", 0, 10*time.Minute)

	// wait for value to pass through buffers
	cache.Wait()

	// get value from cache
	value, found := cache.Get("key")
	if !found {
		panic("missing value")
	}
	fmt.Println(value)

	// del value from cache
	cache.Del("key")
}
```