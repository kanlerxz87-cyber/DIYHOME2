const BASE_URL = 'https://kanlerxz87-cyber.github.io/DIYHOME2/';

export const sources = {
  amazonAgreement: 'https://affiliate-program.amazon.com/help/operating/agreement',
  amazonPolicies: 'https://affiliate-program.amazon.com/help/operating/policies',
  amazonAsin: 'https://sell.amazon.com/blog/how-to-create-a-new-asin-amazon',
  ftcDisclosure: 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers',
  googleSearchConsole: 'https://search.google.com/search-console/about',
  googleSitemap: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap',
  googleOutboundLinks: 'https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links',
  githubPages: 'https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages',
  rssSpecification: 'https://www.rssboard.org/rss-specification'
};

const link = (url, label, key = 'official_reference') =>
  `<a class="source-link" href="${url}" target="_blank" rel="noopener noreferrer" data-analytics-key="${key}">${label}</a>`;

const sourceAmazonPolicies = link(sources.amazonPolicies, 'Amazon Associates Program Policies', 'amazon_program_policies');
const sourceAgreement = link(sources.amazonAgreement, 'Amazon Associates Operating Agreement', 'amazon_operating_agreement');
const sourceAsin = link(sources.amazonAsin, 'Amazon’s ASIN guide', 'amazon_asin_guide');
const sourceFtc = link(sources.ftcDisclosure, 'FTC Disclosures 101', 'ftc_disclosures_101');
const sourceGsc = link(sources.googleSearchConsole, 'Google Search Console', 'google_search_console');
const sourceSitemap = link(sources.googleSitemap, 'Google’s sitemap guidance', 'google_sitemap_guidance');
const sourceRel = link(sources.googleOutboundLinks, 'Google’s outbound-link guidance', 'google_outbound_links');
const sourcePages = link(sources.githubPages, 'GitHub Pages workflow documentation', 'github_pages_docs');
const sourceRss = link(sources.rssSpecification, 'RSS 2.0 specification', 'rss_specification');

const guideCards = [
  {
    href: 'air-fryer-comparison.html',
    number: '01',
    title: 'Basket or oven-style air fryer: what should you compare?',
    description: 'A format-neutral checklist for fit, capacity, controls, cleanup, and the details a manual can actually confirm.'
  },
  {
    href: 'air-fryer-capacity.html',
    number: '02',
    title: 'A no-hype checklist for comparing air fryer capacity',
    description: 'A way to compare stated capacity without pretending a single number answers every kitchen question.'
  },
  {
    href: 'cleanup-counter-space.html',
    number: '03',
    title: 'How to assess cleanup and counter-space trade-offs',
    description: 'Measure the space you have, then check the manufacturer’s care instructions before choosing.'
  },
  {
    href: 'multi-function-appliance.html',
    number: '04',
    title: 'Questions to ask before buying a multi-function kitchen appliance',
    description: 'Turn a long feature list into a shorter set of questions about use, accessories, and care.'
  }
];

const cardGrid = (prefix = '') => `<div class="guide-grid">${guideCards.map((guide, index) => `
  <article class="guide-card${index === 0 ? ' featured' : ''}">
    <p class="eyebrow">Kitchen notes · ${guide.number}</p>
    <h3>${guide.title}</h3>
    <p>${guide.description}</p>
    <a class="text-link" href="${prefix}${guide.href}">Read the guide</a>
  </article>`).join('')}
</div>`;

const productTable = ({ productIntent }) => {
  const empty = '<span class="cell-empty" aria-label="Unverified; value intentionally left blank">—</span>';
  const rows = productIntent.records.map((record) => `
    <tr id="${record.submissionId.toLowerCase()}">
      <td><strong>${record.submissionId}</strong></td>
      <td><code>${record.submittedUrl}</code><br><span class="table-status">User-supplied URL</span></td>
      <td>${empty}</td>
      <td>${empty}</td>
      <td>${empty}</td>
      <td>${empty}</td>
      <td>${empty}</td>
      <td><span class="table-status">Unverified</span></td>
      <td><span class="source-ref">${link(sources.amazonPolicies, 'Amazon link rules', 'amazon_program_policies')}</span></td>
    </tr>`).join('');
  return `<div class="table-scroll" role="region" aria-label="Product intent confirmation records" tabindex="0">
    <table data-source-required="true">
      <thead><tr>
        <th scope="col">Record</th><th scope="col">Submitted URL</th><th scope="col">Intended ASIN</th>
        <th scope="col">Official listing URL</th><th scope="col">Confirmation date</th><th scope="col">Source</th>
        <th scope="col">Observed redirect target</th><th scope="col">Status</th><th scope="col">Rule source</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>`;
};

const productsPageBody = (context) => `
  <div class="page-heading">
    <p class="eyebrow">The shortlist · product shelf</p>
    <h1>Products worth a closer look.</h1>
    <p class="lede">The opening shortlist is being matched to official listings before it becomes a shop. No product title, price, review score, or checkout link is guessed into place.</p>
  </div>
  <div class="status-banner">
    <span class="status-pill">Verification hold</span>
    <p>Four link submissions are on file. The second URL was submitted twice and is preserved twice. The short links have not been tested here; their compliance and destinations remain unresolved, not declared invalid.</p>
  </div>
  <section class="content-section" aria-labelledby="intent-records">
    <h2 id="intent-records">Product-intent confirmation records</h2>
    <p>Intended listing identity and observed redirect destination are kept in separate fields. Empty values are deliberately blank until an authorized Associates workflow and an official listing source confirm them.</p>
    ${productTable(context)}
    <p class="table-caption">The linked Amazon policy is the rule reference for Special Links; it is not evidence that any submitted URL is valid, invalid, assigned to this account, or points to a particular product.</p>
  </section>
  <section class="content-section">
    <h2>What has to be true before a product goes live</h2>
    <ol class="topic-list">
      <li><strong>Identify the intended item.</strong><span>Confirm an ASIN and the official product-detail URL from a primary source. Amazon describes ASINs as catalog identifiers in ${sourceAsin}.</span></li>
      <li><strong>Test one intended link in the enrolled Associates workflow.</strong><span>Record the actual destination separately from the intended listing, then check the tracking report before scaling. See ${sourceAmazonPolicies}.</span></li>
      <li><strong>Publish a useful, supported comparison.</strong><span>Do not add current prices, availability, ratings, or product claims without permitted, current, traceable evidence. Amazon’s policy sets conditions for displaying price and availability data.</span></li>
      <li><strong>Mark any activated product link as sponsored.</strong><span>The site’s publication gate requires <code>rel="sponsored nofollow noopener noreferrer"</code> on every outbound product link; Google explains its paid-link qualification guidance ${sourceRel}.</span></li>
    </ol>
    <div class="note-box"><strong>Tracking ID on file:</strong> <code>${context.productIntent.trackingId.value}</code> — supplied in the brief; account assignment and enrollment have not been independently verified. No product link is active.</div>
  </section>
  <p class="hero-actions"><a class="button" href="requirements.html">See the publishing gates</a><a class="button secondary" href="flagged-for-review.html">Open flagged items</a></p>
`;

const researchRows = [
  ['Product identity', '—', 'Unverified', sources.amazonAsin, 'Amazon’s ASIN guide'],
  ['Special Link destination and tag', '—', 'Unresolved', sources.amazonPolicies, 'Amazon Associates Program Policies'],
  ['Current price and availability', '—', 'Not collected', sources.amazonPolicies, 'Amazon Associates Program Policies'],
  ['Review count and rating', '—', 'Not collected', sources.amazonPolicies, 'Amazon Associates Program Policies'],
  ['Commission rate or earnings', '—', 'Not confirmed', sources.amazonPolicies, 'Amazon Associates Program Policies'],
  ['Search demand and query mix', '—', 'No property data', sources.googleSearchConsole, 'Google Search Console'],
  ['Competition and ranking position', '—', 'No query sample', sources.googleSearchConsole, 'Google Search Console'],
  ['Eligible sessions, clicks, and reported orders', '—', 'No authorized report rows', sources.amazonPolicies, 'Amazon Associates Program Policies']
];

const researchTable = () => `<div class="table-scroll" role="region" aria-label="Research findings and evidence sources" tabindex="0">
  <table data-source-required="true">
    <thead><tr><th scope="col">Research question</th><th scope="col">Finding</th><th scope="col">Status</th><th scope="col">Official reference</th></tr></thead>
    <tbody>${researchRows.map(([question, value, status, url, label]) => `<tr>
      <td><strong>${question}</strong></td><td><span class="cell-empty" aria-label="No verified value">${value}</span></td>
      <td><span class="table-status">${status}</span></td>
      <td><span class="source-ref">${link(url, label, 'research_reference')}</span></td>
    </tr>`).join('')}</tbody>
  </table>
</div>`;

const requirementRows = [
  ['PUB-01', 'Publication-first front page and category browsing', 'Implemented', 'Content and navigation are organized around buyer questions; the product shelf stays honest while listing records are unresolved.', sources.githubPages, 'GitHub Pages site documentation'],
  ['PROD-01', 'Record intended ASIN, official URL, confirmation date, and source separately from observed redirect', 'Schema present; values unverified', 'Four submission rows are retained, including the repeated URL. Confirmation fields and observed destinations remain blank.', sources.amazonAsin, 'Amazon’s ASIN guide'],
  ['LINK-01', 'Test one link per product in the enrolled Associates workflow', 'Pending account workflow', 'No account was accessed and no supplied link was followed or tested; no compliance conclusion is made.', sources.amazonPolicies, 'Amazon Associates Program Policies'],
  ['LINK-02', 'Mark outbound product links as sponsored', 'Gate implemented; no product links active', 'The build verifier rejects marked product links unless their rel value includes sponsored. Google’s guidance explains the sponsored value for paid links.', sources.googleOutboundLinks, 'Google outbound-link guidance'],
  ['DISC-01', 'Show the affiliate disclosure under the masthead and again in the footer', 'Implemented', 'The same disclosure strip is rendered on every page; it distinguishes the required statement from the unverified account status.', sources.amazonAgreement, 'Amazon Associates Operating Agreement'],
  ['DISC-02', 'Review endorsement context and disclosure placement', 'Reference added; legal review not certified', 'FTC guidance says disclosures should be clear, hard to miss, and close to the endorsement. This site does not claim legal approval.', sources.ftcDisclosure, 'FTC Disclosures 101'],
  ['SEO-01', 'Use one canonical site, sitemap, and RSS feed', 'Generated in build', 'A single GitHub Pages canonical base is used; every guide manifest entry is emitted to the sitemap and RSS feed.', sources.googleSitemap, 'Google sitemap guidance'],
  ['SEO-02', 'Measure queries in Search Console before choosing follow-up topics', 'Not connected', 'The property is not verified or connected in this session; no search-volume or popularity claim is shown.', sources.googleSearchConsole, 'Google Search Console'],
  ['MEAS-01', 'Count page views and outbound/product clicks without visitor identifiers', 'Self-hosted endpoint implemented; Pages has no API runtime', 'The app aggregates daily counters only. GitHub Pages is static hosting; this repository’s Node endpoint is not deployed by Pages.', sources.githubPages, 'GitHub Pages workflow documentation'],
  ['MEAS-02', 'Record orders only from authorized first-party reports', 'Import gate implemented; no reports imported', 'The report endpoint requires a private bearer token; the campaign ledger is empty until an authorized report is imported.', sources.amazonPolicies, 'Amazon Associates Program Policies'],
  ['EDITOR-01', 'Publish the four question-shaped guide hypotheses', 'Published as frameworks', 'Guide titles came from the brief and are not represented as popular, high-volume, or trend-validated searches.', sources.googleSearchConsole, 'Google Search Console'],
  ['PUB-02', 'Ship RSS and provide a single navigation group and footer access', 'Implemented', 'All publication and dashboard surfaces are in the Explore group and repeated in the footer; guides feed the generated RSS file.', sources.githubPages, 'GitHub Pages site documentation'],
  ['PUB-03', 'Publish a seasonal file, cluster links, authorship note, and cadence', 'Seasonal page added; cadence is editorial plan', 'The winter 2026/27 file groups the kitchen guides and operations pages without claiming product demand. Authorship is shown as the DIY HOME Editorial Desk because no individual byline was supplied.', sources.githubPages, 'GitHub Pages site documentation'],
  ['SEO-03', 'Provide a Search Console setup surface before choosing follow-up topics', 'Surface present; property not connected', 'The seasonal file lists the verification and sitemap-submission steps. No property ownership, query data, or ranking claim is made until the account is connected.', sources.googleSearchConsole, 'Google Search Console'],
  ['AI-01', 'Automate research and optimization only within approved data and policy boundaries', 'Not enabled', 'No product research API or AI pipeline is connected. Amazon’s current policy includes a written-approval condition for using Special Links or Program Content to develop machine-learning models.', sources.amazonPolicies, 'Amazon Associates Program Policies']
];

const requirementsTable = () => `<div class="table-scroll" role="region" aria-label="Requirements and implementation status" tabindex="0">
  <table data-source-required="true">
    <thead><tr><th scope="col">ID</th><th scope="col">Requirement</th><th scope="col">Status</th><th scope="col">Implementation / evidence</th><th scope="col">Official reference</th></tr></thead>
    <tbody>${requirementRows.map(([id, title, status, evidence, url, label]) => `<tr>
      <td><strong>${id}</strong></td><td>${title}</td><td><span class="table-status">${status}</span></td><td>${evidence}</td>
      <td><span class="source-ref">${link(url, label, 'requirement_reference')}</span></td>
    </tr>`).join('')}</tbody>
  </table>
</div>`;

const flaggedRows = [
  ['FR-01 · S02', 'Supplied short links', 'No link was followed. Intended ASIN, official listing, confirmation source/date, and observed redirects are blank. Exact compliance remains unresolved; no link is called invalid.', sources.amazonPolicies, 'Amazon Associates Program Policies'],
  ['FR-02', 'Tracking ID and Associates enrollment', 'shopnow047c-20 was supplied by the owner. This repository cannot verify account ownership, enrollment, or assignment of the ID.', sources.amazonAgreement, 'Amazon Associates Operating Agreement'],
  ['FR-03', 'AI use of Amazon program content', 'No Amazon Program Content, Special Links, or product data is fed into an AI/ML model. Obtain written approval and check the current policy before enabling that workflow.', sources.amazonPolicies, 'Amazon Associates Program Policies'],
  ['FR-04', 'Search Console and measured demand', 'No property verification or report data is available. Query demand, trend status, ranking, and traffic are therefore blank.', sources.googleSearchConsole, 'Google Search Console'],
  ['FR-05', 'Live analytics on GitHub Pages', 'The privacy-preserving Node endpoint is implemented for self-hosting, but GitHub Pages serves the static publication and does not run this endpoint. No live Pages analytics are claimed.', sources.githubPages, 'GitHub Pages workflow documentation'],
  ['FR-06', 'Price, reviews, commissions, orders, and forecasts', 'No item-specific official listing or authorized first-party report is available. No values, conversion score, or revenue forecast are displayed.', sources.amazonPolicies, 'Amazon Associates Program Policies'],
  ['FR-07 · S01 / S07 / S24', 'Referenced source-register IDs', 'The brief names these identifiers, but their underlying source register was not present in the repository. We used the current official Amazon and FTC references listed here instead; the original ID-to-source mapping is unknown.', sources.ftcDisclosure, 'FTC Disclosures 101']
];

const flaggedTable = () => `<div class="table-scroll" role="region" aria-label="Flagged items for review" tabindex="0">
  <table data-source-required="true">
    <thead><tr><th scope="col">Flag</th><th scope="col">Item</th><th scope="col">What is known / unknown</th><th scope="col">Official reference</th></tr></thead>
    <tbody>${flaggedRows.map(([id, title, details, url, label]) => `<tr>
      <td><strong>${id}</strong></td><td>${title}</td><td>${details}</td><td><span class="source-ref">${link(url, label, 'review_reference')}</span></td>
    </tr>`).join('')}</tbody>
  </table>
</div>`;

const editorialGate = `<div class="note-box"><strong>Editorial status:</strong> These are question-led checklists, not product tests or rankings. Their working titles were supplied as hypotheses in the brief. No search demand, popularity, product performance, or sales claim is made. ${sourceGsc} is the proposed official query-measurement source once the property is verified.</div>`;

export const pages = [
  {
    path: 'index.html',
    canonicalPath: '',
    type: 'home',
    section: 'Front page',
    title: 'DIY Home — thoughtful upgrades for everyday living',
    description: 'Question-led home and kitchen buying guides, with product details held until they can be checked against official sources.',
    published: '2026-11-20',
    summary: 'A publication front page for clear, no-hype home buying guides. The first kitchen product submissions remain held for official identification.',
    body: (context) => `
      <section class="hero" aria-labelledby="front-title">
        <div class="hero-copy">
          <p class="eyebrow">DIY HOME · WINTER 2026/27 · KITCHEN ISSUE 01</p>
          <h1 id="front-title">Better home choices start with <em>better questions.</em></h1>
          <p class="lede">Practical, no-hype guides for the home decisions that deserve a closer look. Start with the question, compare the details that fit your space, and keep product claims tied to a source.</p>
          <div class="hero-actions">
            <a class="button" href="guides/">Read the buying guides</a>
            <a class="button secondary" href="shop.html">Browse the shortlist</a>
          </div>
          <p class="hero-note">Four link submissions are on file. Product names and outbound shopping links stay off the shelf until their official listings and intended destinations are confirmed.</p>
        </div>
        <div class="hero-art">
          <img src="assets/cover.svg" width="620" height="470" alt="Original editorial illustration of a home counter, measuring tape, plant, bowl, and morning light; not a depiction of a specific product.">
          <span class="hero-stamp">Make room<br>for useful</span>
        </div>
      </section>

      <section class="section" aria-labelledby="shelf-title">
        <div class="section-heading">
          <div><p class="eyebrow">The opening shelf</p><h2 id="shelf-title">A shortlist, not a sales pitch.</h2></div>
          <a class="text-link" href="shop.html">See all submissions</a>
        </div>
        <p class="lede shelf-intro">The submitted URLs have not been matched to official product pages. We keep the four records intact—including the repeated URL—rather than invent product names, prices, or recommendations.</p>
        <div class="shelf-grid">
          ${context.productIntent.records.map((record, index) => `<article class="product-card">
            <div class="product-card-top"><span class="record-id">SUBMISSION ${String(index + 1).padStart(2, '0')}</span><span class="status-pill">Details pending</span></div>
            <span class="product-symbol" aria-hidden="true">${['01', '02', '03', '04'][index]}</span>
            <h3>Listing match pending</h3>
            <p>Identity and official listing source not confirmed. No product link is active.</p>
            <a class="text-link" href="shop.html#${record.submissionId.toLowerCase()}">View record</a>
          </article>`).join('')}
        </div>
      </section>

      <section class="section" aria-labelledby="questions-title">
        <div class="section-heading">
          <div><p class="eyebrow">Read by question</p><h2 id="questions-title">Start with what you need to decide.</h2></div>
          <p>These opening kitchen guides are working editorial hypotheses—not claims about what people are searching for.</p>
        </div>
        ${cardGrid('guides/')}
      </section>

      <section class="section banner" aria-label="Editorial promise">
        <div><p class="eyebrow">Our simple rule</p><h2>Useful first. Verifiable always.</h2><p>We publish the comparison framework now and add product details only when the listing, source, date, and link destination can be checked.</p></div>
        <a class="button" href="executive-summary.html">Read the executive summary</a>
      </section>
      <section class="section follow-panel" aria-label="Follow new publication notes">
        <div><p class="eyebrow">Follow the publication</p><h2 class="subheading">The kitchen notes, in your feed.</h2><p>RSS is available for reader-led updates. No email address or subscriber profile is collected by this site.</p></div>
        <div class="follow-actions"><a class="button secondary" href="feed.xml" type="application/rss+xml">Follow via RSS</a><a class="text-link" href="seasonal/winter-2026-27.html">Open the seasonal file</a></div>
      </section>
    `
  },
  {
    path: 'executive-summary.html',
    type: 'page',
    section: 'Publication',
    title: 'Executive summary — DIY Home',
    description: 'What this publication includes, what was verified, and the gates that remain before product links and analytics can go live.',
    published: '2026-11-20',
    summary: 'Executive summary of the publication, product-intent register, measurement endpoint, source checks, and unresolved items.',
    body: (context) => `
      <div class="page-heading"><p class="eyebrow">Executive summary · 20 November 2026</p><h1>A buyer-first publication, with clear gates.</h1>
        <p class="lede">This release turns the initial brief into a small, readable home-and-kitchen publication and a source-aware publishing workflow. It does not fabricate product research, click data, orders, or earnings.</p></div>
      <div class="metric-grid">
        <div class="metric-card"><p class="eyebrow">Submitted link records</p><strong class="metric-value">${context.productIntent.records.length}</strong><span class="metric-label">Includes the repeated URL as its own submission.</span></div>
        <div class="metric-card"><p class="eyebrow">Verified product listings</p><strong class="metric-value">0</strong><span class="metric-label">ASIN, official listing, and redirect fields remain blank.</span></div>
        <div class="metric-card"><p class="eyebrow">Authorized report rows</p><strong class="metric-value">0</strong><span class="metric-label">No Associates report data was provided or imported.</span></div>
      </div>
      <section class="content-section"><h2>What is included</h2>
        <ul>
          <li>A reader-facing front page, a product-intent shelf, a kitchen guide category, and four question-shaped guide frameworks.</li>
          <li>A four-row product-intent record that separates the supplied URL, intended ASIN, official listing URL, confirmation date, source, and observed redirect target.</li>
          <li>A privacy-minimizing, self-hosted Node endpoint for aggregate page/click events and token-gated first-party report imports.</li>
          <li>A blank campaign ledger, with no conversion score, revenue estimate, or invented performance row.</li>
          <li>Generated canonical URLs, an XML sitemap, RSS feed, and a GitHub Pages Actions workflow.</li>
          <li>A site-wide disclosure strip beneath the masthead and a repeated disclosure in every page footer.</li>
        </ul>
      </section>
      <section class="content-section"><h2>What is not verified or live</h2>
        <div class="warning-box"><strong>Important:</strong> The product suffixes are not treated as confirmed ASINs. We did not follow the supplied short links, so no redirect targets were observed. Their precise compliance status remains unresolved, not declared invalid.</div>
        <ul>
          <li>Product identity, titles, specifications, price, availability, reviews, commission category/rate, and suitability.</li>
          <li>Amazon Associates account enrollment and assignment of the user-supplied tracking ID <code>${context.productIntent.trackingId.value}</code>.</li>
          <li>Search Console ownership, query data, search demand, rankings, traffic, trends, or content performance.</li>
          <li>Live analytics on GitHub Pages. Pages hosts the static site; the Node analytics endpoint must be self-hosted to collect events.</li>
          <li>AI product research or automatic campaign optimization. Amazon’s current policy places a written-approval condition on using Special Links or Program Content to develop machine-learning models; see ${sourceAmazonPolicies}.</li>
        </ul>
      </section>
      <section class="content-section"><h2>Source checks completed</h2>
        <p>Official references were opened on 20 November 2026 for this implementation. Amazon’s Associates Operating Agreement showed the required Associate statement and says Special Links must use tagged formats provided under the program; current Program Policies cover Special Link requirements, product content, price/availability conditions, and the machine-learning restriction. The FTC’s disclosure guide was checked for clear, prominent placement. GitHub Pages and Google Search Console documentation were checked for deployment and measurement boundaries.</p>
        <ul class="source-list">
          <li><strong>Amazon Associates</strong><span>${sourceAgreement}<br>${sourceAmazonPolicies}<br>${sourceAsin}</span></li>
          <li><strong>Disclosure guidance</strong><span>${sourceFtc}</span></li>
          <li><strong>Search and indexing</strong><span>${sourceGsc}<br>${sourceSitemap}<br>${sourceRel}</span></li>
          <li><strong>Hosting</strong><span>${sourcePages}</span></li>
        </ul>
      </section>
      <p class="hero-actions"><a class="button" href="flagged-for-review.html">Review flagged items</a><a class="button secondary" href="requirements.html">Open the requirements register</a></p>
    `
  },
  {
    path: 'shop.html',
    type: 'page',
    section: 'Shop',
    title: 'The shortlist — DIY Home',
    description: 'Submitted product-link records held for official product identity and Special Link checks; no unverified links are activated.',
    published: '2026-11-20',
    summary: 'Four submitted link records, with the intended product fields and observed redirect destinations kept separate and unverified.',
    body: productsPageBody
  },
  {
    path: 'guides/index.html',
    canonicalPath: 'guides/',
    type: 'index',
    section: 'Guides',
    title: 'Kitchen buying guides — DIY Home',
    description: 'Question-led, no-hype frameworks for comparing kitchen appliances without pretending that unverified products have been tested.',
    published: '2026-11-20',
    summary: 'Four buyer-question frameworks for kitchen and small appliances; titles are editorial hypotheses rather than search-volume claims.',
    body: () => `
      <div class="page-heading"><p class="eyebrow">Buying guides · Kitchen & small appliances</p><h1>Good questions make better shopping lists.</h1>
        <p class="lede">These guides help organize what to compare before a product earns a recommendation. They are frameworks—not tests, reviews, rankings, or evidence that one format is better.</p></div>
      ${editorialGate}
      ${cardGrid('')}
      <section class="content-section"><h2>How the collection will grow</h2>
        <p>Each new guide is recorded in the publication manifest, from which the sitemap and RSS feed are generated. The next topic is not selected from an assumed trend: query data is still unavailable until the site’s Search Console property is verified.</p>
        <p>Official references: ${sourceGsc} for search-query measurement and ${sourceSitemap} for sitemap publication. Neither source is evidence that any of these working titles has search demand.</p>
      </section>
    `
  },
  {
    path: 'guides/air-fryer-comparison.html',
    type: 'guide',
    section: 'Kitchen notes',
    title: 'Basket or oven-style air fryer: what should you compare? — DIY Home',
    description: 'A format-neutral checklist for comparing documented fit, capacity, controls, cleaning, and care details before buying an air fryer.',
    published: '2026-11-20',
    summary: 'A format-neutral air-fryer checklist: compare official dimensions, stated capacity, functions, cleaning guidance, and the space you actually have.',
    body: () => `
      <article>
        <div class="page-heading"><p class="eyebrow">Kitchen notes · Guide 01</p><h1>Basket or oven-style air fryer: what should you compare?</h1>
          <p class="lede">A format label cannot tell you whether an appliance fits your routine. Compare the details a manufacturer documents, then check them against your own counter and cooking habits.</p>
          <div class="page-meta"><span>Published 20 November 2026</span><span>5-minute checklist</span><span>Framework, not a product test</span></div></div>
        ${editorialGate}
        <section class="content-section"><h2>Start with a normal weeknight</h2>
          <p>Write down what you expect to cook, how many portions you usually prepare, and where the appliance would live between uses. Treat those as your needs—not as performance claims about any model.</p>
          <ol class="topic-list">
            <li><strong>Will it fit where you plan to use it?</strong><span>Compare the official product dimensions with your counter depth, usable width, storage space, and any clearance instructions in the manufacturer’s manual.</span></li>
            <li><strong>What does “capacity” mean on this model?</strong><span>Record the maker’s stated capacity and compare the documented cooking area, tray or basket arrangement, and included accessories where the official listing or manual provides them.</span></li>
            <li><strong>Which functions will you actually use?</strong><span>List the modes and controls the manufacturer documents. Do not count a feature as useful just because it appears in a title or marketing phrase.</span></li>
            <li><strong>What does cleaning involve?</strong><span>Check the official care instructions for each removable part. Do not assume that a component is dishwasher-safe unless the manufacturer says so.</span></li>
            <li><strong>What needs to be checked before first use?</strong><span>Use the official manual for electrical requirements, operating clearances, handling, and safety instructions.</span></li>
          </ol>
        </section>
        <section class="content-section"><h2>Compare evidence, not adjectives</h2>
          <p>For each candidate, use the same source type and record the exact model and official listing or manual. If a detail is absent, leave it blank rather than filling it from a retailer snippet, review, or assumption.</p>
          <div class="callout-grid"><div class="callout"><h3>Keep separate</h3><p>Model identity, the official listing, and any observed link destination belong in distinct fields.</p></div><div class="callout"><h3>Leave blank</h3><p>No price, rating, cooking result, capacity value, or winner is published here because no candidate has been identified and checked.</p></div></div>
          <p>For future product links, the source register and Special Link gate follow ${sourceAmazonPolicies}. Amazon’s identifier overview is ${sourceAsin}.</p>
        </section>
        <section class="content-section"><h2>One-minute decision note</h2>
          <p>Before you compare models, finish this sentence: “I have room for ___, I usually cook ___, and the details I need the manual to confirm are ___.” If you cannot fill the blanks from your own kitchen and official documents, keep researching rather than choosing from a format label.</p>
          <p><a class="text-link" href="../shop.html">See the current product-intent register</a></p>
        </section>
      </article>
    `
  },
  {
    path: 'guides/air-fryer-capacity.html',
    type: 'guide',
    section: 'Kitchen notes',
    title: 'A no-hype checklist for comparing air fryer capacity — DIY Home',
    description: 'A practical checklist for reading manufacturer-stated capacity, dimensions, and layout without claiming one number predicts a result.',
    published: '2026-11-20',
    summary: 'Compare stated capacity with the physical layout and official dimensions; do not treat a single number as a complete fit test.',
    body: () => `
      <article>
        <div class="page-heading"><p class="eyebrow">Kitchen notes · Guide 02</p><h1>A no-hype checklist for comparing air fryer capacity</h1>
          <p class="lede">Capacity labels are only useful when you know what was measured and how the appliance is arranged. This checklist gives you a consistent way to read the official documentation.</p>
          <div class="page-meta"><span>Published 20 November 2026</span><span>4-minute checklist</span><span>No product values asserted</span></div></div>
        ${editorialGate}
        <section class="content-section"><h2>Five details to put side by side</h2>
          <ol class="topic-list">
            <li><strong>Exact model and variant.</strong><span>Record the manufacturer’s model identifier and the official listing or manual URL before comparing variants.</span></li>
            <li><strong>Stated capacity and its wording.</strong><span>Copy the amount exactly as the manufacturer states it, including the unit and whether it refers to volume, weight, or another measure. If the source does not say, leave the interpretation blank.</span></li>
            <li><strong>Usable cooking layout.</strong><span>Note the number and arrangement of baskets, trays, racks, and included dividers where official materials specify them.</span></li>
            <li><strong>Outside dimensions and clearance.</strong><span>Compare the manufacturer’s measurements with your own counter and storage measurements. Keep any manual clearance instruction separate from the unit’s footprint.</span></li>
            <li><strong>Your usual batch.</strong><span>Describe the food and portions you expect to prepare. A product’s stated capacity does not, by itself, guarantee that your preferred batch will fit or cook as you want.</span></li>
          </ol>
        </section>
        <section class="content-section"><h2>What this checklist does not claim</h2>
          <p>It does not rank capacity, predict cooking results, or say that a bigger number is better. We have no verified product identities or official model documents in the current register, so product-specific values remain blank.</p>
          <p>Amazon explains its product catalog identifier in ${sourceAsin}; its Associates rules on accurate product claims and permitted price/availability displays are in ${sourceAmazonPolicies}. These references do not verify the submitted links or any individual product specification.</p>
        </section>
        <section class="content-section"><h2>Make the comparison useful to you</h2>
          <p>Use the manufacturer’s words for the documented facts, then add your own kitchen measurements in a separate note. If the source uses an undefined capacity term, mark it “not specified” instead of converting it into a claim.</p>
          <p><a class="text-link" href="cleanup-counter-space.html">Next: cleanup and counter space</a></p>
        </section>
      </article>
    `
  },
  {
    path: 'guides/cleanup-counter-space.html',
    type: 'guide',
    section: 'Kitchen notes',
    title: 'How to assess cleanup and counter-space trade-offs — DIY Home',
    description: 'A grounded way to compare appliance footprint, storage, manufacturer care instructions, and the space you already have.',
    published: '2026-11-20',
    summary: 'Measure the place the appliance will use and store, and check cleaning instructions in the official manual before comparing models.',
    body: () => `
      <article>
        <div class="page-heading"><p class="eyebrow">Kitchen notes · Guide 03</p><h1>How to assess cleanup and counter-space trade-offs</h1>
          <p class="lede">The best comparison starts with your counter and the care instructions you can verify—not with a blanket claim about which appliance is easiest.</p>
          <div class="page-meta"><span>Published 20 November 2026</span><span>4-minute checklist</span><span>Framework, not a product test</span></div></div>
        ${editorialGate}
        <section class="content-section"><h2>Measure the whole routine</h2>
          <ol class="topic-list">
            <li><strong>Measure the landing spot.</strong><span>Record width, depth, height, nearby outlets, cabinet doors, and the space you need to reach the controls. Compare with the official external dimensions and any manual clearance instructions.</span></li>
            <li><strong>Decide where it goes after use.</strong><span>If it will be stored, measure that shelf or cabinet too. Include room for any accessories you expect to keep with it.</span></li>
            <li><strong>Read care instructions by component.</strong><span>Check the maker’s manual for the basket, tray, rack, pan, and exterior separately. Do not infer dishwasher compatibility, soaking rules, or cleaning products.</span></li>
            <li><strong>Include the handling steps.</strong><span>Note which parts need to cool, lift out, or be cleaned after your planned use, based only on the official instructions.</span></li>
            <li><strong>Keep your own preferences separate.</strong><span>“I prefer fewer parts to wash” is a personal preference. “This model has fewer removable parts” needs an official product source.</span></li>
          </ol>
        </section>
        <section class="content-section"><h2>Use two columns in your notes</h2>
          <div class="callout-grid"><div class="callout"><h3>Your kitchen</h3><p>Counter measurements, storage location, outlet access, and how you prefer to clean up.</p></div><div class="callout"><h3>Official documentation</h3><p>Exact model, external dimensions, clearance, included parts, and the manufacturer’s cleaning instructions.</p></div></div>
          <p>Do not collapse a personal fit judgment into an objective rating. No submitted product has an official listing or manual attached in the current register.</p>
        </section>
        <section class="content-section"><h2>Sources and the next step</h2>
          <p>When an item is identified, use its official product page and manufacturer documentation. The current Amazon product-identification overview is ${sourceAsin}; link and content rules are in ${sourceAmazonPolicies}. Those references define the verification workflow, not the specifications of an unconfirmed model.</p>
          <p><a class="text-link" href="multi-function-appliance.html">Next: questions for multi-function appliances</a></p>
        </section>
      </article>
    `
  },
  {
    path: 'guides/multi-function-appliance.html',
    type: 'guide',
    section: 'Kitchen notes',
    title: 'Questions to ask before buying a multi-function kitchen appliance — DIY Home',
    description: 'A source-first checklist for deciding which appliance functions matter, which are officially documented, and how to compare care and storage.',
    published: '2026-11-20',
    summary: 'Ask which functions you will use, then check documented controls, accessories, care guidance, and footprint in official materials.',
    body: () => `
      <article>
        <div class="page-heading"><p class="eyebrow">Kitchen notes · Guide 04</p><h1>Questions to ask before buying a multi-function kitchen appliance</h1>
          <p class="lede">A long feature list is not a reason to buy on its own. Start with the jobs you actually need done, then verify what the exact model documents.</p>
          <div class="page-meta"><span>Published 20 November 2026</span><span>5-minute checklist</span><span>No product recommendation</span></div></div>
        ${editorialGate}
        <section class="content-section"><h2>Ask these questions before comparing</h2>
          <ol class="topic-list">
            <li><strong>Which jobs do I need this appliance to do?</strong><span>List the functions you expect to use in an ordinary week. Treat “nice to have” modes as optional, not as evidence of value.</span></li>
            <li><strong>Does the official manual name each function?</strong><span>Check the exact model’s documented modes, controls, settings, and any stated limits. Do not infer a function from a broad product title.</span></li>
            <li><strong>What accessories come with this exact variant?</strong><span>Compare the included-parts list against the official listing or manual. Keep optional accessories separate from items included in the box.</span></li>
            <li><strong>How do I clean and store each part?</strong><span>Use the manufacturer’s care and storage instructions. Avoid unverified claims about dishwasher safety, replacement parts, or long-term durability.</span></li>
            <li><strong>Does the complete unit fit my kitchen?</strong><span>Compare official dimensions and documented clearance with your own measurements, including space to open, load, and remove accessories.</span></li>
            <li><strong>What would make me choose a simpler option?</strong><span>Write down the functions you would not use. A comparison is more useful when it includes trade-offs, not just feature counts.</span></li>
          </ol>
        </section>
        <section class="content-section"><h2>Keep product facts and personal fit distinct</h2>
          <p>“I would use the oven mode twice a month” is a personal-use note. “This model has an oven mode” must be checked against the exact product’s official materials. No submitted product has been identified or tested in this publication.</p>
          <p>See ${sourceAmazonPolicies} for Associates link and content requirements. The official product identifier background is in ${sourceAsin}.</p>
        </section>
        <section class="content-section"><h2>One last check</h2>
          <p>Before purchasing, make sure the model and variant in the official listing match the manual and the features you compared. If the product record is unresolved, keep it off the recommendation shelf.</p>
          <p><a class="text-link" href="../shop.html">Return to the product shortlist</a></p>
        </section>
      </article>
    `
  },
  {
    path: 'seasonal/winter-2026-27.html',
    type: 'page',
    section: 'Seasonal file',
    title: 'Winter 2026/27 seasonal file — DIY Home',
    description: 'A seasonal publication file grouping the winter kitchen guides, cluster links, publishing cadence, authorship note, RSS reader option, and Search Console setup surface.',
    published: '2026-11-20',
    summary: 'Winter 2026/27 file: the four kitchen guides grouped as a seasonal cluster, with cadence, authorship, RSS, and Search Console setup notes.',
    body: () => `
      <div class="page-heading"><p class="eyebrow">Seasonal file · Winter 2026/27</p><h1>Winter notes for a warmer kitchen.</h1>
        <p class="lede">This seasonal file gathers the opening kitchen guides into one place and explains how the publication will choose what comes next. It does not claim that winter demand, product performance, or search interest has been measured.</p>
        <div class="page-meta"><span>Published 20 November 2026</span><span>By DIY HOME Editorial Desk</span><span>Seasonal file, not a product ranking</span></div></div>
      <div class="note-box"><strong>Authorship and imagery.</strong> Articles are credited to the DIY HOME Editorial Desk because no individual byline was supplied. The front-page cover is an original editorial illustration and is not a depiction of any submitted product. Product images will only be used when the exact listing and permitted image source are verified.</div>
      <section class="content-section"><h2>Winter kitchen cluster</h2>
        <p>These four guides are the current seasonal cluster. They are question-led frameworks for comparing fit, capacity, cleanup, and multi-function features before any product is recommended.</p>
        ${cardGrid('../guides/')}
      </section>
      <section class="content-section"><h2>Publishing cadence</h2>
        <ol class="topic-list">
          <li><strong>Seasonal file each season.</strong><span>Group the current guides under a seasonal heading and update the file when the season changes or when an official source changes a verification rule.</span></li>
          <li><strong>New guides only from measured need.</strong><span>Do not choose the next topic from an assumed trend. Use verified Search Console queries and authorized first-party reports once those sources are connected.</span></li>
          <li><strong>Product pages only after the gate.</strong><span>A product earns a shop card only after its intended ASIN, official listing URL, confirmation date, source, and observed Special Link destination are recorded separately.</span></li>
          <li><strong>Every guide enters the sitemap and feed.</strong><span>The publication manifest generates the sitemap and RSS feed, so a new guide is discoverable without hand-editing separate index files.</span></li>
        </ol>
        <p>Official references for the discovery workflow: ${sourceSitemap} for sitemap publication, ${sourceGsc} for query measurement, and ${sourceRss} for the RSS format.</p>
      </section>
      <section class="content-section"><h2>Search Console setup surface</h2>
        <p>The site is ready to be submitted, but the property has not been verified or connected in this session. Use this checklist when the owner is ready:</p>
        <ol class="topic-list">
          <li><strong>Verify the property.</strong><span>Confirm ownership for the GitHub Pages URL in Search Console before reading any query data.</span></li>
          <li><strong>Submit the sitemap.</strong><span>Submit <code>sitemap.xml</code> from the canonical site root. Google treats a sitemap as a discovery hint, not a guarantee of indexing.</span></li>
          <li><strong>Check the front page and guides.</strong><span>Use URL inspection for the front page and each guide after submission, then wait for first-party data before changing topics.</span></li>
          <li><strong>Keep demand claims blank until data exists.</strong><span>No search volume, ranking, trend, or traffic value is shown on this site until Search Console reports it.</span></li>
        </ol>
      </section>
      <section class="content-section"><h2>Reader capture without a mailing list</h2>
        <p>Readers can follow new kitchen notes through the RSS feed. The site does not collect an email address or build a subscriber profile. The feed is generated from the same guide manifest as the sitemap.</p>
        <p><a class="button secondary" href="../feed.xml" type="application/rss+xml">Follow via RSS</a> <a class="text-link" href="../guides/">Browse all guides</a></p>
      </section>
      <section class="content-section"><h2>Operations cluster</h2>
        <p>The publication’s working surfaces are linked here so a reader can see how claims are checked, measured, and flagged.</p>
        <div class="callout-grid">
          <div class="callout"><h3>Evidence</h3><p><a class="text-link" href="../research.html">Research desk</a><br><a class="text-link" href="../requirements.html">Requirements register</a><br><a class="text-link" href="../methodology.html">Method & sources</a></p></div>
          <div class="callout"><h3>Measurement</h3><p><a class="text-link" href="../measurement.html">Measurement</a><br><a class="text-link" href="../campaign-ledger.html">Campaign ledger</a><br><a class="text-link" href="../flagged-for-review.html">Flagged for review</a></p></div>
        </div>
      </section>
    `
  },
  {
    path: 'research.html',
    type: 'page',
    section: 'Research desk',
    title: 'Research desk — DIY Home',
    description: 'A source-linked status table for product identity, pricing, reviews, commission data, search demand, and reported outcomes.',
    published: '2026-11-20',
    summary: 'A blank-first research table: every unconfirmed commercial value is left blank and linked to the official reference needed to verify it.',
    body: () => `
      <div class="page-heading"><p class="eyebrow">Research desk · Evidence before enthusiasm</p><h1>What we know, and what we do not.</h1>
        <p class="lede">This is the live research register for the current shortlist. A blank is more useful than a confident-looking number without a verified source.</p></div>
      <div class="warning-box"><strong>No product findings are confirmed.</strong> The supplied short links were not followed. No product identity, price, rating, commission rate, trend, competition result, or conversion value is inferred.</div>
      <section class="content-section"><h2>Evidence register</h2>
        <p>The right-hand references describe where a fact should be checked or what policy applies. They do not establish a value for any of the submitted products.</p>
        ${researchTable()}
        <p class="table-caption">Blank values are deliberate. Search Console and Associates report data are not connected; the current campaign ledger contains headers only.</p>
      </section>
      <section class="content-section"><h2>How the research gate works</h2>
        <ol class="topic-list">
          <li><strong>Identify the exact item.</strong><span>Match an intended ASIN to an official listing and preserve the source and confirmation date.</span></li>
          <li><strong>Verify the outbound Special Link.</strong><span>Use the enrolled Associates workflow and confirm a tracking report. Store any observed target separately from the intended listing.</span></li>
          <li><strong>Collect only permitted, current evidence.</strong><span>Do not publish dynamic price or availability data unless the applicable Amazon requirements are met. The current policy is linked in every relevant row.</span></li>
          <li><strong>Measure before optimizing.</strong><span>Use first-party Search Console queries and authorized Associates reports. Do not substitute estimates or model-generated numbers.</span></li>
        </ol>
      </section>
      <section class="content-section"><h2>Search visibility status</h2>
        <p>The canonical base, sitemap, and RSS feed are included in this build. Google says a sitemap is a hint, not a guarantee of crawling or indexing; Search Console ownership and submission are still pending. See ${sourceSitemap} and ${sourceGsc}.</p>
      </section>
    `
  },
  {
    path: 'requirements.html',
    type: 'page',
    section: 'Requirements',
    title: 'Requirements register — DIY Home',
    description: 'A line-item register of publication, verification, disclosure, SEO, measurement, and AI-policy requirements with status and official references.',
    published: '2026-11-20',
    summary: 'The full requirement register with implemented, gated, and unverified items tied to official Amazon, FTC, Google, and GitHub references.',
    body: () => `
      <div class="page-heading"><p class="eyebrow">Operations · Full requirement register</p><h1>Build, publish, and verify in the right order.</h1>
        <p class="lede">Every status below distinguishes code that exists from an external account, report, or product fact that could not be verified in this session.</p></div>
      <div class="note-box">The official reference column provides the relevant external standard or service documentation. It is not a substitute for the repository checks described in the evidence column.</div>
      ${requirementsTable()}
      <p class="table-caption">As checked on 20 November 2026. Amazon’s linked policy page showed an update date of 14 April 2026 when accessed; program terms can change, so re-check before publishing any Special Link.</p>
      <section class="content-section"><h2>Automation status</h2>
        <p>The site can generate static pages, a sitemap, RSS, and aggregate click counters when run behind the included Node server. Product discovery, Amazon API access, Commission reporting, and AI-based optimization are not connected. They remain gated rather than simulated.</p>
        <p>Amazon’s current ${sourceAmazonPolicies} say Special Links must use the Associates ID assigned to the participant and include proper tracking format. The same page contains a written-approval condition for using Special Links or Program Content to develop machine-learning models. Do not feed program content into an AI workflow until the applicable permission and API rules are confirmed.</p>
      </section>
    `
  },
  {
    path: 'measurement.html',
    type: 'page',
    section: 'Measurement',
    title: 'Measurement — DIY Home',
    description: 'A privacy-minimizing, same-origin event endpoint and clear status of click, search, and first-party report measurement.',
    published: '2026-11-20',
    summary: 'Five documented event types and a self-hosted aggregate endpoint; static GitHub Pages does not run the endpoint, and no events or conversion data are claimed there.',
    body: () => `
      <div class="page-heading"><p class="eyebrow">Measurement · No invented numbers</p><h1>Count what happened. Keep the rest out.</h1>
        <p class="lede">The analytics endpoint stores daily aggregate counts only. It does not create user IDs, cookies, or event-level visitor histories. On GitHub Pages the endpoint is not deployed, so collection is off until the site is self-hosted with the included Node server.</p></div>
      <div class="endpoint-status"><span class="endpoint-dot is-offline" data-endpoint-dot aria-hidden="true"></span><strong data-endpoint-status class="status-offline">Checking the same-origin analytics endpoint…</strong></div>
      <div class="metric-grid">
        <div class="metric-card"><p class="eyebrow">Page views</p><strong class="metric-value" data-event-count="page_view">—</strong><span class="metric-label">Aggregate total from the self-hosted endpoint, when connected.</span></div>
        <div class="metric-card"><p class="eyebrow">Product link clicks</p><strong class="metric-value" data-event-count="product_link_click">—</strong><span class="metric-label">No product links are active; there are no product-click claims.</span></div>
        <div class="metric-card"><p class="eyebrow">Reported orders</p><strong class="metric-value" data-event-count="reported_order">—</strong><span class="metric-label">Only an authorized first-party import can create this event.</span></div>
      </div>
      <p class="table-caption" data-analytics-updated hidden>Aggregate file last updated: <span data-analytics-updated-value data-value=""></span></p>
      <section class="content-section"><h2>Five defined events</h2>
        <ol class="topic-list">
          <li><strong>page_view</strong><span>One page-load count for the current route; no visitor or session identifier is created.</span></li>
          <li><strong>guide_view</strong><span>A page-load count for a question-guide route, so guide interest can be summarized by page.</span></li>
          <li><strong>outbound_click</strong><span>A click to an external reference; the app stores a short link key, not a URL, referrer, or query string.</span></li>
          <li><strong>product_link_click</strong><span>A click on a validated, explicitly marked product link. The event exists, but no product link is enabled until the verification gate passes.</span></li>
          <li><strong>reported_order</strong><span>Aggregate order counts imported from an authorized first-party Associates report. Browser requests are rejected for this event.</span></li>
        </ol>
      </section>
      <section class="content-section"><h2>What the application does not persist</h2>
        <ul><li>IP address, user agent, referrer, query string, cookie, or account identifier.</li><li>Raw browser event bodies or per-visitor records.</li><li>Conversion attribution, commission value, or revenue forecast.</li></ul>
        <p>Hosting infrastructure may process request metadata independently; this application-level minimization is not a complete privacy-law assessment. The endpoint’s daily aggregate file needs an operator-defined retention and backup policy before long-term use.</p>
      </section>
      <section class="content-section"><h2>Search queries are a separate first-party source</h2>
        <p>Google Search Console reports which queries bring users to a site, but this property has not been verified or connected. No Search Console queries are copied into the event endpoint. See ${sourceGsc} and the flagged review list.</p>
      </section>
    `
  },
  {
    path: 'campaign-ledger.html',
    type: 'page',
    section: 'Campaign ledger',
    title: 'Campaign ledger — DIY Home',
    description: 'An intentionally empty campaign ledger with fields for timestamp, source, channel, eligible sessions, clicks, reported orders, and provenance.',
    published: '2026-11-20',
    summary: 'No campaign values are populated. The ledger schema is ready for authorized, dated first-party reports.',
    body: () => `
      <div class="page-heading"><p class="eyebrow">Campaign ledger · Provenance first</p><h1>An empty ledger is an honest baseline.</h1>
        <p class="lede">There are no authorized report rows in this repository. The ledger will accept dated counts only when they come from an approved first-party report; no score or earnings forecast is calculated.</p></div>
      <div class="note-box"><strong>Current state:</strong> No timestamp, source, channel, eligible sessions, clicks, or orders have been reported. The data file contains headers only. An authorized server-side import is available when an operator has a report and the private ingest token.</div>
      <section class="content-section"><h2>Ledger fields</h2>
        <div class="table-scroll" role="region" aria-label="Campaign ledger data" tabindex="0">
          <table>
            <thead><tr><th scope="col">Report timestamp UTC</th><th scope="col">Source</th><th scope="col">Channel</th><th scope="col">Eligible sessions</th><th scope="col">Clicks</th><th scope="col">Reported orders</th><th scope="col">Source reference</th></tr></thead>
            <tbody data-live-ledger><tr><td colspan="7" class="cell-empty">No authorized report rows. No values inferred.</td></tr></tbody>
          </table>
        </div>
        <p class="table-caption">The application keeps a dated provenance row for each authorized report import and a daily aggregate for reported orders. It does not reconcile or attribute an order to a browser click.</p>
      </section>
      <section class="content-section"><h2>Import and provenance gate</h2>
        <p>The self-hosted endpoint accepts a report only when a private bearer token is configured. It records the report date, server receipt time, channel, safe source reference, and aggregate counts. Browser traffic cannot create reported-order events.</p>
        <p>Use only counts obtained from an authorized Associates report. Amazon’s current program rules are available in ${sourceAmazonPolicies}. The account, report, and values have not been accessed or verified here.</p>
      </section>
    `
  },
  {
    path: 'methodology.html',
    type: 'page',
    section: 'Method & sources',
    title: 'Method and sources — DIY Home',
    description: 'How product identity, editorial claims, affiliate disclosures, analytics, and source provenance are handled on DIY Home.',
    published: '2026-11-20',
    summary: 'Publication method: preserve submitted links, keep intent separate from observed redirects, use official sources, and hold unverified claims.',
    body: () => `
      <div class="page-heading"><p class="eyebrow">Method & sources · Editorial standards</p><h1>Show the source. Keep the unknown blank.</h1>
        <p class="lede">The site is designed to be useful before it is fully connected. Every external product fact has to pass an explicit source and link gate.</p></div>
      <section class="content-section"><h2>Product evidence</h2>
        <ol class="topic-list">
          <li><strong>Preserve the submission.</strong><span>Keep each supplied URL as its own record; a repeated URL is retained rather than silently merged.</span></li>
          <li><strong>Confirm intent from an official source.</strong><span>Store the intended ASIN, official listing URL, confirmation date, and source in separate fields. Amazon’s seller guide explains what an ASIN is; it does not identify any submitted link.</span></li>
          <li><strong>Observe destination separately.</strong><span>If a link is tested in the authorized Associates workflow, record the observed redirect target in its own field. Do not overwrite the intended product record with a redirect.</span></li>
          <li><strong>Publish only after a tracking check.</strong><span>Confirm one intended Special Link per product in the enrolled account and check the appropriate report before activating additional links.</span></li>
        </ol>
        <p>Relevant official references: ${sourceAsin}, ${sourceAmazonPolicies}, and ${sourceAgreement}. Product source fields remain blank until evidence exists.</p>
      </section>
      <section class="content-section"><h2>Claims, prices, and commissions</h2>
        <p>Product title, feature, performance, price, availability, rating, review count, commission, sales, and earnings are not filled from an inference. Amazon’s policy prohibits inaccurate or misleading product claims and sets conditions for showing dynamic price and availability information. No corresponding values are present in the current source register.</p>
      </section>
      <section class="content-section"><h2>AI and automation boundaries</h2>
        <p>This repository does not run an AI research agent, scrape Amazon, call Creators API or PA API, or optimize campaigns. Amazon’s current ${sourceAmazonPolicies} include a condition requiring express prior written approval for use of Special Links or Program Content to develop machine-learning models or related technology. Treat that as a hard gate before connecting any model to Associates content.</p>
        <p>Safe automation in this build is limited to static page generation, sitemap/RSS generation, source/status checks, and privacy-minimized aggregate counting when self-hosted.</p>
      </section>
      <section class="content-section"><h2>Disclosure and search</h2>
        <p>Each page keeps the affiliate disclosure directly under the masthead and repeats it in the footer. The site includes Amazon’s required statement for participating sites and makes clear that the supplied tracking ID and enrollment are not independently verified. FTC guidance reviewed for placement and clarity: ${sourceFtc}.</p>
        <p>Page canonicals, the sitemap, and RSS feed are generated from one manifest. Google describes a sitemap as a discovery hint, not a guarantee of indexing; Search Console query measurement requires a verified property. See ${sourceSitemap} and ${sourceGsc}.</p>
      </section>
      <section class="content-section"><h2>Sources reviewed</h2>
        <ul class="source-list">
          <li><strong>Amazon — agreement & policies</strong><span>${sourceAgreement}<br>${sourceAmazonPolicies}</span></li>
          <li><strong>Amazon — ASIN explainer</strong><span>${sourceAsin}</span></li>
          <li><strong>Federal Trade Commission</strong><span>${sourceFtc}</span></li>
          <li><strong>Google Search</strong><span>${sourceSitemap}<br>${sourceRel}<br>${sourceGsc}</span></li>
          <li><strong>GitHub Pages</strong><span>${sourcePages}</span></li>
        </ul>
      </section>
    `
  },
  {
    path: 'flagged-for-review.html',
    type: 'page',
    section: 'Flagged for review',
    title: 'Flagged for review — DIY Home',
    description: 'Unverified product links, missing account and Search Console access, analytics deployment limits, and source-register gaps.',
    published: '2026-11-20',
    summary: 'Published review queue for unknown product identities, link compliance, account status, Search Console data, analytics hosting, and the brief’s unmapped source IDs.',
    body: () => `
      <div class="page-heading"><p class="eyebrow">Flagged for review · Published, non-blocking</p><h1>Open questions, clearly labeled.</h1>
        <p class="lede">These items remain visible so the publication does not turn missing evidence into confident copy. They do not block the static site from publishing.</p></div>
      <div class="warning-box"><strong>Important distinction:</strong> the supplied <code>link.amazon</code> URLs have not been tested. Their exact compliance status is unresolved. This page does not call them invalid, nor does it claim they are valid Special Links.</div>
      ${flaggedTable()}
      <section class="content-section"><h2>Manual-review references</h2>
        <p>These official sources support the rules and measurement workflow referenced above. They are not product evidence for the unverified submissions.</p>
        <ul class="source-list">
          <li><strong>Amazon Associates agreement</strong><span>${sourceAgreement}</span></li>
          <li><strong>Amazon program policies</strong><span>${sourceAmazonPolicies}</span></li>
          <li><strong>Amazon ASIN overview</strong><span>${sourceAsin}</span></li>
          <li><strong>FTC disclosure guidance</strong><span>${sourceFtc}</span></li>
          <li><strong>Google Search Console</strong><span>${sourceGsc}</span></li>
          <li><strong>GitHub Pages workflow</strong><span>${sourcePages}</span></li>
        </ul>
      </section>
    `
  }
];

export { BASE_URL };
