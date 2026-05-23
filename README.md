# New Mexico Socialists – Website Portal

A modern, high-performance, bilingual (English/Spanish) web application and revolutionary portal for the **New Mexico Socialists** organization. This portal is built on a clean, robust **Cloudflare Pages Serverless Architecture** that connects directly to serverless functions, Airtable, and Brevo (Sendinblue) email services.

## Features

- ✊ **Join the Movement**: Bilingual, validated signup form connected to regional coordinator databases.
- 💳 **Pledge Contribution System**: Secure, serverless proxy to pledge Venmo, Cash App, PayPal, or check contributions, triggering direct email coordination and Airtable database synchronization.
- 🎨 **Activist Canvas Studio**: Interactive bilingual activist poster generator that allows custom image uploads, slogan customization, typography layout options, and download capabilities.
- 🗺️ **Living Struggle Storymap**: Interactive spatial SVG mapping of historical and contemporary struggles across New Mexico with local custom coordinate plotting.
- 📰 **Regional News Feed**: High-performance regional media aggregator showcasing socialist literature and labor updates.
- 🧠 **NUMARA Meta Brain**: Administrative sandbox knowledge lattice displaying operational nodes and git verification.

---

## Technical Stack & Architecture

- **Front-end**: Semantic HTML5, Vanilla CSS3, custom typography (Space Grotesk, Syne, Outfit, DM Mono), and modular ES6 JavaScript.
- **Serverless API**: Cloudflare Pages Functions (Edge-running V8 serverless environments under the `/functions` directory).
- **External Databases & API integrations**:
  - **Airtable**: Secure Private Access Token integration to register contribution pledges.
  - **Brevo API**: Dynamic SMTP transaction service to trigger coordinator alerts and bilingual comrade thank-you auto-replies.
  - **Discord/Slack Webhooks**: Optional real-time notification alerts for coordinate workflows.
  - **Cloudflare D1**: Optional serverless SQL layer bound directly to local/live state.

---

## Local Development & Sandbox Testing

This project uses the official **Cloudflare Wrangler CLI** to simulate serverless Pages Functions locally.

### Prerequisites

Ensure you have **Node.js** (v18+) and `npm` installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Serverless Environment
Start the development server with local serverless API bindings:
```bash
npx wrangler pages dev .
```
This boots a high-fidelity local emulation of Cloudflare Pages on `http://localhost:8788/` with functions in `/functions` fully functional and interactive!

### 3. Configure Local Secret Bindings
To test Airtable and Brevo services locally without committing credentials:
1. Create a `wrangler.toml` or define environment variables locally:
   ```bash
   npx wrangler pages dev . --binding AIRTABLE_PAT="your_token" --binding AIRTABLE_BASE_ID="your_base" --binding BREVO_API_KEY="your_key"
   ```

---

## Environment Variables Configuration

When deploying this project to **Cloudflare Pages**, you must configure the following Environment Variables in the **Cloudflare Pages Dashboard** under **Settings -> Environment variables**:

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `AIRTABLE_PAT` | Airtable Personal Access Token (with schema.writes, data.records:write permissions) | `pat.xxxxxx...` |
| `AIRTABLE_BASE_ID` | Airtable Base ID housing active tables | `appXXXXXXXXX` |
| `AIRTABLE_PLEDGES_TABLE_NAME` | Name of the table storing contribution pledges | `Pledges` |
| `BREVO_API_KEY` | SMTP transaction API key from your Brevo account | `xkeysib-xxxxxx...` |
| `WEBHOOK_URL` | Optional Discord or Slack webhook URL for alerts | `https://discord.com/api/webhooks/...` |

---

## Directory Layout

```
/
├── assets/                     # Premium frontend styling and assets
│   ├── css/
│   │   └── styles.css          # Core CSS stylesheet
│   ├── js/
│   │   └── main.js             # Main frontend script (Canvas engine, API forms)
│   └── img/                    # Imagery assets and posters
├── functions/                  # Cloudflare Pages Serverless Functions (API Layer)
│   └── api/
│       ├── airtable.js         # Airtable dashboard connector
│       ├── generate-image.js   # Serverless AI image helper
│       ├── join.js             # Form handler for #join-form
│       └── pledge.js           # Form handler for #pledge-form
├── index.html                  # Homepage (Hero, About, Join, Donate, Teasers)
├── art-showcase.html           # Interactive Storymap, Poster Studio, and Gallery
├── biblioteca-landing.html     # Bilingual research publication landing page
├── biblioteca-lama-day.html    # Special edition biblioteca publication
├── ccgs_natgeo_paper.html      # People's Greenhouse research paper
├── comrade_portal.html         # Comrade Portal control center & local sandbox
├── meta-brain.html             # NUMARA Meta Brain knowledge lattice
├── nmnewsfeed.html             # Regional Leftist newsfeed aggregator
├── package.json                # Project dependencies and script declarations
└── README.md                   # This documentation
```

---

## Domain & Contact

- **Production URL**: [https://nmsocialists.org/](https://nmsocialists.org/)
- **Contact Coordinator**: [salvadorsena@senacolectivo.com](mailto:salvadorsena@senacolectivo.com)
- **Official Facebook**: [https://www.facebook.com/profile.php?id=61584102062292](https://www.facebook.com/profile.php?id=61584102062292)

---

## License

Content, graphic assets, and code created for New Mexico Socialists organizing work.
