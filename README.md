
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

This website is ready for deployment on IONOS hosting with PHP and MySQL support.

**See [IONOS-DEPLOYMENT.md](IONOS-DEPLOYMENT.md) for complete deployment instructions.**

Quick overview:
1. Create MySQL database in IONOS control panel
2. Import `database-schema.sql` via phpMyAdmin
3. Update database credentials in `submit-form.php`
4. Upload files via FTP to web root
5. Test form submission and verify database storage

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
├── index.html              # Main website page
├── submit-form.php         # Form submission handler (update credentials before upload)
├── database-schema.sql     # MySQL table structure (import via phpMyAdmin)
├── IONOS-DEPLOYMENT.md     # Deployment guide
├── README.md               # This file
└── assets/
    ├── css/
    │   └── styles.css      # Site styling
    ├── js/
    │   └── main.js         # JavaScript (form handling, gallery, Facebook share)
    └── img/
        ├── meme_1.png      # 19 meme images
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

