# GHOSTRECON

## Advanced OSINT Dork Engine

<div align="center">

![Release](https://img.shields.io/badge/Release-v2.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen?style=for-the-badge)

</div>

---

**Zero-dependency web tool for cybersecurity reconnaissance and OSINT gathering.**

---

## Overview

GhostRecon provides security professionals with a comprehensive interface for constructing and executing search engine dorks. Features an extensive database of curated queries, multi-engine support, and advanced query construction — all without external dependencies or tracking.

**Use Cases:** Authorized penetration testing · Bug bounty programs · CTF competitions · Security research

---

## Capabilities

| Module | Description |
|:-------|:------------|
| **Cyber Intelligence** | Attack surface mapping, credential discovery, configuration leaks, API reconnaissance |
| **File Hunter** | Document discovery, source code analysis, backup archives, public records |
| **Custom Constructor** | Operator-assisted query building |
| **Bulk Execution** | Queue management for sequential dork deployment |

**Search Engines:** Google · Bing · DuckDuckGo · Brave · Yandex

---

## Installation

```bash
git clone https://github.com/yourusername/ghostrecon.git
cd ghostrecon
python -m http.server 8080

Then open http://localhost:8080 in your browser.

No build steps or package installation required.

Operation
Step	Action
1	Configure target domain. The tool auto-injects the site: operator.
2	Select mode: CYBER_INTEL or FILE_HUNTER.
3	Choose search engine.
4	Browse and filter dork categories.
5	Execute individual queries or use bulk queue.
Constructor Examples
site:example.com inurl:admin filetype:php intitle:"login"
filetype:sql intext:"CREATE TABLE" intext:password
site:github.com "api_key" "example.com"
Legal

This tool is for authorized security assessments, bug bounty programs, CTF competitions, and ethical OSINT research. Users are responsible for their own compliance with applicable laws and regulations.

<div align="center">

MIT License · Built for security professionals

</div> ```
