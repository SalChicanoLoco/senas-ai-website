# 🛠️ Facebook Open Graph Cache & Scraper Debugger Guide

This guide details how Facebook's Open Graph crawler caches sharing assets, explains the "Drake Meme" stale cache issue, and provides instructions for forcing Facebook to scrape and display the fresh, updated brand graphics.

---

## 🔍 The Stale Cache Phenomenon

When a user pastes a URL on Facebook, the platform does not fetch the website's live assets in real-time for every share. Instead, Facebook's **Open Graph (OG) Scraper** crawls the page once, parses the `<meta property="og:image">` tag, downloads the graphic, and stores it in their globally distributed Edge CDN (Content Delivery Network).

* **The Issue:** Historically, previous development iterations used a placeholder graphic (informally known as the "Drake Meme"). Facebook cached this graphic against the root URL `http://nmsocialists.org/`. Even after replacing the image on the server, Facebook's crawler continued to pull the cached Drake image from its CDN database.
* **The Resolution:** 
  1. We applied versioned query cache-busters (`assets/img/meme_1.png?v=3`) in the `<meta>` tags of `index.html` and `art-showcase.html` to force Facebook to see it as a unique, uncached resource.
  2. We must instruct Facebook's scraper to flush its old index database.

---

## 🚀 How to Force-Flush the Facebook Cache

If Facebook shares are still showing stale images, follow these steps to instantly purge their CDN cache:

### Step 1: Open the Facebook Sharing Debugger
Navigate to the official Facebook Developer utility:
👉 **[Facebook Developers Sharing Debugger](https://developers.facebook.com/tools/debug/sharing/)**
*(Note: You will need to log in with any standard Facebook account.)*

### Step 2: Input the NM Socialists URL
1. Copy the target website URL (e.g., `http://nmsocialists.org/` or `https://nmsocialists.org/art-showcase.html`).
2. Paste it into the input field under the **Sharing Debugger** tab.
3. Click the **Debug** button.

### Step 3: Analyze the Scraping Report
Facebook will display the details of its last scrape, including:
* **Time Scraped:** The last date/time the URL was crawled.
* **Open Graph Properties:** The exact tags it parsed.
* **Link Preview:** A mock rendering showing what users see in their feeds.

### Step 4: Trigger a Direct Purge
If you see the old placeholder graphic in the preview:
1. Click the **Scrape Again** button located near the top of the report.
2. This sends an immediate command to Facebook's crawl bots to fetch a fresh copy of your page, bypass their CDN cache, and parse the newly updated `?v=3` Open Graph meta tag.
3. Verify that the preview updates to display the new, premium brand graphic!

---

## 🛠️ Code Maintenance & Best Practices

When publishing future updates to high-visibility pages or changing the default sharing preview artwork:

1. **Increment the Version Parameter:** Inside `index.html` and `art-showcase.html`, update the `?v=X` parameter inside the meta elements:
   ```html
   <meta property="og:image" content="https://nmsocialists.org/assets/img/meme_1.png?v=4">
   <meta name="twitter:image" content="https://nmsocialists.org/assets/img/meme_1.png?v=4">
   ```
2. **Always Debug Post-Deployment:** Every time the default image is updated, immediately run the URL through the Sharing Debugger and click **Scrape Again** so the first user who shares the site gets the updated preview perfectly.
