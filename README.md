
# New Mexico Socialists – Website

A bilingual (English/Spanish) website for New Mexico Socialists, featuring:

- **Join form** with PHP backend and MySQL database
- **19 memes and posters** for download and sharing
- **Interactive gallery** with view, download, and Facebook share options
- **Facebook page integration**
- **Resource links** for socialist education and organizing

## Technology Stack

- HTML5/CSS3/JavaScript (vanilla)
- PHP backend for form processing
- MySQL database for form submissions
- IONOS hosting

## Deployment

This site uses **automated deployment** via GitHub Actions to IONOS hosting.

### Quick Start

1. Push to `netlify-working-backup` branch
2. GitHub Actions automatically deploys to IONOS
3. Site updates at https://newmexicosocialists.org

### Manual Deployment

Go to: **Actions** → **Deploy NM Socialists to IONOS** → **Run workflow**

### Setup (One-Time)

See **[IONOS-API-DEPLOYMENT.md](IONOS-API-DEPLOYMENT.md)** for complete setup instructions including:
- How to configure GitHub Secrets
- Database setup on IONOS
- FTP/SFTP credentials
- Local development environment

### Local Development

1. Copy `.env.example` to `.env`
2. Update with your local database credentials
3. Never commit `.env` file (it's in `.gitignore`)
4. Run: `php -S localhost:8000`

### Legacy Manual Deployment

For manual deployment without GitHub Actions, see [IONOS-DEPLOYMENT.md](IONOS-DEPLOYMENT.md).

## Form Features

The join form collects:
- Name (required)
- Email (required)
- City (optional)
- Preferred language: English, Español, or Both
- Interests/how to participate (optional)

Submissions are:
- Stored in MySQL database with timestamp and IP address
- Sent via email to xava@newmexicosocialists.org
- Validated for security (SQL injection prevention, XSS protection)

## File Structure

```
/
├── .github/
│   └── workflows/
│       └── deploy-ionos.yml    # GitHub Actions deployment workflow
├── scripts/
│   ├── .htaccess.template      # Template for Apache environment variables
│   └── deploy-check.sh         # Post-deployment verification script
├── index.html                  # Main website page
├── submit-form.php             # Form submission handler (uses environment variables)
├── database-schema.sql         # MySQL table structure (import via phpMyAdmin)
├── .env.example                # Template for local development
├── .gitignore                  # Prevents committing secrets
├── IONOS-API-DEPLOYMENT.md     # Automated deployment guide
├── IONOS-DEPLOYMENT.md         # Legacy manual deployment guide
├── README.md                   # This file
└── assets/
    ├── css/
    │   └── styles.css          # Site styling
    ├── js/
    │   └── main.js             # JavaScript (form handling, gallery, Facebook share)
    └── img/
        ├── meme_1.png          # 19 meme images
        ├── meme_2.png
        └── ...
        └── meme_19.png
```

## Domain & Contact

- Website: https://newmexicosocialists.com
- Email: xava@newmexicosocialists.org
- Facebook: https://www.facebook.com/profile.php?id=61584102062292

## License

Content and code created for New Mexico Socialists organizing work.


# Automated IONOS Deployment - Live!
