# IONOS Deployment Guide - New Mexico Socialists

This guide walks you through deploying the New Mexico Socialists website on IONOS hosting with PHP and MySQL support.

## Prerequisites

- IONOS hosting account with PHP and MySQL support
- FTP client (FileZilla recommended)
- Access to IONOS control panel

## Step 1: Database Setup

### 1.1 Create MySQL Database

1. Log in to your IONOS control panel
2. Navigate to **Databases** → **MySQL Databases**
3. Click **Create New Database**
4. Note down these credentials (you'll need them later):
   - Database name
   - Database username
   - Database password
   - Database host (usually `localhost`)

### 1.2 Import Database Schema

1. In IONOS control panel, find your database
2. Click **phpMyAdmin** to open the database management tool
3. Select your database from the left sidebar
4. Click the **Import** tab at the top
5. Click **Choose File** and select `database-schema.sql` from this repository
6. Scroll down and click **Go** to import
7. Verify the `form_submissions` table was created under the **Structure** tab

## Step 2: Configure PHP File

### 2.1 Update Database Credentials

1. Open `submit-form.php` in a text editor
2. Find these lines near the top:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name'); // Update with your IONOS database name
define('DB_USER', 'your_database_user'); // Update with your IONOS database user
define('DB_PASS', 'your_database_pass'); // Update with your IONOS database password
```

3. Replace the placeholder values with your actual database credentials from Step 1.1:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'dbs12345678');        // Your actual database name
define('DB_USER', 'dbu67890');           // Your actual database user
define('DB_PASS', 'YourSecurePassword'); // Your actual database password
```

4. Save the file

**IMPORTANT:** Never commit the file with real credentials to a public repository!

## Step 3: Upload Files via FTP

### 3.1 Connect via FTP

1. Open your FTP client (e.g., FileZilla)
2. Get FTP credentials from IONOS control panel:
   - Navigate to **Hosting** → **FTP Access**
   - Note the FTP server address, username, and password
3. Connect to your IONOS FTP server

### 3.2 Upload Website Files

Upload these files to your web root directory (usually `/` or `/httpdocs/`):

**Required files:**
- `index.html`
- `submit-form.php` (with updated credentials)
- `assets/` folder (entire directory with all contents)
  - `assets/css/styles.css`
  - `assets/js/main.js`
  - `assets/img/` (all 19 meme images: meme_1.png through meme_19.png)

**Do NOT upload:**
- `database-schema.sql` (already imported to database)
- `IONOS-DEPLOYMENT.md` (this file - reference only)
- `README.md` (optional)
- `.git/` folder
- `.gitignore`
- `index.html.backup` (if present)

### 3.3 Set File Permissions

After uploading, verify file permissions via FTP:

1. Right-click `submit-form.php`
2. Select **File Permissions** or **Properties**
3. Set permissions to **644** (read/write for owner, read for others)
4. Verify `index.html` is also set to **644**

## Step 4: Test the Website

### 4.1 Basic Functionality Test

1. Open your website in a browser: `https://yourdomain.com`
2. Verify the page loads correctly
3. Check that all 19 memes are visible in the gallery
4. Test Facebook share buttons
5. Test meme view/download/share buttons

### 4.2 Form Submission Test

1. Navigate to the **Join / Únete** section
2. Fill out the form with test data:
   - Name: Test User
   - Email: your-test-email@example.com
   - City: Albuquerque
   - Language: Both / Ambos
   - Interests: Testing form
3. Click **Submit / Enviar**
4. You should see: "Thanks for signing up! ¡Gracias por unirte!" in green
5. Check your email (NewMexicoSocialists@proton.me) for notification

### 4.3 Verify Database Storage

1. Log in to IONOS control panel
2. Open **phpMyAdmin**
3. Select your database
4. Click on `form_submissions` table
5. Click **Browse** tab
6. Verify your test submission is stored with:
   - Name
   - Email
   - City
   - Language
   - Interests
   - Timestamp
   - IP address

## Step 5: Managing Form Submissions

### View Submissions

1. Log in to phpMyAdmin
2. Select your database
3. Click `form_submissions` table
4. Click **Browse** to view all submissions
5. Use **Search** tab to filter by email, date, etc.

### Export Submissions

1. In phpMyAdmin, select `form_submissions` table
2. Click **Export** tab
3. Choose format (CSV for spreadsheets, SQL for backup)
4. Click **Go** to download

### Delete Old Submissions

1. Click `form_submissions` table
2. Click **Browse**
3. Select checkboxes for entries to delete
4. Scroll down and select **Delete** from dropdown
5. Click **Go** and confirm

## Troubleshooting

### Form Submission Fails

**Symptom:** Error message appears when submitting form

**Solutions:**
1. Check database credentials in `submit-form.php` are correct
2. Verify database table was created successfully in phpMyAdmin
3. Check PHP error logs in IONOS control panel
4. Ensure `submit-form.php` has correct permissions (644)
5. Test database connection:
   - Add `echo "Testing";` at the top of `submit-form.php`
   - Visit `https://yourdomain.com/submit-form.php` directly
   - If you see "Testing", PHP is working

### No Email Notifications

**Symptom:** Form saves to database but no email received

**Solutions:**
1. Check spam/junk folder
2. Verify `ADMIN_EMAIL` is set correctly in `submit-form.php`
3. Some hosts require additional email configuration
4. Contact IONOS support to enable PHP `mail()` function
5. Consider using a transactional email service (SendGrid, Mailgun) for reliable delivery

### Database Connection Error

**Symptom:** "Database connection failed" message

**Solutions:**
1. Verify database credentials are correct in `submit-form.php`
2. Check database exists in phpMyAdmin
3. Ensure database user has proper permissions
4. Confirm database host is `localhost` (or as provided by IONOS)

### 500 Internal Server Error

**Symptom:** White page or 500 error

**Solutions:**
1. Check PHP error logs in IONOS control panel
2. Verify PHP syntax in `submit-form.php` (no typos)
3. Ensure PHP version is 7.0+ in IONOS settings
4. Check file permissions (should be 644)

### Memes Not Loading

**Symptom:** Broken image icons or missing memes

**Solutions:**
1. Verify `assets/img/` folder was uploaded completely
2. Check all 19 meme files are present (meme_1.png through meme_19.png)
3. Verify file names match exactly (case-sensitive)
4. Check file permissions on images (644)

### CSS/JavaScript Not Working

**Symptom:** Website looks broken or form doesn't work

**Solutions:**
1. Verify `assets/css/` and `assets/js/` folders were uploaded
2. Check file permissions on CSS and JS files (644)
3. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
4. Check browser console for errors (F12 → Console tab)

## Security Best Practices

1. **Never commit database credentials to Git**
   - Keep `submit-form.php` with real credentials only on server
   - Use placeholders in repository version

2. **Regular backups**
   - Export database monthly via phpMyAdmin
   - Keep backup of all website files

3. **Monitor submissions**
   - Check phpMyAdmin weekly for spam submissions
   - Delete test submissions after verification

4. **Keep PHP updated**
   - Use latest PHP version available on IONOS
   - Check IONOS control panel for updates

## Support

If you encounter issues not covered in this guide:

1. Check IONOS support documentation
2. Contact IONOS technical support
3. Review PHP error logs in IONOS control panel
4. Email technical questions to: NewMexicoSocialists@proton.me

## Post-Deployment Checklist

- [ ] Database created and schema imported
- [ ] Database credentials updated in `submit-form.php`
- [ ] All files uploaded via FTP
- [ ] File permissions set correctly (644)
- [ ] Website loads at your domain
- [ ] All 19 memes display correctly
- [ ] Form submission works
- [ ] Test submission appears in database
- [ ] Email notification received
- [ ] Facebook share buttons work
- [ ] Meme gallery (view/download/share) works
- [ ] Test submission deleted from database

---

**Congratulations!** Your New Mexico Socialists website is now live on IONOS hosting! 🌹✊
