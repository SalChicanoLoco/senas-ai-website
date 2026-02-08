# Deployment Guide for Senas AI Website on IONOS

This guide will walk you through deploying the Senas AI website on IONOS hosting step by step. No technical expertise required!

## Prerequisites

Before you begin, make sure you have:
- An active IONOS hosting account with:
  - Web hosting package (supports PHP and MySQL)
  - Access to your IONOS control panel
  - FTP credentials
- The website files from this repository

## Step 1: Access Your IONOS Control Panel

1. Go to [https://www.ionos.com/](https://www.ionos.com/)
2. Click "Login" in the top right corner
3. Enter your IONOS login credentials
4. Navigate to your hosting dashboard

## Step 2: Set Up MySQL Database

### 2.1 Create a New Database

1. In your IONOS control panel, find and click on **"Databases"** or **"MySQL Databases"**
2. Click **"Create New Database"** or **"Add Database"**
3. Fill in the database details:
   - **Database Name**: Choose a name (e.g., `senas_ai_db`)
   - **Database User**: Create a username (e.g., `senas_user`)
   - **Password**: Create a strong password (save this securely!)
4. Click **"Create"** or **"Save"**

### 2.2 Note Your Database Credentials

Write down these important details (you'll need them later):
```
Database Host: localhost (usually this is the default)
Database Name: [your database name]
Database Username: [your database username]
Database Password: [your database password]
```

### 2.3 Import Database Schema

1. In the IONOS control panel, find **"phpMyAdmin"** under the Databases section
2. Click on **phpMyAdmin** to open it in a new tab
3. Log in using your database credentials
4. Select your database from the left sidebar
5. Click the **"Import"** tab at the top
6. Click **"Choose File"** and select the `database-schema.sql` file from your website files
7. Scroll down and click **"Go"** or **"Import"**
8. You should see a success message confirming the table was created

**✅ Checkpoint**: You should now have a `leads` table in your database

## Step 3: Configure the PHP Form Handler

### 3.1 Update Database Credentials

1. Open the `submit-form.php` file in a text editor (Notepad, TextEdit, or any code editor)
2. Find these lines near the top of the file (around line 19-22):
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_database_user');
   define('DB_PASS', 'your_database_pass');
   ```
3. Replace the values with your actual database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'senas_ai_db');          // Your database name
   define('DB_USER', 'senas_user');           // Your database username
   define('DB_PASS', 'YourActualPassword');   // Your database password
   ```
4. **Save the file**

### 3.2 Verify Email Configuration

1. In the same `submit-form.php` file, find these lines (around line 25-27):
   ```php
   define('ADMIN_EMAIL', 'salvador.sena@quetzalcoro.com');
   define('FROM_EMAIL', 'noreply@' . $_SERVER['HTTP_HOST']);
   define('FROM_NAME', 'Senas AI Website');
   ```
2. The email is already set to `salvador.sena@quetzalcoro.com` - no changes needed unless you want to use a different email address
3. **Save the file** if you made any changes

## Step 4: Upload Website Files to IONOS

### 4.1 Connect via FTP

You can use an FTP client like **FileZilla** (free) or the IONOS File Manager:

**Option A: Using FileZilla (Recommended)**
1. Download and install [FileZilla](https://filezilla-project.org/) if you don't have it
2. Get your FTP credentials from IONOS control panel (under "FTP Access" or "Web Hosting")
3. Open FileZilla and connect using:
   - **Host**: Your FTP host (usually something like `ftp.yourdomain.com`)
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: 21
4. Click "Quickconnect"

**Option B: Using IONOS File Manager**
1. In IONOS control panel, find **"File Manager"** or **"WebSpace Explorer"**
2. Click to open the online file manager

### 4.2 Upload the Files

1. Navigate to your website's root directory (usually `/public_html/` or `/htdocs/`)
2. Upload these files from your computer to the server:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `submit-form.php` (the one you just edited with database credentials)
   - `package.json`
   
**Important**: Do NOT upload:
   - `database-schema.sql` (already imported)
   - `DEPLOYMENT-GUIDE.md` (this file)
   - `README.md` (optional, but not needed on live site)
   - `.git` folder
   - `.gitignore` file

3. Make sure all files are in the root directory (not in a subdirectory)

**✅ Checkpoint**: Your file structure on the server should look like:
```
/public_html/
  ├── index.html
  ├── styles.css
  ├── script.js
  ├── submit-form.php
  └── package.json
```

## Step 5: Set File Permissions (Important for Security)

### 5.1 Set PHP File Permissions

1. In your FTP client or File Manager, right-click on `submit-form.php`
2. Select **"File Permissions"** or **"Properties"**
3. Set permissions to **644** or check:
   - Owner: Read, Write
   - Group: Read
   - Public: Read
4. Click OK to save

### 5.2 Verify Permissions

All files should have these permissions:
- `index.html`: 644
- `styles.css`: 644
- `script.js`: 644
- `submit-form.php`: 644
- `package.json`: 644

## Step 6: Test Your Website

### 6.1 Access Your Website

1. Open your web browser
2. Navigate to your domain (e.g., `https://yourdomain.com`)
3. The website should load and display properly

### 6.2 Test the Lead Capture Form

1. Scroll to the top of the page where the "Get Early Access" form is located
2. Fill in the form with test data:
   - Full Name: Test User
   - Email: Use your own email address
   - Phone: (optional)
   - Company: Test Company
   - Interest: Select any option
   - Message: This is a test submission
3. Click **"Request Demo"**
4. You should see a success message

### 6.3 Verify Email Delivery

1. Check the inbox for `salvador.sena@quetzalcoro.com`
2. You should receive an email with the form submission details
3. Also check spam/junk folder if the email doesn't arrive in a few minutes

### 6.4 Verify Database Storage

1. Go back to phpMyAdmin in your IONOS control panel
2. Select your database
3. Click on the `leads` table
4. Click the **"Browse"** tab
5. You should see your test submission in the table

**✅ Checkpoint**: If you received the email and can see the data in phpMyAdmin, everything is working correctly!

## Step 7: Configure Your Domain (if needed)

If you're using a new domain or subdomain:

1. In IONOS control panel, go to **"Domains"**
2. Select your domain
3. Make sure it points to the correct web hosting package
4. DNS changes can take up to 24-48 hours to propagate

## Troubleshooting

### Problem: Form doesn't submit / shows error

**Solution**:
1. Check that `submit-form.php` has the correct database credentials
2. Verify database connection by checking phpMyAdmin access
3. Make sure the `leads` table exists in your database
4. Check file permissions are set correctly (644)

### Problem: Email not received

**Solution**:
1. Check spam/junk folder
2. Verify the email address in `submit-form.php` is correct
3. Some IONOS accounts may require email verification - check your IONOS email settings
4. Contact IONOS support to ensure mail() function is enabled

### Problem: Database connection error

**Solution**:
1. Double-check database credentials in `submit-form.php`
2. Verify database exists in phpMyAdmin
3. Check that MySQL service is active in IONOS control panel
4. Ensure database user has proper permissions

### Problem: Page not loading / 404 error

**Solution**:
1. Verify files are in the correct directory (`/public_html/` or `/htdocs/`)
2. Check that `index.html` is present
3. Clear browser cache and try again
4. Wait for DNS propagation if you just set up the domain

### Problem: White screen or PHP errors

**Solution**:
1. Check PHP version in IONOS control panel (should be PHP 7.4 or higher)
2. Enable error reporting temporarily to see specific errors
3. Verify all PHP files uploaded correctly
4. Check file permissions

## Security Best Practices

### 1. Regular Backups
- IONOS provides automatic backups, but also:
  - Export database regularly via phpMyAdmin
  - Download website files periodically
  - Store backups in a secure location

### 2. Monitor Form Submissions
- Check your email regularly for new leads
- Review database entries periodically
- Watch for spam submissions

### 3. Update Credentials
- Change database password periodically
- Use strong passwords (mix of letters, numbers, symbols)
- Never share credentials publicly

### 4. Add Additional Security (Optional, for advanced users)
- Implement CAPTCHA (Google reCAPTCHA)
- Add rate limiting to prevent spam
- Enable HTTPS/SSL certificate (usually free with IONOS)
- Add CSRF tokens to the form

## Managing Your Leads

### View All Leads

1. Access phpMyAdmin from IONOS control panel
2. Select your database
3. Click on `leads` table
4. Click **"Browse"** tab to see all submissions

### Export Leads to CSV

1. In phpMyAdmin, click on `leads` table
2. Click **"Export"** tab
3. Select format: **CSV**
4. Click **"Go"** to download the file
5. Open with Excel, Google Sheets, or any spreadsheet software

### Update Lead Status

You can track your progress with leads:
1. In phpMyAdmin, browse the `leads` table
2. Click **"Edit"** (pencil icon) next to a lead
3. Change the `status` field to:
   - `new` - Just submitted, not yet contacted
   - `contacted` - You've reached out to them
   - `qualified` - They're interested and fit your criteria
   - `converted` - They became a customer
   - `archived` - Old or no longer relevant
4. Add notes in the `notes` field
5. Click **"Go"** to save

### Search for Specific Leads

Use the search function in phpMyAdmin:
1. Click on `leads` table
2. Click **"Search"** tab
3. Enter search criteria (email, name, company, etc.)
4. Click **"Go"**

## Ongoing Maintenance

### Weekly Tasks
- [ ] Check email for new lead notifications
- [ ] Review new leads in database
- [ ] Follow up with leads marked as 'new'

### Monthly Tasks
- [ ] Export leads to CSV for backup
- [ ] Review and update lead statuses
- [ ] Clean up test/spam submissions
- [ ] Check website is loading correctly

### Quarterly Tasks
- [ ] Change database password
- [ ] Review and update website content
- [ ] Check for PHP/MySQL updates in IONOS
- [ ] Test form submission end-to-end

## Support and Resources

### IONOS Support
- Support Portal: [https://www.ionos.com/help](https://www.ionos.com/help)
- Phone Support: Check your IONOS control panel for your region's number
- Live Chat: Available in IONOS control panel

### Common IONOS Help Articles
- Setting up FTP access
- Creating MySQL databases
- Using phpMyAdmin
- Configuring email
- SSL certificate setup

### Website Customization
If you need to make changes to the website:
- Edit `index.html` for content changes
- Edit `styles.css` for design/color changes
- Edit `script.js` for functionality changes
- Always keep backups before making changes
- Test changes locally before uploading to live site

## Conclusion

Congratulations! Your Senas AI website is now live and collecting leads. The system will:
- ✅ Capture lead information through the form
- ✅ Store all data securely in the MySQL database
- ✅ Send email notifications to salvador.sena@quetzalcoro.com
- ✅ Allow you to manage and track leads in phpMyAdmin

If you encounter any issues not covered in this guide, contact IONOS support or refer to their help documentation.

---

**Last Updated**: February 2026  
**Version**: 1.0  
**Contact**: salvador.sena@quetzalcoro.com
