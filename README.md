GHOSTRECON
Advanced OSINT Dork Engine
<div align="center">
https://img.shields.io/badge/version-2.0-blue?style=flat-square
https://img.shields.io/badge/license-MIT-green?style=flat-square
https://img.shields.io/badge/status-stable-brightgreen?style=flat-square

Self-contained web-based tool for building and executing Google dorks for OSINT research and security testing.

</div>
✨ Features
Feature	Description
200+ Pre-built Dorks	Security-focused and file-hunting categories
Dual Mode	CYBER_INTEL + FILE_HUNTER
5 Search Engines	Google, Bing, DuckDuckGo, Brave, Yandex
Target Profiling	Auto-inject domains with site: operator
Bulk Operations	Queue and launch multiple dorks
Custom Constructor	Build advanced queries with operator chips
Export	Save dorks as TXT, JSON, or CSV
Zero Dependencies	Self-contained, no tracking, local storage only
🚀 Quick Start
bash
git clone https://github.com/yourusername/ghostrecon.git
cd ghostrecon
python -m http.server 8080
# or open index.html directly
📖 Basic Usage
Set target domain (optional) → Save for persistence

Choose mode → CYBER_INTEL or FILE_HUNTER

Select search engine → Default: Google

Browse categories → Click any card to view dorks

Execute → Run individual dorks or use bulk queue

Custom Constructor Example
text
site:example.com inurl:admin filetype:php intitle:"login"
filetype:sql intext:password OR intext:username
🎨 Themes
Toggle between Dim (default), Void, and White using the theme pill in header.

⚠️ Disclaimer
For authorized security research, CTF, bug bounty, and ethical OSINT only. Users are solely responsible for compliance with laws and terms of service.

<div align="center">
MIT License • Built for ethical security research

</div>
