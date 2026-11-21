"""Executive summary page for the DIY Home Upgrades publication.

Kept in its own module because it is the longest single page in the builder and
because it changes on every verification pass while the layout does not. It only
re-states values that already exist in the verified records; it never introduces
a price, rating, review count, click, order, revenue or forecast.
"""


def register_summary(add, table, link, source, intro, date, observed):
    shop_line = (
        'Three products across three Amazon categories are published as a scannable shop: '
        f'{source("shop.html", "the shop index")}, one page per category, and one table row per product. '
        'Every figure in a row comes from the verified record in <code>data/products.json</code>; '
        'a field that could not be confirmed is printed as unverified instead of being filled in.'
    )

    evidence = table(['Question', 'What the evidence supports', 'Source'], [
        ('How many products are there?',
         'Four submissions, three distinct short URLs (one submission repeats another). '
         'Three observed Amazon listings.',
         '<code>product-register.json</code>'),
        ('What are the products?',
         'A wallpaper smoothing tool kit, an under-cabinet paper towel holder and an '
         '8-tier pots and pans organizer.',
         'S07 · S08 · S09'),
        ('Where are they listed?',
         'Amazon.com (US): browse nodes 164701011 Wallpaper Tools, 3744201 Paper Towel '
         'Holders and 289824 Pot Racks, as shown in each page breadcrumb.',
         'S07 · S08 · S09'),
        ('Can we show prices or star ratings?',
         'No. The Program Policies permit both only through Creators API or Product '
         'Advertising API content, or an Amazon-served link. This site has neither.',
         'S02'),
        ('Are the supplied short links compliant?',
         'Unresolved, and not claimed invalid. Each resolves to a live listing, but no '
         'tracking tag was observed and no authorised Associates report was available.',
         'S01 · S02 · S10 · S11 · S12'),
        ('What is <code>shopnow047c-20</code>?',
         'The tracking ID the owner selected. No click, order or commission is attributed '
         'to it anywhere on this site.',
         'S01'),
    ])

    limits = table(['Area', 'State at publication', 'Why it is blank'], [
        ('Campaign ledger', 'Headers only, zero rows',
         'No authorised first-party report has been supplied. An empty ledger is not zero orders.'),
        ('Analytics endpoint', 'Collector written, not deployed',
         'GitHub Pages serves static files only. No consent-gated beacon is sent until a service URL exists.'),
        ('Search Console', 'Not verified', 'No DNS or HTML-token verification was performed in this build.'),
        ('Reader email capture', 'Not collecting', 'RSS is offered instead, so no addresses are stored.'),
        ('Prices, ratings, reviews', 'Deliberately absent',
         'S02 permits them only through API-served content or an Amazon-served link.'),
        ('Intended ASIN per product', 'Unverified',
         'It must be confirmed inside the enrolled Associates workflow, not inferred from a redirect target.'),
    ])

    verified = table(['Check', 'Result against an official source', 'Source'], [
        ('Affiliate disclosure wording',
         'Verified. The required statement is used verbatim, above the fold and again in the footer on every page.',
         'S01 \u00b7 Operating Agreement \u00a75'),
        ('ASIN definition (10 alphanumeric characters)',
         'Verified. The three supplied short codes are 9 characters, so none of them can itself be an ASIN.',
         'S06 \u00b7 ASIN guide'),
        ('Price display',
         'Not permitted without API-served content or an Amazon-served link. No price is published.',
         'S02 \u00b7 Program Policies'),
        ('Star ratings and review counts',
         'Not permitted without API-served content. No rating or review count is published.',
         'S02 \u00b7 Program Policies'),
        ('Account rate card',
         'Unverified. It sits behind Associates sign-in, so no per-product rate, earning or forecast is published.',
         'S03 \u00b7 restricted'),
        ('Public category rates',
         'Readable (Kitchen 4.50%, Home / Tools 3.00%, All Other 4.00%), but they do not establish which '
         'category these three ASINs are paid under, so no per-product rate is derived from them.',
         'S13 \u00b7 rate table'),
        ('Tracking attribution for <code>shopnow047c-20</code>',
         'Unverified. No tracking parameter was observed on any resolved destination.',
         'Flagged for Review'),
        ('Untagged Amazon product links (all pages)',
         'Flagged, not hidden. No product link on this site carries a tag, because validating one requires the '
         'enrolled account. Every one is marked sponsored with no query string; the shop says so in its own '
         'introduction. That is in tension with the tag-in-every-link rule. See F12.',
         'S02 \u00b7 Program Policies, \u00a72(b)'),
    ])

    decisions = table(['Priority', 'Action', 'Who', 'Gate that holds until it is done'], [
        ('1', 'Confirm the intended ASIN for each product inside the enrolled Associates '
              'workflow and record the confirmation date and source.', 'Account holder',
         'Intended fields stay blank.'),
        ('2', 'Generate one validated Special Link per product, test the destination and the '
              'tracking report, then scale.', 'Account holder', 'One link proven before the rest.'),
        ('3', 'Verify Search Console ownership and submit the sitemap.', 'Account holder',
         'The sitemap already lists all 17 URLs.'),
        ('4', 'Deploy the optional collector on a host that can run it, or record a deliberate '
              'decision to stay unmeasured.', 'Operator', 'No metrics are published until then.'),
        ('5', 'Add ledger rows only from authorised reports, each with a dated provenance trail.',
         'Operator', 'Empty beats invented.'),
    ])

    body = (
        intro('Site records', 'Executive summary',
              'A buyer-first publication: a shop, four question-shaped guides, and the evidence '
              'register kept beside them.')
        + '<div class="prose"><h2>What this site is</h2>'
        + f'<p>{shop_line} The four published guides answer one buyer question each. Every Amazon product link on '
          'the site is untagged and marked sponsored, with no query string; browse-node identifiers are printed as '
          'text rather than linked. A tag cannot be added honestly until a Special Link is validated inside the '
          'enrolled account, so all of these are preview links rather than paid Special Links. That is in tension '
          'with the tag-in-every-link rule and is published as F12 rather than hidden.</p>'
        + '<h2>Findings, line by line</h2><p>Each row below states only what an official source '
          'establishes. Listings were first checked on ' + observed + ' and re-checked on ' + date + '. Everything else is listed in the limits table and on '
        + f'{link("review", "Flagged for Review")}.</p></div>'
        + evidence
        + '<div class="prose"><h2>What is deliberately not here</h2><p>The brief asked for '
          'automated product research, trend detection, commission forecasting and campaign '
          'optimisation. None of it is running, and none of it is simulated: a forecast without '
          'authorised reports would be an invention. What exists is the structure those systems '
          'would fill, with every empty field left visible.</p></div>'
        + limits
        + '<div class="prose"><h2>Checked against the source, line by line</h2><p>These are the compliance'
          ' questions a reader or a reviewer is most likely to ask, and the document each answer rests on.</p></div>'
        + verified
        + '<div class="prose"><h2>Next decisions, in order</h2><p>These five items are what '
          'would move the site from a verified empty ledger to a measured one.</p></div>'
        + decisions
        + '<div class="prose"><h2>Evidence base</h2><p>Twelve documents, each with the date it '
          'states and the constraint it imposes, are kept in the '
        + f'{link("sources", "citation register")}. The listing checks are restated in the '
        + f'{link("audit/index", "spec and policy audit")}. Measurement status is on '
        + f'{link("measurement", "measurement")}, and the self-hosted collector is described on '
        + f'the {link("measurement/index", "campaign desk")}.</p><p><small>Compiled {date} by the '
          'DIY Home Upgrades editorial desk. No price, star rating, review count, conversion '
          'rate, revenue or forecast appears anywhere on this site.</small></p></div>'
    )
    add('summary', 'Executive summary',
        'Launch scope, verified findings, open decisions and known limits.', body)
