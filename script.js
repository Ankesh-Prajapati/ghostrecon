/* ============================================================
   GHOSTRECON — script.js
   Advanced OSINT Dork Engine
   No tracking. No ads. No external calls.
   ============================================================ */

/* ══════════════════════════════════════════════════════
   DORKS DATABASE
══════════════════════════════════════════════════════ */
const DORKS = [
  // ── CYBER INTEL ──────────────────────────────────────
  { type:'sec', cat:'Attack Surface Mapping', icon:'fa-map-marked-alt', color:'#a78bfa', items:[
    {l:'Exposed login endpoints',        d:'inurl:login OR inurl:signin OR inurl:auth'},
    {l:'Admin areas',                    d:'inurl:admin OR inurl:dashboard OR inurl:administrator'},
    {l:'Staging/pre-prod environments',  d:'inurl:staging OR inurl:preprod OR inurl:uat OR inurl:dev'},
    {l:'Status & uptime pages',          d:'intitle:"status page" OR inurl:/status OR inurl:/health'},
    {l:'Subdomain references',           d:'intext:"api." OR intext:"dev." OR intext:"test."'},
    {l:'Sitemap intelligence',           d:'inurl:sitemap.xml OR inurl:sitemap_index.xml'},
    {l:'Open redirect candidates',       d:'inurl:redirect= OR inurl:return= OR inurl:url= OR inurl:next='},
    {l:'Debug & diagnostic endpoints',   d:'inurl:debug OR inurl:console OR inurl:/actuator'},
  ]},
  { type:'sec', cat:'Secrets & Tokens', icon:'fa-key', color:'#f59e0b', items:[
    {l:'API keys in source',             d:'intext:"api_key" OR intext:"apiKey" OR intext:"client_secret"'},
    {l:'Bearer JWT tokens',              d:'intext:"Bearer eyJ"'},
    {l:'AWS access keys',                d:'intext:"AKIA" OR intext:"aws_secret_access_key"'},
    {l:'Private key blocks',             d:'intext:"BEGIN PRIVATE KEY" OR intext:"BEGIN RSA PRIVATE KEY"'},
    {l:'Webhook secrets',                d:'intext:"webhook_secret" OR intext:"webhook_token"'},
    {l:'Slack tokens',                   d:'intext:"xoxb-" OR intext:"xoxp-"'},
    {l:'Discord webhooks',               d:'intext:"discordapp.com/api/webhooks"'},
    {l:'Google service account JSON',    d:'filetype:json intext:"private_key_id" intext:"client_email"'},
    {l:'Stripe live keys',               d:'intext:"sk_live_" OR intext:"pk_live_"'},
    {l:'Firebase tokens',                d:'intext:"firebaseio.com" OR intext:"firebase_token"'},
  ]},
  { type:'sec', cat:'Exposed Documents', icon:'fa-file-shield', color:'#ef4444', items:[
    {l:'PDF files',                      d:'filetype:pdf'},
    {l:'Spreadsheets',                   d:'filetype:xls OR filetype:xlsx OR filetype:csv'},
    {l:'Word documents',                 d:'filetype:doc OR filetype:docx'},
    {l:'Presentations',                  d:'filetype:ppt OR filetype:pptx'},
    {l:'Text/Markdown notes',            d:'filetype:txt OR filetype:md'},
    {l:'Open directory indexes',         d:'intitle:"index of"'},
    {l:'Confidential PDFs',             d:'filetype:pdf intitle:"confidential" OR intitle:"internal only"'},
    {l:'Password files',                 d:'filetype:txt intext:password OR intext:passwd'},
  ]},
  { type:'sec', cat:'Server Config Leaks', icon:'fa-server', color:'#22d3ee', items:[
    {l:'Environment files (.env)',       d:'filename:.env'},
    {l:'INI/CONF files',                 d:'filetype:ini OR filetype:conf OR filetype:cnf'},
    {l:'Nginx config snippets',          d:'filetype:conf intext:server_name'},
    {l:'Apache VirtualHost configs',     d:'filetype:conf intext:VirtualHost'},
    {l:'YAML service configs',           d:'filetype:yml intext:apiVersion OR intext:password'},
    {l:'Tomcat users file',              d:'filename:tomcat-users.xml'},
    {l:'wp-config.php',                  d:'filename:wp-config.php'},
    {l:'Database connection strings',    d:'intext:"DB_PASSWORD" OR intext:"DATABASE_URL"'},
  ]},
  { type:'sec', cat:'Cloud Storage Exposure', icon:'fa-cloud', color:'#60a5fa', items:[
    {l:'Amazon S3 buckets',              d:'inurl:s3.amazonaws.com'},
    {l:'Azure Blob storage',             d:'inurl:blob.core.windows.net'},
    {l:'Google Cloud Storage',           d:'inurl:storage.googleapis.com'},
    {l:'Cloudfront buckets',             d:'inurl:cloudfront.net intext:bucket'},
    {l:'Public object listings',         d:'intitle:"index of" intext:"bucket"'},
    {l:'IAM policy misconfigs',          d:'intext:"s3:PutObject" filetype:json'},
    {l:'Exposed GCP credentials',        d:'filetype:json intext:"auth_uri" intext:"token_uri"'},
  ]},
  { type:'sec', cat:'Database Exposure', icon:'fa-database', color:'#10b981', items:[
    {l:'SQL dumps',                      d:'filetype:sql intext:"CREATE TABLE"'},
    {l:'Database backups',               d:'filetype:bak OR filetype:dump'},
    {l:'SQLite files',                   d:'filetype:sqlite OR filetype:db'},
    {l:'MongoDB exports',                d:'filetype:json intext:"_id" intext:"$date"'},
    {l:'PostgreSQL dumps',               d:'filetype:sql intext:"PostgreSQL database dump"'},
    {l:'Redis dump files',               d:'filetype:rdb'},
    {l:'phpMyAdmin interfaces',          d:'inurl:phpmyadmin OR intitle:phpMyAdmin'},
    {l:'Adminer portals',                d:'inurl:adminer.php OR inurl:adminer'},
  ]},
  { type:'sec', cat:'API Reconnaissance', icon:'fa-plug', color:'#c084fc', items:[
    {l:'Swagger UI',                     d:'inurl:swagger OR inurl:api-docs OR intitle:swagger'},
    {l:'OpenAPI spec files',             d:'filetype:json intext:"openapi" OR filetype:yaml intext:"openapi"'},
    {l:'GraphQL endpoints',              d:'inurl:graphql OR inurl:/graphql'},
    {l:'REST endpoint lists',            d:'intext:"/api/v1/" OR intext:"/api/v2/"'},
    {l:'Postman collections',            d:'filetype:json intext:"postman_collection"'},
    {l:'SOAP WSDL files',               d:'filetype:wsdl OR inurl:?wsdl'},
  ]},
  { type:'sec', cat:'Logs & Debug Output', icon:'fa-bug', color:'#f87171', items:[
    {l:'Application error logs',         d:'filetype:log intext:error'},
    {l:'Python tracebacks',              d:'intext:"Traceback (most recent call last)"'},
    {l:'SQL syntax errors',              d:'intext:"SQL syntax" OR intext:"mysql_fetch_array"'},
    {l:'Debug mode on',                  d:'intext:"APP_DEBUG=true" OR intext:"debug=true"'},
    {l:'Werkzeug debugger',              d:'intitle:"Werkzeug" inurl:debugger'},
    {l:'Django/Flask errors',            d:'intitle:"Page not found" intext:Django OR intitle:"ValueError" intext:Flask'},
    {l:'Verbose API error JSON',         d:'intext:"stack" intext:"message" filetype:json'},
  ]},
  { type:'sec', cat:'Admin Panel Discovery', icon:'fa-user-shield', color:'#34d399', items:[
    {l:'Generic admin URLs',             d:'inurl:admin OR inurl:administrator OR inurl:/manage'},
    {l:'WordPress login',                d:'inurl:wp-login.php OR inurl:wp-admin'},
    {l:'cPanel',                         d:'inurl:cpanel OR intitle:cPanel'},
    {l:'Plesk panel',                    d:'intitle:Plesk'},
    {l:'Joomla admin',                   d:'inurl:/administrator intitle:Joomla'},
    {l:'Drupal admin',                   d:'inurl:/user/login intext:Drupal'},
    {l:'Laravel Telescope',              d:'inurl:/telescope'},
    {l:'Kibana dashboards',              d:'intitle:Kibana inurl:app'},
    {l:'Grafana login',                  d:'intitle:Grafana inurl:login'},
  ]},
  { type:'sec', cat:'Vulnerability Research', icon:'fa-search-plus', color:'#86efac', items:[
    {l:'XSS parameter candidates',       d:'inurl:q= OR inurl:search= OR inurl:query= OR inurl:s='},
    {l:'LFI/path traversal params',      d:'inurl:file= OR inurl:path= OR inurl:include= OR inurl:page='},
    {l:'Upload forms',                   d:'inurl:upload OR intext:"type=\\"file\\""'},
    {l:'SSRF-prone params',              d:'inurl:url= OR inurl:dest= OR inurl:feed= OR inurl:webhook='},
    {l:'SQL injection candidates',       d:'inurl:id= OR inurl:cat= OR inurl:product_id='},
    {l:'IDOR enumeration',               d:'inurl:user_id= OR inurl:account= OR inurl:doc_id='},
  ]},
  { type:'sec', cat:'Network Services', icon:'fa-network-wired', color:'#fde68a', items:[
    {l:'Exposed Elasticsearch',          d:'intitle:"You Know, for Search"'},
    {l:'Prometheus metrics',             d:'inurl:/metrics intext:prometheus'},
    {l:'Jenkins instances',              d:'intitle:"Dashboard [Jenkins]"'},
    {l:'RabbitMQ management',            d:'intitle:RabbitMQ inurl:15672'},
    {l:'Kubernetes dashboard',           d:'intitle:"Kubernetes Dashboard"'},
    {l:'Docker registry API',            d:'inurl:/v2/_catalog'},
    {l:'Hadoop HDFS namenode',           d:'intitle:NameNode inurl:50070'},
    {l:'Consul service mesh',            d:'intitle:Consul inurl:/ui'},
  ]},
  { type:'sec', cat:'IoT & SCADA', icon:'fa-microchip', color:'#fb923c', items:[
    {l:'IP camera interfaces',           d:'intitle:"IP Camera" OR inurl:/view/view.shtml'},
    {l:'Router admin panels',            d:'intitle:"router login" OR intitle:"Router Configuration"'},
    {l:'NAS portals',                    d:'intitle:"NAS" inurl:login'},
    {l:'Industrial HMI/SCADA',           d:'intitle:HMI inurl:scada OR intitle:"SCADA"'},
    {l:'Smart building systems',         d:'intext:"building management system" inurl:login'},
  ]},
  { type:'sec', cat:'Container & Orchestration', icon:'fa-cubes', color:'#67e8f9', items:[
    {l:'Kubernetes Dashboard',           d:'intitle:"Kubernetes Dashboard"'},
    {l:'Docker API exposed',             d:'intext:"Docker Remote API"'},
    {l:'Helm chart files',               d:'filetype:yaml intext:"chart:"'},
    {l:'Kubeconfig files',               d:'filename:config intext:"clusters:" intext:"users:"'},
    {l:'Docker-compose files',           d:'filename:docker-compose'},
    {l:'GitLab CI config',               d:'filename:.gitlab-ci.yml'},
  ]},
  { type:'sec', cat:'Backup & Archive Discovery', icon:'fa-archive', color:'#f9a8d4', items:[
    {l:'ZIP backups',                    d:'filetype:zip (backup OR dump OR db)'},
    {l:'TAR archives',                   d:'filetype:tar OR filetype:tar.gz backup'},
    {l:'RAR archives',                   d:'filetype:rar backup'},
    {l:'Old/orig file copies',           d:'filetype:old OR filetype:orig OR filetype:swp OR filetype:bak'},
    {l:'Site snapshot directories',      d:'inurl:backup OR inurl:old_site OR inurl:archive'},
    {l:'Date-stamped backups',           d:'intext:backup_202 OR inurl:backup_202'},
  ]},
  { type:'sec', cat:'Supply Chain & Compliance', icon:'fa-link', color:'#a5f3fc', items:[
    {l:'Pentest reports',                d:'filetype:pdf intext:"penetration test report"'},
    {l:'SOC 2 docs',                     d:'intext:"SOC 2" filetype:pdf'},
    {l:'ISO 27001 documents',            d:'intext:"ISO 27001" filetype:pdf'},
    {l:'SBOM files',                     d:'intext:"software bill of materials" OR filename:sbom'},
    {l:'Dependency manifests',           d:'filename:requirements.txt OR filename:pom.xml OR filename:package.json'},
    {l:'Vendor/supplier portals',        d:'inurl:vendor OR inurl:supplier inurl:portal'},
  ]},
  { type:'sec', cat:'Email & Contact Footprint', icon:'fa-at', color:'#f472b6', items:[
    {l:'Security contact addresses',     d:'intext:"security@"'},
    {l:'PGP public key blocks',          d:'intext:"BEGIN PGP PUBLIC KEY BLOCK"'},
    {l:'Phone number references',        d:'intext:"+1" OR intext:"+44" OR intext:"+91"'},
    {l:'Help desk portals',              d:'intitle:"Help Center" OR intitle:"Support Portal"'},
    {l:'HR/employee directories',        d:'filetype:xls intext:employee directory'},
  ]},
  { type:'sec', cat:'People & Org OSINT', icon:'fa-users', color:'#c4b5fd', items:[
    {l:'Org chart files',                d:'filetype:pdf intext:"organizational chart"'},
    {l:'Job postings (tech clues)',       d:'inurl:careers OR inurl:jobs intext:"we use"'},
    {l:'LinkedIn company profiles',      d:'site:linkedin.com/company'},
    {l:'CISO/security team mentions',    d:'intext:"Chief Information Security Officer"'},
    {l:'Press kits & media pages',       d:'inurl:press OR inurl:media-kit OR inurl:newsroom'},
  ]},
  { type:'sec', cat:'Darkweb & Leak Watch', icon:'fa-user-secret', color:'#818cf8', items:[
    {l:'Credential paste references',    d:'intext:"paste" intext:"username" intext:"password"'},
    {l:'Database dump mentions',         d:'intext:"database dump" OR intext:"data breach"'},
    {l:'Compromised account notices',    d:'intext:"compromised account" OR intext:"account breach"'},
    {l:'Stolen data sale posts',         d:'intext:"selling database" OR intext:"buy database"'},
    {l:'Victim disclosure pages',        d:'intext:"public disclosure" breach'},
  ]},
  { type:'sec', cat:'CI/CD & Dev Tools', icon:'fa-code-branch', color:'#6ee7b7', items:[
    {l:'GitHub Actions workflows',       d:'site:github.com filename:.github/workflows'},
    {l:'Travis CI configs',              d:'filename:.travis.yml'},
    {l:'CircleCI configs',               d:'filename:.circleci/config.yml'},
    {l:'Terraform state files',          d:'filename:terraform.tfstate'},
    {l:'Ansible playbooks with creds',   d:'filetype:yml intext:ansible_password'},
    {l:'Exposed JIRA instances',         d:'inurl:jira OR intitle:"JIRA" inurl:login'},
  ]},

  // ── FILE HUNTER ──────────────────────────────────────
  { type:'media', cat:'General File Finder', icon:'fa-folder-open', color:'#a78bfa', items:[
    {l:'Open directory indexes',         d:'intitle:"index of"'},
    {l:'PDF documents',                  d:'filetype:pdf'},
    {l:'Word documents',                 d:'filetype:doc OR filetype:docx'},
    {l:'Spreadsheets',                   d:'filetype:xls OR filetype:xlsx OR filetype:csv'},
    {l:'Presentations',                  d:'filetype:ppt OR filetype:pptx'},
    {l:'Compressed archives',            d:'filetype:zip OR filetype:rar OR filetype:7z'},
    {l:'E-books (EPUB/MOBI)',           d:'filetype:epub OR filetype:mobi'},
  ]},
  { type:'media', cat:'Video & Media Files', icon:'fa-film', color:'#f472b6', items:[
    {l:'HD video files (720p/1080p)',    d:'intitle:"index of" (mkv|mp4) (1080p|720p) -html -htm'},
    {l:'4K / Ultra HD content',         d:'intitle:"index of" (mkv|mp4) (2160p|4K|UHD) -html'},
    {l:'TV Series (seasons/episodes)',   d:'intitle:"index of" ("S01"|E01|Season) (mkv|mp4) -html'},
    {l:'Anime series & movies',          d:'intitle:"index of" anime (mkv|mp4) -html'},
    {l:'Recent releases (2024-2026)',    d:'intitle:"index of" mp4 (2024|2025|2026) -html'},
    {l:'MP3 audio files',               d:'intitle:"index of" mp3 -html'},
  ]},
  { type:'media', cat:'Academic Research', icon:'fa-graduation-cap', color:'#34d399', items:[
    {l:'Scholarly PDFs',                 d:'filetype:pdf (abstract OR references OR doi)'},
    {l:'Thesis/dissertation docs',       d:'filetype:pdf (thesis OR dissertation)'},
    {l:'Lecture notes',                  d:'filetype:pdf "lecture notes"'},
    {l:'Open textbooks',                 d:'filetype:pdf "open textbook"'},
    {l:'University repositories',        d:'site:.edu inurl:repository OR inurl:publications'},
    {l:'Research datasets',              d:'filetype:csv OR filetype:xlsx "dataset"'},
  ]},
  { type:'media', cat:'Public Records', icon:'fa-landmark', color:'#fbbf24', items:[
    {l:'Government PDFs',                d:'site:.gov filetype:pdf'},
    {l:'Procurement/RFP documents',      d:'filetype:pdf "request for proposal"'},
    {l:'Annual budget reports',          d:'filetype:pdf "annual budget"'},
    {l:'Court record indexes',           d:'inurl:court records filetype:pdf'},
    {l:'Regulation documents',           d:'filetype:pdf regulation'},
    {l:'Environmental impact studies',   d:'filetype:pdf "environmental impact assessment"'},
  ]},
  { type:'media', cat:'People Search', icon:'fa-id-card', color:'#60a5fa', items:[
    {l:'LinkedIn profiles',              d:'site:linkedin.com/in'},
    {l:'Personal portfolio pages',       d:'inurl:about-me OR inurl:portfolio'},
    {l:'Conference speaker bios',        d:'intext:"bio" intext:"speaker"'},
    {l:'Alumni directories',             d:'inurl:alumni directory'},
    {l:'Contact pages',                  d:'inurl:contact OR inurl:about'},
    {l:'Resume/CV PDFs',                 d:'filetype:pdf (resume OR "curriculum vitae")'},
  ]},
  { type:'media', cat:'Social Media Discovery', icon:'fa-hashtag', color:'#fb923c', items:[
    {l:'X / Twitter profiles',           d:'site:x.com OR site:twitter.com'},
    {l:'Instagram profiles',             d:'site:instagram.com'},
    {l:'YouTube channels',               d:'site:youtube.com/channel OR site:youtube.com/@'},
    {l:'Reddit communities',             d:'site:reddit.com/r'},
    {l:'TikTok profiles',               d:'site:tiktok.com/@'},
    {l:'GitHub profiles',               d:'site:github.com'},
  ]},
  { type:'media', cat:'Company Intelligence', icon:'fa-building', color:'#c084fc', items:[
    {l:'Annual reports',                 d:'filetype:pdf "annual report"'},
    {l:'Investor presentations',         d:'filetype:ppt OR filetype:pdf "investor presentation"'},
    {l:'Employee handbooks',             d:'filetype:pdf "employee handbook"'},
    {l:'Org structure docs',             d:'filetype:pdf "organizational structure"'},
    {l:'Vendor/supplier lists',          d:'filetype:xls "vendor"'},
    {l:'Code of conduct/compliance',     d:'filetype:pdf "code of conduct"'},
  ]},
  { type:'media', cat:'Legal & Policy Docs', icon:'fa-balance-scale', color:'#86efac', items:[
    {l:'Terms and conditions',           d:'inurl:terms OR inurl:tos'},
    {l:'Privacy policies',               d:'inurl:privacy-policy'},
    {l:'Licensing agreements',           d:'filetype:pdf license agreement'},
    {l:'Open data licenses',             d:'intext:"Creative Commons"'},
    {l:'Contract templates',             d:'filetype:doc OR filetype:pdf contract template'},
    {l:'Regulatory guidance docs',       d:'filetype:pdf "regulatory guidance"'},
  ]},
  { type:'media', cat:'Finance & Procurement', icon:'fa-chart-line', color:'#fde68a', items:[
    {l:'Financial statements',           d:'filetype:pdf "financial statement"'},
    {l:'Tender documents',               d:'filetype:pdf tender'},
    {l:'Invoice templates',              d:'filetype:xls invoice template'},
    {l:'Grant opportunities',            d:'intext:"grant application" filetype:pdf'},
    {l:'Tax guides',                     d:'filetype:pdf tax guide'},
    {l:'Procurement policies',           d:'filetype:pdf procurement policy'},
  ]},
  { type:'media', cat:'Open Data Portals', icon:'fa-table', color:'#67e8f9', items:[
    {l:'CSV datasets',                   d:'filetype:csv dataset'},
    {l:'JSON datasets',                  d:'filetype:json dataset'},
    {l:'Data catalog pages',             d:'inurl:data-catalog'},
    {l:'Government open data',           d:'site:.gov inurl:opendata'},
    {l:'GeoJSON/KML map data',           d:'filetype:geojson OR filetype:kml'},
    {l:'Data dictionaries',              d:'filetype:pdf "data dictionary"'},
  ]},
  { type:'media', cat:'Code & Open Source', icon:'fa-laptop-code', color:'#a5f3fc', items:[
    {l:'GitHub repositories',            d:'site:github.com'},
    {l:'GitLab projects',               d:'site:gitlab.com'},
    {l:'Public gists',                   d:'site:gist.github.com'},
    {l:'Changelog files',               d:'filename:CHANGELOG.md'},
    {l:'Roadmaps',                       d:'intext:"project roadmap"'},
    {l:'Contributing guides',            d:'filetype:md "contributing"'},
  ]},
  { type:'media', cat:'Cybersecurity Learning', icon:'fa-shield-alt', color:'#818cf8', items:[
    {l:'CTF writeups',                   d:'intext:"CTF writeup" OR intext:"CTF walkthrough"'},
    {l:'Incident response playbooks',    d:'filetype:pdf "incident response playbook"'},
    {l:'Security checklists',            d:'filetype:pdf "security checklist"'},
    {l:'Security awareness slides',      d:'filetype:ppt "security awareness"'},
    {l:'Bug bounty reports',             d:'intext:"bug bounty" report filetype:pdf'},
  ]},
  { type:'media', cat:'Maps & Geospatial', icon:'fa-map', color:'#c4b5fd', items:[
    {l:'Open map datasets',              d:'filetype:geojson OR filetype:kml'},
    {l:'GIS documents',                  d:'filetype:pdf "GIS"'},
    {l:'Transportation maps',            d:'filetype:pdf "route map"'},
    {l:'Zoning maps',                    d:'filetype:pdf "zoning map"'},
    {l:'Topographic resources',          d:'filetype:pdf topographic map'},
  ]},
];

/* ══════════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════════ */
const ST = {
  mode: 'sec',
  engine: 'google',
  qCount: Number(localStorage.getItem('gr_qcount') || 0),
  history: JSON.parse(localStorage.getItem('gr_hist') || '[]'),
  bulk: [],
  currentCat: null,
  savedTarget: localStorage.getItem('gr_target') || '',
  _pendingQueries: [],
  _pendingWhy: '',
};

/* ══════════════════════════════════════════════════════
   SEARCH ENGINES
══════════════════════════════════════════════════════ */
const ENGINES = {
  google:     q => 'https://www.google.com/search?q=' + encodeURIComponent(q),
  bing:       q => 'https://www.bing.com/search?q=' + encodeURIComponent(q),
  duckduckgo: q => 'https://duckduckgo.com/?q=' + encodeURIComponent(q),
  brave:      q => 'https://search.brave.com/search?q=' + encodeURIComponent(q),
  yandex:     q => 'https://yandex.com/search/?text=' + encodeURIComponent(q),
};

/* ══════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  applyTheme(localStorage.getItem('gr_theme') || 'dim');
  if (ST.savedTarget) {
    document.getElementById('inp-domain').value = ST.savedTarget;
  }
  updateSavedIndicator();
  updateStats();
  renderCats();
  refreshCounter();
  renderHist();
  previewQuery();

  // Engine buttons
  document.querySelectorAll('.engine-btn').forEach(function(b) {
    b.addEventListener('click', function() {
      document.querySelectorAll('.engine-btn').forEach(function(x) { x.classList.remove('active'); });
      b.classList.add('active');
      ST.engine = b.dataset.engine;
    });
  });

  // Nav tabs
  document.querySelectorAll('[data-page]').forEach(function(b) {
    b.addEventListener('click', function() {
      document.querySelectorAll('[data-page]').forEach(function(x) { x.classList.remove('active'); });
      b.classList.add('active');
      ['tool','custom','history','ref'].forEach(function(p) {
        document.getElementById('page-' + p).classList.add('hidden');
      });
      document.getElementById('page-' + b.dataset.page).classList.remove('hidden');
    });
  });

  // Scroll top button
  window.addEventListener('scroll', function() {
    var btn = document.getElementById('scrolltop');
    if (btn) btn.classList.toggle('visible', window.scrollY > 300);
  });

  // Live query preview on input
  ['inp-domain','inp-kw'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        if (id === 'inp-domain') updateTargetHint();
        previewQuery();
      });
      el.addEventListener('keypress', function(e) { if (e.key === 'Enter') executeSearch(); });
      if (id === 'inp-domain') {
        el.addEventListener('blur', function() { saveTargetFromInput(false); });
      }
    }
  });

  // Modal close on backdrop click
  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === document.getElementById('modal')) closeModalDirect();
  });
  document.getElementById('confirm-modal').addEventListener('click', function(e) {
    if (e.target === document.getElementById('confirm-modal')) closeConfirm();
  });

  // Custom dork enter key
  var ci = document.getElementById('custom-inp');
  if (ci) ci.addEventListener('keypress', function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runCustom(); } });
});

/* ══════════════════════════════════════════════════════
   STATS
══════════════════════════════════════════════════════ */
function updateStats() {
  var sec  = DORKS.filter(function(d){return d.type==='sec';}).reduce(function(a,c){return a+c.items.length;},0);
  var med  = DORKS.filter(function(d){return d.type==='media';}).reduce(function(a,c){return a+c.items.length;},0);
  document.getElementById('s-total').textContent = sec + med;
  document.getElementById('s-sec').textContent   = sec;
  document.getElementById('s-file').textContent  = med;
}

/* ══════════════════════════════════════════════════════
   MODE SWITCH
══════════════════════════════════════════════════════ */
function switchMode(m) {
  ST.mode = m;
  document.getElementById('mc-sec').classList.toggle('active', m === 'sec');
  document.getElementById('mc-media').classList.toggle('active', m === 'media');
  document.getElementById('status-mode').textContent = m === 'sec' ? 'CYBER_INTEL' : 'FILE_HUNTER';
  document.getElementById('cat-title').textContent   = m === 'sec' ? 'CYBER INTEL CATEGORIES' : 'FILE HUNTER CATEGORIES';
  renderCats();
  previewQuery();
}

/* ══════════════════════════════════════════════════════
   CATEGORY RENDER
══════════════════════════════════════════════════════ */
function renderCats(filter) {
  filter = filter || '';
  var grid = document.getElementById('cat-grid');
  grid.innerHTML = '';
  var cats = DORKS.filter(function(d) {
    var haystack = (d.cat + ' ' + (d.pack || '')).toLowerCase();
    return d.type === ST.mode && haystack.includes(filter.toLowerCase());
  });
  if (!cats.length) {
    grid.innerHTML = '<p class="no-results">No categories match your filter.</p>';
    return;
  }
  cats.forEach(function(cat) {
    var card = document.createElement('div');
    card.className = 'cat-card';
    card.style.setProperty('--cat-color', cat.color);
    card.innerHTML =
      '<div class="cat-icon"><i class="fas ' + cat.icon + '"></i></div>' +
      '<div class="cat-name">' + cat.cat + '</div>' +
      (cat.pack ? '<div class="cat-pack">' + escapeHtml(cat.pack) + '</div>' : '') +
      '<div class="cat-count"><span>' + cat.items.length + '</span> dorks</div>';
    card.addEventListener('click', function() { openModal(cat); });
    grid.appendChild(card);
  });
}

function filterCats() {
  renderCats(document.getElementById('cat-filter').value);
}

/* ══════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════ */
function openModal(cat) {
  ST.currentCat = cat;
  document.getElementById('modal-title').innerHTML =
    '<i class="fas ' + cat.icon + '" style="color:' + cat.color + '"></i> ' + cat.cat;
  document.getElementById('modal-filter').value = '';
  renderModalItems(cat.items, '');
  document.getElementById('modal').classList.add('open');
}

function renderModalItems(items, filter) {
  var body = document.getElementById('modal-body');
  body.innerHTML = '';
  var filtered = items.filter(function(i) {
    return i.l.toLowerCase().includes(filter.toLowerCase()) ||
           i.d.toLowerCase().includes(filter.toLowerCase());
  });
  if (!filtered.length) {
    body.innerHTML = '<p class="no-results" style="padding:16px;">No dorks match filter.</p>';
    return;
  }
  filtered.forEach(function(item, idx) {
    var div = document.createElement('div');
    div.className = 'dork-item';
    var shownDork = materializeDork(item.d, getTargetFromInput()) || item.d;
    div.innerHTML =
      '<span class="dork-num">' + String(idx+1).padStart(2,'0') + '</span>' +
      '<div class="dork-info">' +
        '<div class="dork-label">' + escapeHtml(item.l) + '</div>' +
        '<div class="dork-code" title="' + escapeHtml(shownDork) + '">' + escapeHtml(shownDork) + '</div>' +
        '<div class="dork-why">' + escapeHtml(item.why || defaultWhyForItem(item, ST.currentCat)) + '</div>' +
      '</div>' +
      '<div class="dork-actions">' +
        '<button class="dork-act exec" title="Execute"><i class="fas fa-bolt"></i> Run</button>' +
        '<button class="dork-act copy" title="Copy dork"><i class="fas fa-copy"></i></button>' +
        '<button class="dork-act bulk" title="Add to bulk"><i class="fas fa-layer-group"></i></button>' +
        '<button class="dork-act why" title="Why it matters">Why</button>' +
      '</div>';
    var btns = div.querySelectorAll('.dork-act');
    btns[0].addEventListener('click', function() { previewThenExecute(item); });
    btns[1].addEventListener('click', function() { copyText(materializeDork(item.d, getTargetFromInput()) || item.d); });
    btns[2].addEventListener('click', function() { addToBulk(item); });
    var whyBtn = div.querySelector('.dork-act.why');
    if (whyBtn) whyBtn.addEventListener('click', function(e){ toggleWhy(div, item); e.stopPropagation(); });
    body.appendChild(div);
  });
}

function escapeHtml(s){ return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function toggleWhy(div, item){
  var whyEl = div.querySelector('.dork-why');
  if (!whyEl) return;
  whyEl.classList.toggle('open');
}

function filterModal() {
  if (!ST.currentCat) return;
  renderModalItems(ST.currentCat.items, document.getElementById('modal-filter').value);
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('modal').classList.remove('open');
}

/* ══════════════════════════════════════════════════════
   SEARCH EXECUTION
══════════════════════════════════════════════════════ */
function buildQuery(dorkCode) {
  var domain = getTargetFromInput();
  dorkCode = materializeDork(dorkCode || '', domain);
  var kw = (document.getElementById('inp-kw').value || '').trim();
  var q = '';
  if (domain && !/\bsite:/i.test(dorkCode)) q += 'site:' + domain + ' ';
  if (kw) q += '"' + kw + '" ';
  q += dorkCode;
  return q.replace(/\s+/g, ' ').trim();
}

function materializeDork(dorkCode, domain) {
  return dorkCode
    .replace(/"\$TARGET"/g, domain ? '"' + domain + '"' : '')
    .replace(/\$TARGET/g, domain || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function executeSearch() {
  var q = buildQuery('');
  if (!q) { toast('Enter a target domain or keyword', 'err'); return; }
  showConfirm([q], 'General search scoped by your current target profile and keyword.');
}

function executeDork(dorkCode) {
  var q = buildQuery(dorkCode);
  updateQueryPreview(q);
  showConfirm([q], 'Review this dork before launching it in the selected search engine.');
}

function previewThenExecute(item){
  var q = buildQuery(item.d);
  updateQueryPreview(q);
  showConfirm([q], item.why || defaultWhyForItem(item, ST.currentCat));
}

function closeConfirm(){ document.getElementById('confirm-modal').classList.remove('open'); }

function confirmRun(){
  var queries = ST._pendingQueries && ST._pendingQueries.length ? ST._pendingQueries : [document.getElementById('confirm-query').textContent];
  queries = queries.filter(Boolean);
  if (!queries.length) { toast('No query to run','err'); closeConfirm(); return; }
  queries.forEach(function(q) { launchSearch(q); });
  if (queries.length > 1) toast('Launched ' + queries.length + ' searches', 'ok');
  closeConfirm();
}

function copyConfirmQuery(){ copyText(document.getElementById('confirm-query').textContent); }

function showConfirm(queries, why) {
  saveTargetFromInput(false);
  queries = (queries || []).filter(Boolean);
  ST._pendingQueries = queries;
  ST._pendingWhy = why || '';
  var engineName = ST.engine.charAt(0).toUpperCase() + ST.engine.slice(1);
  document.getElementById('confirm-query').textContent = queries.join('\n');
  document.getElementById('confirm-why-text').textContent = why || 'Review the assembled query before it opens.';
  document.getElementById('confirm-engine').textContent = engineName;
  document.getElementById('confirm-count').textContent = queries.length + (queries.length === 1 ? ' query' : ' queries');
  document.getElementById('confirm-launch').innerHTML = '<i class="fas fa-play"></i> LAUNCH' + (queries.length > 1 ? ' ALL' : '');
  document.getElementById('confirm-modal').classList.add('open');
}

function launchSearch(q) {
  window.open(ENGINES[ST.engine](q), '_blank', 'noopener,noreferrer');
  ST.qCount++;
  localStorage.setItem('gr_qcount', ST.qCount);
  refreshCounter();
  addToHist(q);
}

function previewQuery() {
  var q = buildQuery('');
  if (q) updateQueryPreview(q);
  else document.getElementById('qpreview').classList.remove('show');
}

function updateQueryPreview(q) {
  document.getElementById('query-text').textContent = q;
  document.getElementById('qpreview').classList.add('show');
}

function refreshCounter() {
  document.getElementById('qcount').textContent = ST.qCount;
}

function copyQuery() {
  copyText(document.getElementById('query-text').textContent);
}

/* ══════════════════════════════════════════════════════
   CUSTOM CONSTRUCTOR
══════════════════════════════════════════════════════ */
function runCustom() {
  var q = (document.getElementById('custom-inp').value || '').trim();
  if (!q) { toast('Enter a dork query', 'err'); return; }
  var domain = getTargetFromInput();
  if (domain && !/\bsite:/i.test(q)) q = 'site:' + domain + ' ' + q;
  updateQueryPreview(q);
  showConfirm([q], 'Custom query built in the constructor. Confirming prevents accidental browser launches.');
}

function insertOp(op) {
  var ta = document.getElementById('custom-inp');
  var s = ta.selectionStart, e = ta.selectionEnd, v = ta.value;
  ta.value = v.slice(0,s) + op + v.slice(e);
  ta.selectionStart = ta.selectionEnd = s + op.length;
  ta.focus();
}

function setCustom(v) {
  document.getElementById('custom-inp').value = v;
}

function clearCustom() {
  document.getElementById('custom-inp').value = '';
}

/* ══════════════════════════════════════════════════════
   BULK LAUNCH
══════════════════════════════════════════════════════ */
function addToBulk(item) {
  if (ST.bulk.find(function(x) { return x.d === item.d; })) {
    toast('Already in bulk queue', 'err'); return;
  }
  ST.bulk.push(item);
  renderBulk();
  toast('Added: ' + item.l, 'ok');
}

function addAllToBulk() {
  if (!ST.currentCat) return;
  ST.currentCat.items.forEach(function(item) {
    if (!ST.bulk.find(function(x) { return x.d === item.d; })) ST.bulk.push(item);
  });
  renderBulk();
  toast('Added ' + ST.currentCat.items.length + ' dorks to bulk queue', 'ok');
}

function clearBulk() {
  ST.bulk = [];
  renderBulk();
}

function renderBulk() {
  var el = document.getElementById('bulk-list');
  if (!ST.bulk.length) {
    el.innerHTML = '<span style="color:var(--text-muted)">No dorks queued. Open a category and click the stack icon.</span>';
    return;
  }
  el.innerHTML = ST.bulk.map(function(item, i) {
    return '<div class="bulk-item">' +
      '<span class="bulk-item-num">' + (i+1) + '</span>' +
      '<span class="bulk-item-label">' + item.l + '</span>' +
      '<button class="bulk-remove" onclick="ST.bulk.splice(' + i + ',1);renderBulk();" title="Remove"><i class="fas fa-times"></i></button>' +
      '</div>';
  }).join('');
}

function executeBulk() {
  if (!ST.bulk.length) { toast('No dorks in bulk queue', 'err'); return; }
  var queries = ST.bulk.map(function(item) { return buildQuery(item.d); });
  showConfirm(queries, 'Bulk launch will open every queued dork. Confirm the full list before continuing.');
}

/* ══════════════════════════════════════════════════════
   HISTORY
══════════════════════════════════════════════════════ */
function addToHist(q) {
  ST.history.unshift({ q: q, engine: ST.engine, t: Date.now() });
  if (ST.history.length > 50) ST.history = ST.history.slice(0, 50);
  localStorage.setItem('gr_hist', JSON.stringify(ST.history));
  renderHist();
}

function normalizeTarget(raw) {
  var v = (raw || '').trim().toLowerCase();
  v = v.replace(/^https?:\/\//, '');
  v = v.replace(/^www\./, '');
  v = v.split(/[/?#]/)[0];
  v = v.replace(/:+$/, '').replace(/\.+$/, '').replace(/\/+$/, '');
  return v;
}

function getTargetFromInput() {
  return normalizeTarget(document.getElementById('inp-domain').value || ST.savedTarget || '');
}

function updateTargetHint() {
  var hint = document.getElementById('target-normalized');
  if (!hint) return;
  var normalized = getTargetFromInput();
  hint.textContent = normalized ? 'Queries will use site:' + normalized : 'Input is normalized before every query.';
}

// Target persistence helpers
function saveTargetFromInput(showToast){
  var input = document.getElementById('inp-domain');
  var v = normalizeTarget(input.value);
  input.value = v;
  if (!v) {
    updateTargetHint();
    return;
  }
  if (v === ST.savedTarget && !showToast) {
    updateTargetHint();
    return;
  }
  ST.savedTarget = v;
  localStorage.setItem('gr_target', v);
  updateSavedIndicator();
  previewQuery();
  if (showToast) toast('Saved target: ' + v, 'ok');
}

function updateSavedIndicator(){
  var el = document.getElementById('saved-target');
  if (!el) return;
  if (ST.savedTarget) el.textContent = 'Saved: ' + ST.savedTarget; else el.textContent = 'No saved target';
  updateTargetHint();
}

function clearSavedTarget(){
  ST.savedTarget = '';
  localStorage.removeItem('gr_target');
  document.getElementById('inp-domain').value = '';
  updateSavedIndicator();
  previewQuery();
  toast('Saved target cleared', 'ok');
}

function renderHist() {
  var el = document.getElementById('hist-grid');
  if (!ST.history.length) {
    el.innerHTML = '<p class="no-results">No searches recorded yet.</p>';
    return;
  }
  el.innerHTML = ST.history.map(function(h) {
    var eng = h.engine || 'google';
    var qSafe = h.q.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return '<div class="hist-item">' +
      '<span class="hist-q" title="' + qSafe + '">' + qSafe + '</span>' +
      '<span class="hist-engine">' + eng.toUpperCase() + '</span>' +
      '<span class="hist-time">' + timeAgo(h.t) + '</span>' +
      '<button class="hist-act" title="Re-run" onclick="rerunHist(\'' + encodeURIComponent(h.q) + '\',\'' + eng + '\')"><i class="fas fa-play"></i></button>' +
      '<button class="hist-act" title="Copy" onclick="copyHist(\'' + encodeURIComponent(h.q) + '\')"><i class="fas fa-copy"></i></button>' +
      '</div>';
  }).join('');
}

function rerunHist(qEncoded, eng) {
  var q = decodeURIComponent(qEncoded);
  ST.engine = eng || ST.engine;
  showConfirm([q], 'Re-running a saved history query. Confirm before opening the search engine again.');
}

function copyHist(qEncoded) {
  copyText(decodeURIComponent(qEncoded));
}

function clearHist() {
  ST.history = [];
  localStorage.removeItem('gr_hist');
  renderHist();
  toast('History cleared', 'ok');
}

function timeAgo(t) {
  var s = Math.floor((Date.now() - t) / 1000);
  if (s < 60)   return s + 's ago';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400)return Math.floor(s/3600) + 'h ago';
  return Math.floor(s/86400) + 'd ago';
}

/* ══════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════ */
function exportCurrent(fmt) {
  var cat = ST.currentCat;
  if (!cat) return;
  var content = '', fname = '', mime = '';
  if (fmt === 'txt') {
    content = '# ' + cat.cat + ' — GhostRecon Dorks\n\n' +
      cat.items.map(function(i){ return '[' + i.l + ']\n' + i.d + '\nWhy it matters: ' + (i.why || defaultWhyForItem(i, cat)); }).join('\n\n');
    fname = cat.cat.replace(/\s+/g,'_') + '.txt';
    mime = 'text/plain';
  } else if (fmt === 'json') {
    content = JSON.stringify({ category: cat.cat, dorks: cat.items.map(function(i){ return {label:i.l, dork:i.d, why:i.why || defaultWhyForItem(i, cat)}; }) }, null, 2);
    fname = cat.cat.replace(/\s+/g,'_') + '.json';
    mime = 'application/json';
  } else if (fmt === 'csv') {
    content = 'label,dork,why\n' + cat.items.map(function(i){
      return '"' + i.l + '","' + i.d.replace(/"/g,'""') + '","' + (i.why || defaultWhyForItem(i, cat)).replace(/"/g,'""') + '"';
    }).join('\n');
    fname = cat.cat.replace(/\s+/g,'_') + '.csv';
    mime = 'text/csv';
  }
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], {type: mime}));
  a.download = fname;
  a.click();
  toast('Exported as ' + fmt.toUpperCase(), 'ok');
}

/* ══════════════════════════════════════════════════════
   UTILS
══════════════════════════════════════════════════════ */
function clearField(id) {
  var el = document.getElementById(id);
  if (el) el.value = '';
  if (id === 'inp-domain') updateTargetHint();
  previewQuery();
}

function resetAll() {
  clearField('inp-domain');
  clearField('inp-kw');
  document.getElementById('qpreview').classList.remove('show');
}

function copyText(txt) {
  navigator.clipboard.writeText(txt)
    .then(function() { toast('Copied to clipboard', 'ok'); })
    .catch(function() { toast('Copy failed', 'err'); });
}

// Theme toggle: dim, void, and white.
function toggleTheme(){
  var cur = localStorage.getItem('gr_theme') || 'dim';
  var order = ['dim', 'void', 'white'];
  var next = order[(order.indexOf(cur) + 1) % order.length] || 'dim';
  applyTheme(next);
}

function applyTheme(name){
  name = ['dim', 'void', 'white'].includes(name) ? name : 'dim';
  localStorage.setItem('gr_theme', name);
  var root = document.documentElement;
  root.setAttribute('data-theme', name);
  var label = document.getElementById('theme-name');
  if (label) label.textContent = name;
  var pill = document.getElementById('theme-pill');
  if (pill) {
    var titleMap = {
      dim: 'Switch to void theme',
      void: 'Switch to white theme',
      white: 'Switch to dim theme'
    };
    pill.title = titleMap[name];
  }
}

function defaultWhyForItem(item, cat) {
  var catName = (cat && cat.cat || '').toLowerCase();
  var label = (item && item.l || 'This dork').toLowerCase();
  if (catName.includes('secrets') || label.includes('key') || label.includes('token') || label.includes('credential')) return 'Reveals leaked secrets, tokens, or credential material that can lead to account takeover or cloud compromise.';
  if (catName.includes('document') || catName.includes('file') || label.includes('pdf') || label.includes('spreadsheet')) return 'Finds indexed documents that may expose internal data, reports, lists, or operational details.';
  if (catName.includes('config') || label.includes('config') || label.includes('.env')) return 'Surfaces configuration files that often contain passwords, hostnames, API URLs, or environment details.';
  if (catName.includes('admin') || label.includes('login') || label.includes('portal')) return 'Identifies authentication and administration surfaces that should be inventoried, monitored, and access-controlled.';
  if (catName.includes('api') || label.includes('swagger') || label.includes('graphql')) return 'Exposes API documentation or endpoints that help analysts understand attack surface and sensitive business functions.';
  if (catName.includes('backup') || label.includes('backup') || label.includes('dump')) return 'Locates backup or archive artifacts that can accidentally contain full source, databases, or historical secrets.';
  if (catName.includes('cloud')) return 'Highlights cloud storage or cloud policy exposure that may indicate public buckets, blobs, or credentials.';
  if (catName.includes('database')) return 'Finds database interfaces, dumps, or data files that can expose structured sensitive information.';
  if (catName.includes('cms')) return 'Fingerprints CMS platforms and plugins so teams can verify patch level, exposed paths, and risky extensions.';
  if (catName.includes('oauth') || catName.includes('sso')) return 'Checks identity and redirect surfaces where misconfiguration can expose sessions, assertions, or authorization flows.';
  if (catName.includes('github')) return 'Searches public code indexes for accidentally committed secrets, configuration, and implementation clues.';
  if (catName.includes('shodan') || catName.includes('service')) return 'Uses indexed banners and titles to approximate internet-exposed service discovery from search results.';
  if (catName.includes('paste')) return 'Monitors paste and leak sources for credentials, configs, or incident indicators tied to the target.';
  return 'Adds reportable OSINT context by showing what Google has indexed for this target and category.';
}

function addDorkCategory(category) {
  if (!DORKS.some(function(existing) { return existing.type === category.type && existing.cat === category.cat; })) {
    DORKS.push(category);
  }
}

// Add requested categories and guarantee every dork has a useful explanation.
function enrichDorks(){
  addDorkCategory({ type:'sec', cat:'Paste Sites & Leak Sources', pack:'Secrets', icon:'fa-file-alt', color:'#f97316', items:[
    {l:'Pastebin target mentions', d:'site:pastebin.com "$TARGET" OR site:pastebin.com password', why:'Searches Pastebin for target references and likely credential exposure.'},
    {l:'Paste.ee credential hints', d:'site:paste.ee "$TARGET" ("password" OR "token" OR "api_key")', why:'Checks another common paste service for secrets linked to the target.'},
    {l:'GitHub gists with secrets', d:'site:gist.github.com "$TARGET" ("secret" OR "client_secret" OR "AKIA")', why:'Public gists are frequently used for quick snippets and can accidentally hold production secrets.'},
    {l:'Rentry and paste.rs leaks', d:'site:rentry.co "$TARGET" OR site:paste.rs "$TARGET"', why:'Broadens leak monitoring to paste-like sites beyond Pastebin.'},
    {l:'Credential combo mentions', d:'"$TARGET" ("username" "password") OR ("email" "password")', why:'Looks for pages where target identifiers appear near credential pairs.'},
    {l:'Database dump references', d:'"$TARGET" ("database dump" OR "db dump" OR "leaked database")', why:'Flags potential breach chatter or public dump references for incident triage.'}
  ]});
  addDorkCategory({ type:'sec', cat:'CMS Fingerprinting', pack:'Recon', icon:'fa-search', color:'#60a5fa', items:[
    {l:'WordPress assets', d:'inurl:wp-content OR inurl:wp-includes', why:'Identifies WordPress installs and exposed theme or plugin paths.'},
    {l:'WordPress plugin inventory', d:'inurl:wp-content/plugins filetype:js OR filetype:css', why:'Plugin names help analysts check vulnerable versions and unnecessary exposure.'},
    {l:'Joomla markers', d:'inurl:/administrator intitle:Joomla OR intext:"content=\\"Joomla!\\""', why:'Finds Joomla administration and metadata indicators for platform-specific review.'},
    {l:'Drupal markers', d:'inurl:/sites/default/files OR intext:"Drupal.settings"', why:'Detects Drupal structure that can expose files, modules, and version clues.'},
    {l:'Magento storefront clues', d:'inurl:/skin/frontend OR inurl:/static/frontend intext:Magento', why:'Fingerprints Magento assets that may indicate e-commerce attack surface.'},
    {l:'Shopify/WooCommerce clues', d:'intext:"woocommerce" OR intext:"cdn.shopify.com"', why:'Identifies commerce CMS technology for payment, plugin, and supply-chain review.'}
  ]});
  addDorkCategory({ type:'sec', cat:'OAuth & SSO Misconfig', pack:'Auth', icon:'fa-key', color:'#7c3aed', items:[
    {l:'OAuth redirect parameters', d:'inurl:redirect_uri= OR inurl:callback=', why:'Redirect parameters are high-value checks for OAuth redirect allowlist mistakes.'},
    {l:'OpenID configuration', d:'inurl:.well-known/openid-configuration', why:'Discovery documents reveal issuers, endpoints, supported flows, and token behavior.'},
    {l:'SAML metadata files', d:'filetype:xml intext:"EntityDescriptor" intext:"SingleSignOnService"', why:'SAML metadata can expose identity provider details and integration endpoints.'},
    {l:'SSO login endpoints', d:'inurl:sso OR inurl:saml OR inurl:oauth OR inurl:openid', why:'Maps identity entry points that should be hardened and monitored.'},
    {l:'Client ID exposure', d:'intext:"client_id" intext:"redirect_uri"', why:'Client IDs and redirect URIs help verify whether public auth integrations are expected.'},
    {l:'Auth debug errors', d:'intext:"invalid_redirect_uri" OR intext:"invalid client" OR intext:"SAMLResponse"', why:'Authentication error pages can reveal integration names, flows, and misconfiguration clues.'}
  ]});
  addDorkCategory({ type:'sec', cat:'GitHub Code Search', pack:'Code', icon:'fa-code', color:'#94a3b8', items:[
    {l:'Target mentions in GitHub', d:'site:github.com "$TARGET"', why:'Finds repositories, issues, and snippets that mention the target domain or brand.'},
    {l:'Environment files in repos', d:'site:github.com filename:.env "$TARGET"', why:'Looks for accidentally committed environment files tied to the target.'},
    {l:'API keys in public code', d:'site:github.com "$TARGET" ("api_key" OR "API_KEY" OR "client_secret")', why:'Checks public source for common secret variable names near target identifiers.'},
    {l:'Cloud keys in GitHub', d:'site:github.com "$TARGET" ("AKIA" OR "aws_secret_access_key" OR "GOOGLE_APPLICATION_CREDENTIALS")', why:'Targets cloud credential patterns that can lead to infrastructure compromise.'},
    {l:'CI secrets and workflows', d:'site:github.com "$TARGET" (filename:.github/workflows OR filename:.gitlab-ci.yml)', why:'CI configuration can disclose deployment flow, secret names, and third-party integrations.'},
    {l:'Internal hostnames in code', d:'site:github.com "$TARGET" ("internal" OR "staging" OR "dev.")', why:'Finds environment names and hostnames that may expand the recon scope.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Shodan-style Service Finds', pack:'Infrastructure', icon:'fa-network-wired', color:'#06b6d4', items:[
    {l:'Apache/Nginx banners', d:'intitle:"Apache2 Ubuntu Default Page" OR intitle:"Welcome to nginx"', why:'Searches indexed default pages and banners that indicate exposed web services.'},
    {l:'OpenSSH and server banners', d:'intext:"OpenSSH" OR intext:"SSH-2.0" OR intext:"Apache/"', why:'Banner text can reveal internet-facing services and software families.'},
    {l:'Exposed dashboards', d:'intitle:Grafana OR intitle:Kibana OR intitle:Prometheus', why:'Dashboard titles often indicate sensitive monitoring systems exposed to search engines.'},
    {l:'Directory listings with server text', d:'intitle:"index of" "Server at"', why:'Combines open directory indexes with server footer text for service discovery.'},
    {l:'Camera and NVR portals', d:'intitle:"IP Camera" OR intitle:"Hikvision" OR intitle:"DVR Login"', why:'Finds indexed device portals that require asset ownership validation and access review.'},
    {l:'Network appliance logins', d:'intitle:"pfSense" OR intitle:"Fortinet" OR intitle:"SonicWall"', why:'Identifies security appliances that should not be publicly indexed unless intentionally exposed.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Subdomain & Host Discovery', pack:'Recon', icon:'fa-network-wired', color:'#38bdf8', items:[
    {l:'Wildcard subdomain sweep', d:'site:*.$TARGET', why:'Broadly enumerates indexed subdomains and hostnames associated with the target.'},
    {l:'Development hostnames', d:'intext:"dev.$TARGET" OR intext:"staging.$TARGET" OR intext:"test.$TARGET"', why:'Finds environment hostnames mentioned in indexed pages, docs, and code.'},
    {l:'API host references', d:'intext:"api.$TARGET" OR intext:"graphql.$TARGET" OR intext:"rest.$TARGET"', why:'Maps API-oriented hosts that may not be linked from the public site.'},
    {l:'Admin host references', d:'intext:"admin.$TARGET" OR intext:"portal.$TARGET" OR intext:"dashboard.$TARGET"', why:'Surfaces management and portal subdomains for access-control review.'},
    {l:'CDN and asset hosts', d:'intext:"cdn.$TARGET" OR intext:"static.$TARGET" OR intext:"assets.$TARGET"', why:'Identifies asset hosts that can leak build artifacts, old files, or storage patterns.'},
    {l:'Certificate transparency echoes', d:'"$TARGET" "crt.sh" OR "$TARGET" "Subject Alternative Name"', why:'Finds indexed certificate references that can reveal additional hosts.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Sensitive URL Parameters', pack:'Recon', icon:'fa-search', color:'#f59e0b', items:[
    {l:'Token parameters', d:'inurl:token= OR inurl:access_token= OR inurl:auth_token=', why:'Finds indexed URLs that may expose bearer-style values or password reset artifacts.'},
    {l:'API key parameters', d:'inurl:apikey= OR inurl:api_key= OR inurl:key=', why:'Looks for API keys passed through URLs where they can land in logs and search indexes.'},
    {l:'Session parameters', d:'inurl:session= OR inurl:sid= OR inurl:phpsessid=', why:'Highlights URLs that may expose session identifiers or legacy session handling.'},
    {l:'JWT parameters', d:'inurl:jwt= OR inurl:id_token= OR inurl:token_type=', why:'Checks whether token-based auth values have been indexed in query strings.'},
    {l:'Redirect and return parameters', d:'inurl:redirect= OR inurl:return= OR inurl:next= OR inurl:continue=', why:'Flags redirect parameters that are useful for open redirect and auth-flow review.'},
    {l:'File and path parameters', d:'inurl:file= OR inurl:path= OR inurl:download= OR inurl:document=', why:'Locates file-handling parameters that may expand testing around downloads and path handling.'}
  ]});
  addDorkCategory({ type:'sec', cat:'API Keys by Provider', pack:'Secrets', icon:'fa-key', color:'#fbbf24', items:[
    {l:'Google API keys', d:'intext:"AIza" ("maps.googleapis.com" OR "googleapis.com" OR "firebase")', why:'Finds Google API key patterns that should be checked for restrictions and quota risk.'},
    {l:'Firebase config blocks', d:'intext:"apiKey" intext:"authDomain" intext:"firebaseapp.com"', why:'Firebase client config is expected in some apps but useful for identifying exposed projects and rules risk.'},
    {l:'Stripe publishable/live keys', d:'intext:"pk_live_" OR intext:"sk_live_" OR intext:"stripe_secret"', why:'Surfaces Stripe key material and distinguishes public keys from high-risk secret keys.'},
    {l:'SendGrid keys', d:'intext:"SG." OR intext:"SENDGRID_API_KEY" OR intext:"sendgrid_api_key"', why:'Looks for SendGrid tokens that can lead to mail abuse or brand impersonation.'},
    {l:'Mailgun keys', d:'intext:"key-" intext:"mailgun" OR intext:"MAILGUN_API_KEY"', why:'Finds Mailgun credential patterns and configuration leakage.'},
    {l:'Twilio credentials', d:'intext:"AC" intext:"TWILIO_AUTH_TOKEN" OR intext:"twilio_account_sid"', why:'Searches for Twilio SIDs and token variable names that can expose messaging infrastructure.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Cloud Console & SaaS Exposure', pack:'Cloud', icon:'fa-cloud', color:'#60a5fa', items:[
    {l:'Firebase hosted apps', d:'site:firebaseapp.com "$TARGET" OR site:web.app "$TARGET"', why:'Finds Firebase-hosted surfaces related to the target outside the primary domain.'},
    {l:'Supabase projects', d:'site:supabase.co "$TARGET" OR site:supabase.in "$TARGET" OR intext:"supabaseUrl"', why:'Identifies Supabase apps, docs, or config references tied to the target.'},
    {l:'Vercel previews', d:'site:vercel.app "$TARGET" OR inurl:vercel.app "$TARGET"', why:'Locates preview deployments that may expose unreleased or staging builds.'},
    {l:'Netlify previews', d:'site:netlify.app "$TARGET" OR inurl:netlify.app "$TARGET"', why:'Finds Netlify-hosted builds and previews that can sit outside normal inventory.'},
    {l:'Heroku apps', d:'site:herokuapp.com "$TARGET" OR inurl:herokuapp.com "$TARGET"', why:'Discovers Heroku-hosted apps and forgotten environments linked to the target.'},
    {l:'AWS Cognito clues', d:'intext:"cognito-idp" OR intext:"amazoncognito.com" OR intext:"userPoolId"', why:'Finds Cognito identity configuration and hosted auth references for review.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Dev QA & Staging Discovery', pack:'Recon', icon:'fa-code-branch', color:'#a78bfa', items:[
    {l:'Dev URL paths', d:'inurl:dev OR inurl:development OR intitle:"dev"', why:'Finds development paths and titles that may expose weaker controls or debug data.'},
    {l:'Test and QA paths', d:'inurl:test OR inurl:qa OR intitle:"QA"', why:'Surfaces QA and test environments commonly missed in production hardening.'},
    {l:'UAT and pre-prod paths', d:'inurl:uat OR inurl:preprod OR inurl:pre-production', why:'Maps acceptance and pre-production systems that often mirror production data.'},
    {l:'Staging titles', d:'intitle:"staging" OR inurl:staging OR intext:"staging environment"', why:'Locates staging systems by title, URL, and body markers.'},
    {l:'Sandbox portals', d:'inurl:sandbox OR intitle:"sandbox" OR intext:"sandbox login"', why:'Finds sandbox environments where credentials and controls may differ from production.'},
    {l:'Preview deployments', d:'inurl:preview OR inurl:review-app OR intext:"preview deployment"', why:'Searches for temporary deployments that can expose in-progress code.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Technology Fingerprinting', pack:'Recon', icon:'fa-laptop-code', color:'#34d399', items:[
    {l:'Next.js markers', d:'inurl:_next/static OR intext:"__NEXT_DATA__"', why:'Fingerprints Next.js apps and related build outputs for route and source-map review.'},
    {l:'React app markers', d:'intext:"react.production.min.js" OR intext:"data-reactroot" OR intext:"create-react-app"', why:'Identifies React applications and common build chains.'},
    {l:'Laravel markers', d:'intext:"Laravel" OR intitle:"Laravel" OR inurl:/storage/logs', why:'Finds Laravel framework indicators and potentially exposed storage/log paths.'},
    {l:'Django markers', d:'intext:"csrfmiddlewaretoken" OR intitle:"Django" OR intext:"Django REST framework"', why:'Detects Django applications, admin surfaces, and DRF endpoints.'},
    {l:'Rails markers', d:'intext:"Ruby on Rails" OR intext:"csrf-param" OR intext:"csrf-token"', why:'Fingerprints Rails apps through default text and CSRF metadata.'},
    {l:'Spring Boot markers', d:'inurl:/actuator OR intitle:"Whitelabel Error Page" OR intext:"Spring Boot"', why:'Finds Spring Boot apps and actuator-style operational endpoints.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Exposed Build Artifacts', pack:'Code', icon:'fa-file-code', color:'#22d3ee', items:[
    {l:'JavaScript source maps', d:'filetype:map inurl:app OR filetype:map inurl:bundle OR filetype:map inurl:main', why:'Source maps can expose original source code, routes, comments, and secrets.'},
    {l:'Webpack artifacts', d:'intext:"webpackJsonp" OR intext:"webpackChunk" OR inurl:webpack', why:'Webpack markers help identify build structure and discover bundled assets.'},
    {l:'Vite artifacts', d:'inurl:/assets/ intext:"vite" OR intext:"/@vite/client"', why:'Finds Vite builds and dev-server traces that may expose module paths.'},
    {l:'NPM lockfiles', d:'filename:package-lock.json OR filename:yarn.lock OR filename:pnpm-lock.yaml', why:'Lockfiles disclose dependency versions for vulnerability and supply-chain review.'},
    {l:'Composer lockfiles', d:'filename:composer.lock OR filename:composer.json', why:'PHP dependency files reveal packages, versions, and application framework clues.'},
    {l:'Build manifests', d:'filename:asset-manifest.json OR filename:manifest.json intext:"main.js"', why:'Build manifests can enumerate frontend assets and hidden routes.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Error & Stack Trace Hunting', pack:'Error Leaks', icon:'fa-bug', color:'#f87171', items:[
    {l:'Java stack traces', d:'intext:"java.lang." intext:"Exception" OR intext:"at java."', why:'Java stack traces reveal classes, paths, libraries, and backend behavior.'},
    {l:'Node.js errors', d:'intext:"TypeError:" intext:"at " intext:"node_modules" OR intext:"UnhandledPromiseRejection"', why:'Node errors expose package paths, route handlers, and runtime details.'},
    {l:'Laravel debug pages', d:'intext:"Whoops" intext:"Laravel" OR intext:"APP_DEBUG"', why:'Laravel debug output can disclose environment variables and source paths.'},
    {l:'ASP.NET errors', d:'intext:"Server Error in" intext:"Application" OR intext:"System.Web"', why:'ASP.NET error pages reveal framework versions, paths, and configuration state.'},
    {l:'Spring whitelabel errors', d:'intitle:"Whitelabel Error Page" OR intext:"There was an unexpected error"', why:'Spring Boot default error pages help fingerprint apps and exposed routes.'},
    {l:'PHP fatal errors', d:'intext:"Fatal error" intext:"on line" OR intext:"Warning: include"', why:'PHP warnings expose filesystem paths, include behavior, and vulnerable code paths.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Open Directory Deep Cuts', pack:'Files', icon:'fa-folder-open', color:'#f9a8d4', items:[
    {l:'Backup directories', d:'intitle:"index of" (backup OR backups OR bak OR archive)', why:'Finds browsable directories containing backups and archives.'},
    {l:'Database dumps in indexes', d:'intitle:"index of" (sql OR dump OR db OR sqlite)', why:'Locates directory listings that may expose database exports.'},
    {l:'Screenshot folders', d:'intitle:"index of" (screenshots OR captures OR screen) (png OR jpg)', why:'Screenshots can leak internal dashboards, customer data, and workflows.'},
    {l:'Invoice folders', d:'intitle:"index of" (invoice OR invoices OR billing) (pdf OR xls OR csv)', why:'Finds financial document directories that may expose sensitive business records.'},
    {l:'Private folders', d:'intitle:"index of" (private OR confidential OR internal)', why:'Flags directories whose names suggest restricted internal content.'},
    {l:'Log directories', d:'intitle:"index of" (logs OR logfiles) (log OR txt)', why:'Exposed logs can reveal errors, tokens, IPs, emails, and application paths.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Authentication Surface', pack:'Auth', icon:'fa-user-shield', color:'#10b981', items:[
    {l:'Password reset pages', d:'inurl:reset-password OR inurl:forgot-password OR intitle:"reset password"', why:'Maps password recovery flows for review of token handling and account enumeration.'},
    {l:'Magic link flows', d:'inurl:magic-link OR intext:"magic link" OR inurl:passwordless', why:'Finds passwordless authentication flows and tokenized login surfaces.'},
    {l:'SSO callbacks', d:'inurl:callback OR inurl:sso/callback OR inurl:oauth/callback', why:'Identifies callback endpoints involved in identity and OAuth flows.'},
    {l:'Invite pages', d:'inurl:invite OR intext:"accept invitation" OR intitle:"invite"', why:'Discovers invitation flows that may expose tenant or account onboarding behavior.'},
    {l:'Registration pages', d:'inurl:register OR inurl:signup OR intitle:"sign up"', why:'Finds account creation surfaces for access policy and abuse review.'},
    {l:'MFA and recovery pages', d:'inurl:mfa OR inurl:2fa OR inurl:recovery-code', why:'Maps secondary authentication and recovery surfaces that protect account access.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Takeover Candidates', pack:'Infrastructure', icon:'fa-link', color:'#fb923c', items:[
    {l:'GitHub Pages takeover clues', d:'site:github.io "$TARGET" ("There isn\'t a GitHub Pages site here" OR "404")', why:'Looks for GitHub Pages references that may indicate dangling custom domains.'},
    {l:'S3 missing bucket clues', d:'site:s3.amazonaws.com "$TARGET" ("NoSuchBucket" OR "The specified bucket does not exist")', why:'Finds S3 bucket error pages that can indicate dangling storage references.'},
    {l:'Azure website errors', d:'site:azurewebsites.net "$TARGET" ("404 Web Site not found" OR "This web app is stopped")', why:'Checks Azure-hosted app references for stale or unclaimed resources.'},
    {l:'Heroku no app clues', d:'site:herokuapp.com "$TARGET" ("No such app" OR "There is no app configured")', why:'Finds Heroku app errors that may point to abandoned app names.'},
    {l:'Netlify not found clues', d:'site:netlify.app "$TARGET" ("Not Found" OR "Page Not Found")', why:'Searches for Netlify-hosted references that may indicate stale deployments.'},
    {l:'Dangling CNAME mentions', d:'"$TARGET" ("CNAME" "github.io" OR "CNAME" "herokuapp.com" OR "CNAME" "azurewebsites.net")', why:'Finds indexed DNS documentation or records that mention third-party hosting targets.'}
  ]});
  addDorkCategory({ type:'sec', cat:'Code & Config Files', pack:'Code', icon:'fa-file-code', color:'#a5f3fc', items:[
    {l:'Environment files', d:'filename:.env OR filename:.env.local OR filename:.env.production', why:'Environment files commonly contain secrets, database URLs, and service credentials.'},
    {l:'NPM credentials', d:'filename:.npmrc intext:_authToken OR intext:"//registry.npmjs.org/:_authToken"', why:'Finds NPM tokens and package registry credentials accidentally exposed.'},
    {l:'Python package credentials', d:'filename:.pypirc OR intext:"pypi-token" OR intext:"TWINE_PASSWORD"', why:'Searches for Python publishing credentials and repository config leaks.'},
    {l:'Docker credentials', d:'filename:.dockercfg OR filename:config.json intext:"auths" intext:"registry"', why:'Docker config files can include registry authentication material.'},
    {l:'Kubernetes configs', d:'filename:config intext:"clusters:" intext:"contexts:" intext:"users:"', why:'Kubeconfig files can expose cluster endpoints and authentication material.'},
    {l:'Terraform files', d:'filename:terraform.tfvars OR filename:terraform.tfstate OR filetype:tf intext:"provider"', why:'Terraform files reveal cloud resources, variables, state, and sometimes secrets.'}
  ]});
  addDorkCategory({ type:'media', cat:'Credential & Secret Files', pack:'Secrets', icon:'fa-key', color:'#f59e0b', items:[
    {l:'Environment secret files', d:'filename:.env OR filename:.env.local OR filename:.env.production', why:'Finds environment files that often hold database URLs, API keys, and service secrets.'},
    {l:'Registry credential files', d:'filename:.npmrc OR filename:.pypirc OR filename:.dockercfg', why:'Locates package and container registry credential files that may expose publish tokens.'},
    {l:'Private key files', d:'filetype:pem OR filetype:key OR filename:id_rsa OR filename:id_dsa', why:'Searches for private-key material that should never be publicly indexed.'},
    {l:'Config files with passwords', d:'filetype:conf OR filetype:config OR filetype:ini intext:password', why:'Finds configuration files likely to contain credential fields.'},
    {l:'Token-bearing JSON files', d:'filetype:json intext:"token" OR intext:"client_secret" OR intext:"private_key"', why:'Targets JSON files that may contain OAuth, service-account, or API token data.'},
    {l:'Credential text files', d:'filetype:txt (password OR passwd OR credentials OR secret)', why:'Checks text files and notes for obvious credential labels.'}
  ]});
  addDorkCategory({ type:'media', cat:'Backup File Hunter', pack:'Archives', icon:'fa-archive', color:'#f97316', items:[
    {l:'Backup extensions', d:'filetype:bak OR filetype:backup OR filetype:old OR filetype:orig', why:'Finds common backup copy extensions that can leak source or sensitive documents.'},
    {l:'Compressed backups', d:'filetype:zip OR filetype:rar OR filetype:7z OR filetype:tar.gz', why:'Locates compressed archives that may contain full sites, configs, or database exports.'},
    {l:'Date-stamped archives', d:'backup_2024 OR backup_2025 OR backup_2026 OR inurl:backup-', why:'Searches naming patterns often used for scheduled backup artifacts.'},
    {l:'Website backup archives', d:'inurl:backup (filetype:zip OR filetype:tar OR filetype:gz)', why:'Targets backup archives stored under obvious backup paths.'},
    {l:'Old site copies', d:'inurl:old OR inurl:old_site OR inurl:archive filetype:zip', why:'Finds retired or archived site copies that may still be indexed.'},
    {l:'Editor temp files', d:'filetype:swp OR filetype:tmp OR filetype:save OR filetype:orig', why:'Locates temporary editor files that can reveal source or credentials.'}
  ]});
  addDorkCategory({ type:'media', cat:'Database File Hunter', pack:'Data', icon:'fa-database', color:'#10b981', items:[
    {l:'SQL dump files', d:'filetype:sql intext:"CREATE TABLE" OR intext:"INSERT INTO"', why:'Finds SQL dumps that may contain full database schema and records.'},
    {l:'SQLite and DB files', d:'filetype:sqlite OR filetype:sqlite3 OR filetype:db', why:'Locates embedded database files commonly used by apps and tools.'},
    {l:'Database backup files', d:'filetype:dump OR filetype:bak intext:"database"', why:'Searches for database-specific backup and dump artifacts.'},
    {l:'Access database files', d:'filetype:mdb OR filetype:accdb', why:'Finds Microsoft Access databases that may hold business or customer data.'},
    {l:'phpMyAdmin exports', d:'filetype:sql intext:"phpMyAdmin SQL Dump"', why:'Targets recognizable phpMyAdmin export headers.'},
    {l:'Mongo/JSON exports', d:'filetype:json intext:"_id" intext:"ObjectId" OR intext:"$date"', why:'Finds JSON database exports with MongoDB-style fields.'}
  ]});
  addDorkCategory({ type:'media', cat:'Source Code Files', pack:'Code', icon:'fa-laptop-code', color:'#a5f3fc', items:[
    {l:'PHP source files', d:'filetype:php intext:"<?php" OR inurl:.php~', why:'Finds indexed PHP source and backup variants that may expose application logic.'},
    {l:'Python source files', d:'filetype:py intext:"import" OR intext:"def "', why:'Locates Python source files and scripts exposed to search indexes.'},
    {l:'JavaScript and TypeScript', d:'filetype:js OR filetype:ts intext:"api" OR intext:"token"', why:'Searches frontend and Node files for endpoints, tokens, and implementation clues.'},
    {l:'Java source files', d:'filetype:java intext:"public class" OR intext:"private String"', why:'Finds Java source files that disclose classes, credentials, and backend logic.'},
    {l:'Project manifests', d:'filename:package.json OR filename:composer.json OR filename:pom.xml OR filename:requirements.txt', why:'Manifests reveal dependencies, framework choices, scripts, and package versions.'},
    {l:'Source maps', d:'filetype:map inurl:bundle OR inurl:app OR inurl:main', why:'Source maps can reconstruct original frontend source and route structure.'}
  ]});
  addDorkCategory({ type:'media', cat:'Config & Infrastructure Files', pack:'Infrastructure', icon:'fa-server', color:'#67e8f9', items:[
    {l:'Docker compose files', d:'filename:docker-compose.yml OR filename:docker-compose.yaml', why:'Docker Compose files reveal services, ports, images, volumes, and environment names.'},
    {l:'Kubernetes config files', d:'filename:config intext:"clusters:" intext:"contexts:" intext:"users:"', why:'Kubeconfig files expose cluster endpoints and auth configuration.'},
    {l:'Terraform state and vars', d:'filename:terraform.tfstate OR filename:terraform.tfvars OR filetype:tfvars', why:'Terraform files can reveal cloud inventory, variables, and secret values.'},
    {l:'CI pipeline configs', d:'filename:.gitlab-ci.yml OR filename:circle.yml OR filename:Jenkinsfile', why:'CI configs disclose deployment steps, secret names, and internal services.'},
    {l:'Nginx configs', d:'filetype:conf intext:"server_name" intext:"nginx"', why:'Nginx configs show virtual hosts, upstreams, paths, and proxy rules.'},
    {l:'Apache configs', d:'filetype:conf intext:"VirtualHost" OR filename:.htaccess', why:'Apache configs reveal redirects, auth rules, exposed directories, and app paths.'}
  ]});
  addDorkCategory({ type:'media', cat:'Document Classification', pack:'Documents', icon:'fa-file-alt', color:'#ef4444', items:[
    {l:'Confidential documents', d:'filetype:pdf OR filetype:doc OR filetype:docx "confidential"', why:'Finds documents explicitly labeled confidential and likely intended for limited access.'},
    {l:'Internal-only files', d:'filetype:pdf OR filetype:docx ("internal use only" OR "internal only")', why:'Surfaces internal documents that may expose processes, contacts, or strategy.'},
    {l:'Restricted documents', d:'filetype:pdf OR filetype:docx ("restricted" OR "proprietary")', why:'Locates files with restricted or proprietary labels.'},
    {l:'Contracts and agreements', d:'filetype:pdf OR filetype:docx (contract OR agreement OR MSA OR NDA)', why:'Finds legal documents that may disclose vendors, terms, and business relationships.'},
    {l:'HR and payroll docs', d:'filetype:xls OR filetype:xlsx OR filetype:pdf (payroll OR salary OR compensation OR HR)', why:'Targets HR files and spreadsheets that can expose employee-sensitive information.'},
    {l:'Security and policy docs', d:'filetype:pdf ("SOC 2" OR "ISO 27001" OR "security policy" OR "penetration test")', why:'Finds compliance and security documents useful for exposure review.'}
  ]});
  addDorkCategory({ type:'media', cat:'Spreadsheet Intelligence', pack:'Documents', icon:'fa-table', color:'#34d399', items:[
    {l:'Employee spreadsheets', d:'filetype:xls OR filetype:xlsx OR filetype:csv ("employee" OR "staff" OR "directory")', why:'Finds staff lists and directories that may expose names, roles, and contact details.'},
    {l:'Vendor spreadsheets', d:'filetype:xls OR filetype:xlsx OR filetype:csv ("vendor" OR "supplier")', why:'Locates vendor and supplier lists that reveal third-party relationships.'},
    {l:'Asset inventories', d:'filetype:xls OR filetype:xlsx OR filetype:csv ("asset inventory" OR "hardware inventory" OR "software inventory")', why:'Finds inventories that may disclose systems, software, and ownership.'},
    {l:'Password columns', d:'filetype:xls OR filetype:xlsx OR filetype:csv ("password" OR "passwd" OR "credentials")', why:'Searches spreadsheets for credential-like column names.'},
    {l:'Budget and procurement sheets', d:'filetype:xls OR filetype:xlsx OR filetype:csv ("budget" OR "procurement" OR "purchase order")', why:'Finds finance and procurement spreadsheets with business-sensitive data.'},
    {l:'Contact exports', d:'filetype:csv ("email" "phone" "address")', why:'Targets exported contact datasets that can expose personal information.'}
  ]});
  addDorkCategory({ type:'media', cat:'Presentation Hunter', pack:'Documents', icon:'fa-file-alt', color:'#c084fc', items:[
    {l:'Investor decks', d:'filetype:ppt OR filetype:pptx OR filetype:pdf "investor presentation"', why:'Finds investor decks that may disclose roadmap, metrics, and strategy.'},
    {l:'Roadmap decks', d:'filetype:ppt OR filetype:pptx OR filetype:pdf ("roadmap" OR "product roadmap")', why:'Locates roadmap presentations that may reveal upcoming features and timelines.'},
    {l:'Internal training decks', d:'filetype:ppt OR filetype:pptx "internal training"', why:'Finds training material that can disclose internal tools and processes.'},
    {l:'Security awareness decks', d:'filetype:ppt OR filetype:pptx "security awareness"', why:'Security training decks can reveal policies, threat models, and internal terminology.'},
    {l:'Architecture decks', d:'filetype:ppt OR filetype:pptx OR filetype:pdf ("architecture diagram" OR "system architecture")', why:'Finds technical presentations that may expose system design and data flows.'},
    {l:'Board and strategy decks', d:'filetype:ppt OR filetype:pptx OR filetype:pdf ("board deck" OR "strategy deck")', why:'Locates executive presentations with sensitive strategic context.'}
  ]});
  addDorkCategory({ type:'media', cat:'Image & Screenshot Hunter', pack:'Media', icon:'fa-film', color:'#fb923c', items:[
    {l:'Screenshot files', d:'filetype:png OR filetype:jpg ("screenshot" OR "screen shot" OR "capture")', why:'Finds screenshots that may expose dashboards, tickets, customer records, or internal tools.'},
    {l:'Dashboard captures', d:'filetype:png OR filetype:jpg ("dashboard" OR "grafana" OR "kibana")', why:'Searches images likely to show operational metrics or monitoring interfaces.'},
    {l:'Network diagrams', d:'filetype:png OR filetype:jpg OR filetype:pdf ("network diagram" OR "network topology")', why:'Finds diagrams that can reveal network layout and trust boundaries.'},
    {l:'Architecture images', d:'filetype:png OR filetype:jpg ("architecture diagram" OR "system design")', why:'Locates image-based architecture documentation that may not appear as text docs.'},
    {l:'Whiteboard photos', d:'filetype:jpg OR filetype:png ("whiteboard" OR "workshop")', why:'Whiteboard photos may leak planning notes, diagrams, and internal names.'},
    {l:'Open image directories', d:'intitle:"index of" (png OR jpg OR jpeg) (screenshot OR diagram OR dashboard)', why:'Finds browsable directories full of sensitive images or captures.'}
  ]});
  addDorkCategory({ type:'media', cat:'Audio & Video Training Files', pack:'Media', icon:'fa-film', color:'#818cf8', items:[
    {l:'Meeting recordings', d:'filetype:mp4 OR filetype:mkv OR filetype:mov ("meeting recording" OR "recorded meeting")', why:'Finds recorded meetings that may expose internal discussions and screenshares.'},
    {l:'Webinar recordings', d:'filetype:mp4 OR filetype:mov ("webinar" OR "recording")', why:'Locates webinar files and public recordings relevant to the target.'},
    {l:'Training videos', d:'filetype:mp4 OR filetype:mkv ("training" OR "onboarding")', why:'Finds training and onboarding media that can reveal internal systems and processes.'},
    {l:'Security briefings', d:'filetype:mp4 OR filetype:mov ("security briefing" OR "incident response")', why:'Searches for security-related recordings that may include sensitive procedures.'},
    {l:'Audio briefings', d:'filetype:mp3 OR filetype:m4a OR filetype:wav ("briefing" OR "meeting")', why:'Finds audio files that can contain meeting notes, briefings, or interviews.'},
    {l:'Open media directories', d:'intitle:"index of" (mp4 OR mov OR mp3 OR wav) (training OR meeting OR webinar)', why:'Finds directory listings containing audio and video files.'}
  ]});
  addDorkCategory({ type:'media', cat:'Open Directory File Types', pack:'Directories', icon:'fa-folder-open', color:'#f9a8d4', items:[
    {l:'Document directories', d:'intitle:"index of" (pdf OR doc OR docx OR xls OR xlsx)', why:'Finds open directories containing common office documents.'},
    {l:'Backup directories', d:'intitle:"index of" (backup OR backups OR archive OR old)', why:'Locates directories likely to hold backup files and old site copies.'},
    {l:'Private directories', d:'intitle:"index of" (private OR confidential OR internal OR restricted)', why:'Flags directory listings whose names suggest nonpublic content.'},
    {l:'Mixed sensitive extensions', d:'intitle:"index of" (sql OR env OR key OR pem OR log)', why:'Searches for directory listings with high-risk file extensions.'},
    {l:'Log file directories', d:'intitle:"index of" (log OR logs OR logfile)', why:'Finds open directories containing logs that may reveal tokens and errors.'},
    {l:'Archive-heavy directories', d:'intitle:"index of" (zip OR rar OR 7z OR tar OR gz)', why:'Locates browsable directories dominated by archives.'}
  ]});
  addDorkCategory({ type:'media', cat:'Government Legal & Compliance Docs', pack:'Public Records', icon:'fa-landmark', color:'#fbbf24', items:[
    {l:'Procurement documents', d:'filetype:pdf ("procurement" OR "purchase order" OR "tender")', why:'Finds procurement files that disclose vendors, services, and spending.'},
    {l:'RFP and RFI files', d:'filetype:pdf OR filetype:docx ("request for proposal" OR "request for information" OR RFP OR RFI)', why:'Locates public solicitation documents with requirements and vendor context.'},
    {l:'Court records', d:'filetype:pdf ("court" OR "case number" OR "docket")', why:'Finds legal records and filings relevant to public-record research.'},
    {l:'Environmental reports', d:'filetype:pdf ("environmental impact" OR "assessment report")', why:'Locates environmental documents that may reveal facilities, projects, and timelines.'},
    {l:'Regulatory filings', d:'filetype:pdf ("regulatory filing" OR "annual filing" OR "compliance report")', why:'Finds filings and compliance reports with operational and legal details.'},
    {l:'Policy and audit docs', d:'filetype:pdf ("audit report" OR "policy manual" OR "compliance policy")', why:'Searches public audit and policy documents for governance and control details.'}
  ]});

  DORKS.forEach(function(cat){
    cat.items.forEach(function(it){
      if (!it.why) it.why = defaultWhyForItem(it, cat);
    });
  });
}

enrichDorks();

// ensure saved indicator shows on load
updateSavedIndicator();

function toast(msg, type) {
  type = type || 'ok';
  var wrap = document.getElementById('toast-wrap');
  var t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = '<i class="fas fa-' + (type === 'ok' ? 'check' : 'exclamation-circle') + '"></i> ' + msg;
  wrap.appendChild(t);
  setTimeout(function() { t.classList.add('show'); }, 10);
  setTimeout(function() {
    t.classList.remove('show');
    setTimeout(function() { t.remove(); }, 300);
  }, 3000);
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
