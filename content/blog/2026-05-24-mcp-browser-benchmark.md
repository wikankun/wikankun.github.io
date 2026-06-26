---
title: MCP Browser Benchmarking - Obscura vs. Lightpanda vs. Chrome DevTools
description: A head-to-head comparison of browser-based MCP tools across 10 real-world test cases to find the best tool for autonomous agents.
tags:
  - blog
  - mcp
  - browser-automation
  - ai-agents
  - benchmarking
date: 2026-05-24
---

I've been spending a lot of time lately playing around with different **Model Context Protocol (MCP)** servers for browser automation. As agents become more capable, the "eyes" and "hands" they use to navigate the web are becoming the biggest bottleneck.

Currently, we have three main contenders in the ecosystem: **Obscura**, **Lightpanda**, and the classic **Chrome DevTools (CDV)**. Each one claims a different crown—whether it's speed, reliability, or token efficiency.

I wanted to see which one actually holds up when things get messy. So, I ran them through a gauntlet.

## Background: Why Benchmark Browser Tools?

When you're building autonomous agents, the browser tool is often the most expensive part of the loop. If the tool fails to render a page correctly, the agent gets stuck in a loop. If it returns too much junk data, you burn through your token budget. 

I needed a tool that could handle:
1. **Modern SPAs:** Sites that don't just load HTML, but require complex JS execution.
2. **Anti-Bot Measures:** Bypassing CAPTCHAs and "Are you a human?" checks.
3. **Efficiency:** Getting the data the agent needs without sending back the entire DOM tree.

## How I Did This

I set up a standardized test suite covering 10 common scenarios that an agent might face. This included simple HTML sites (Hacker News), heavy media sites (YouTube), and complex interactions (TodoMVC, multi-step forms).

I ran each tool through the same set of tasks and URLs, measuring:
- **Success Rate:** Did it actually get the data or perform the action?
- **Bot Detection:** How quickly did it trigger a ban?
- **Speed:** How much latency did it add to the loop?
- **Token Usage:** How lean was the snapshot sent back to the LLM?

Here is what I found.

## The Benchmark Report

| Test Case | Obscura Result | Lightpanda Result | Chrome DevTools Result | Notes |
|-----------|----------------|-------------------|-------------------------|-------|
| Search Engine (Google) | ❌ (CAPTCHA) | ❌ (CAPTCHA) | ❌ (CAPTCHA) | All triggered Google's bot detection immediately. |
| Search Engine (DuckDuckGo) | ❌ (Empty) | ❌ (Bot Challenge) | ✅ | CDV was the only one that rendered the SERP correctly. |
| Social (Reddit) | ❌ (Verification) | ✅ (Full Access) | ⚠️ (Partial) | CDV bypassed initial verification but content was limited in first snapshot. |
| Social (Hacker News) | ✅ | ✅ | ✅ | Simple HTML is handled perfectly by all. |
| GitHub Repository Search | ✅ | ✅ | ✅ | All retrieved search results correctly. |
| OSS Documentation Read | ✅ | ✅ | ✅ | All read dbt documentation successfully. |
| SPA Interaction (TodoMVC) | ❌ (No update) | ❌ (No update) | ✅ | CDV correctly triggered listeners and updated the DOM list/counter. |
| Multi-Step Forms (Auth) | ❌ (No nav) | ❌ (No nav) | ✅ | CDV was the only one to reliably handle the form submission and navigation. |
| JS/Infinite Scroll | ❌ (No content) | ❌ (No content) | ✅ | CDV successfully triggered scroll listeners and captured async content. |
| Heavy Media (YouTube) | ⚠️ (Partial) | ✅ (Very Fast) | ✅ | LP is significantly faster on heavy sites due to lack of visual rendering. |
| Network Interception | N/A | N/A | ✅ | CDV is the only one with first-class network request inspection. |

## Final Scoring (1-10)

| Metric | Obscura | Lightpanda | Chrome DevTools |
|--------|---------|------------|-----------------|
| Success Rate | 3/10 | 5/10 | **9/10** |
| Bot Detection | 4/10 | **7/10** | 6/10 |
| Speed | 5/10 | **9/10** | 6/10 |
| Token Usage | 4/10 | **9/10** | 3/10 |
| **Weighted Average** | **3.75** | **6.90** | **6.60** |

### **Calculation Methodology**
The **Weighted Average** is calculated using the following priorities:
- **Success Rate (40%):** The primary indicator of reliability for autonomous tasks.
- **Bot Detection (25%):** Critical for bypassing modern anti-bot measures.
- **Token Usage (20%):** Measures efficiency in token consumption.
- **Speed (15%):** Measures latency and responsiveness.

**Formula:**  
`(Success * 0.40) + (BotDetection * 0.25) + (TokenUsage * 0.20) + (Speed * 0.15)`

## Observations

- **Lightpanda (Winner for Efficiency):** Remains the fastest and most token-friendly tool. It's built on a custom Rust-based browser engine (not Chromium), which makes it incredibly lean. However, it is increasingly vulnerable to bot challenges on search engines like DuckDuckGo.
- **Chrome DevTools (Winner for Reliability):** The most robust tool for *actually getting the job done* on complex or protected sites. Because it uses a real Chromium instance, it was the only tool to successfully perform a search and handle all SPA/form interactions correctly.
- **Obscura:** Struggled significantly with SERPs and dynamic updates, often returning empty or partial snapshots. It seems to struggle with sites that rely heavily on late-loading JS.

## Final Thoughts

This was a great reminder that "fast" isn't always "better" if it means failing the task. If your agent is doing simple scrapers or reading documentation, **Lightpanda** is a no-brainer for the token savings alone. 

But if you need your agent to login, submit forms, or navigate complex apps, **Chrome DevTools** is still the gold standard, despite the heavier token cost.
