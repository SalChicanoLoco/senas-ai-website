# IONOS API Deployment Guide

This guide covers automated deployment of the New Mexico Socialists website to IONOS hosting using GitHub Actions, IONOS API, and secure environment variables.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [One-Time Setup](#one-time-setup)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Automated Deployment](#automated-deployment)
6. [Manual Deployment](#manual-deployment)
7. [Verification](#verification)
8. [Rollback Procedure](#rollback-procedure)
9. [Local Development](#local-development)
10. [Troubleshooting](#troubleshooting)
11. [Security Best Practices](#security-best-practices)

## Overview

### How It Works

The deployment system uses:
- **GitHub Actions** - Automated CI/CD pipeline
- **IONOS SFTP** - Secure file transfer to web server
- **Environment Variables** - Secure credential management via `.htaccess`
- **Automated Verification** - Post-deployment health checks

### Deployment Flow

```
Push to netlify-working-backup branch
    ↓
GitHub Actions triggered
    ↓
Generate .htaccess from template + secrets
    ↓
Deploy files via SFTP to IONOS
    ↓
Verify deployment success
    ↓
Site live at newmexicosocialists.org
```

## Prerequisites

Before setting up automated deployment, you need:

1. **IONOS Hosting Account** with:
   - Web hosting package with PHP support
   - MySQL database created
   - FTP/SFTP access enabled

2. **Database Setup**:
   - Import `database-schema.sql` via IONOS phpMyAdmin
   - Note down database credentials

3. **GitHub Repository Access**:
   - Admin access to add secrets
   - Push access to `netlify-working-backup` branch

## One-Time Setup

### Step 1: Set Up IONOS Database

1. Log in to [IONOS Control Panel](https://my.ionos.com/)
2. Navigate to **Web Hosting** → Your package
3. Go to **MySQL Databases**
4. Create a new database or note existing one:
   - Database Name
   - Database User
   - Database Password
   - Database Host (usually `localhost` or provided by IONOS)

5. Access phpMyAdmin
6. Import `database-schema.sql`:
   - Click **Import** tab
   - Choose file: `database-schema.sql`
   - Click **Go**
   - Verify table `form_submissions` was created

### Step 2: Get IONOS FTP/SFTP Credentials

1. In IONOS Control Panel, go to **Web Hosting**
2. Click **FTP** or **Access & Security**
3. Note down:
   - FTP/SFTP Host (e.g., `access123456.webspace-data.io`)
   - FTP Username
   - FTP Password

### Step 3: (Optional) Get IONOS API Credentials

For advanced automation, get API credentials:

1. Go to [IONOS Developer Portal](https://developer.hosting.ionos.com/)
2. Create an API key:
   - Navigate to **API Keys**
   - Click **Create New Key**
   - Save the API Key and API Secret

*Note: API credentials are optional for basic deployment but recommended for advanced features.*

## GitHub Secrets Configuration

### Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

### Required Secrets

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `IONOS_DB_HOST` | MySQL database host | `localhost` or `dbXXXX.ionos.com` |
| `IONOS_DB_NAME` | MySQL database name | `db123456_nmsocdst` |
| `IONOS_DB_USER` | MySQL database user | `u123456` |
| `IONOS_DB_PASS` | MySQL database password | `SecurePassword123!` |
| `IONOS_FTP_HOST` | SFTP host for file upload | `access123456.webspace-data.io` |
| `IONOS_FTP_USER` | SFTP username | `u123456` |
| `IONOS_FTP_PASS` | SFTP password | `FtpPassword123!` |
| `ADMIN_EMAIL` | Admin notification email | `xava@newmexicosocialists.org` |
| `DOMAIN_NAME` | Your domain name | `newmexicosocialists.org` |

### Optional Secrets (for API features)

| Secret Name | Description |
|-------------|-------------|
| `IONOS_API_KEY` | IONOS API key for advanced features |
| `IONOS_API_SECRET` | IONOS API secret |

### How to Add a Secret

For each secret:

1. Click **New repository secret**
2. Enter **Name** (e.g., `IONOS_DB_HOST`)
3. Enter **Value** (e.g., `localhost`)
4. Click **Add secret**

**Important:** Double-check all values for typos. Incorrect credentials will cause deployment to fail.

## Automated Deployment

### Trigger on Push

The workflow automatically deploys when you push to the `netlify-working-backup` branch:

```bash
# Make changes to your code
git add .
git commit -m "Update website content"
git push origin netlify-working-backup
```

This will:
1. Trigger the GitHub Actions workflow
2. Deploy files to IONOS
3. Verify deployment success

### Monitor Deployment

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click on the running workflow
4. View real-time logs of deployment progress

Expected output:
```
✅ Created .htaccess with environment variables
✅ Files deployed via SFTP
✅ Homepage accessible (HTTP 200)
✅ Form endpoint accessible (HTTP 400)
✅ Deployment completed!
```

## Manual Deployment

You can manually trigger a deployment without pushing code:

### Via GitHub UI

1. Go to **Actions** tab
2. Select **Deploy NM Socialists to IONOS** workflow
3. Click **Run workflow** button
4. Select branch: `netlify-working-backup`
5. Click **Run workflow**

### Via GitHub CLI (Optional)

```bash
gh workflow run deploy-ionos.yml --ref netlify-working-backup
```

## Verification

### Automated Verification

The workflow automatically verifies:
- Homepage is accessible
- Form endpoint responds correctly
- Deployment completed successfully

### Manual Verification

After deployment, test the site:

1. **Homepage**: Visit https://newmexicosocialists.org
   - Should load without errors
   - Check that images load
   - Verify styles are applied

2. **Form Submission**: Test the join form
   - Fill out the form with test data
   - Submit and verify success message
   - Check admin email received notification
   - Verify entry in database (via phpMyAdmin)

3. **Database Connection**: Via phpMyAdmin
   - Log in to phpMyAdmin
   - Select your database
   - Check `form_submissions` table
   - Verify test entry appears

### Using the Verification Script

Run the included verification script locally:

```bash
chmod +x scripts/deploy-check.sh
./scripts/deploy-check.sh newmexicosocialists.org
```

Expected output:
```
🔍 Checking deployment at newmexicosocialists.org...
✅ Homepage accessible (HTTP 200)
✅ Form endpoint accessible (HTTP 400)
✅ Assets accessible (HTTP 200)
✅ Deployment verified!
```

## Rollback Procedure

If a deployment causes issues, you can quickly roll back:

### Option 1: Revert via Git

```bash
# Find the commit to revert to
git log --oneline

# Revert to previous commit
git revert <commit-hash>
git push origin netlify-working-backup

# This automatically triggers a new deployment
```

### Option 2: Revert in GitHub UI

1. Go to **Commits** in your repository
2. Find the problematic commit
3. Click **...** → **Revert**
4. Create revert commit
5. This automatically triggers redeployment

### Option 3: Manual SFTP Restore

If automated rollback fails:

1. Connect via SFTP client (FileZilla, WinSCP, etc.)
2. Use stored backup files
3. Manually restore previous version

## Local Development

### Setup Local Environment

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your local credentials**:
   ```
   DB_HOST=localhost
   DB_NAME=nm_socialists_local
   DB_USER=root
   DB_PASS=your_local_password
   ADMIN_EMAIL=you@example.com
   FROM_EMAIL_DOMAIN=localhost
   ```

3. **Set up local database**:
   ```bash
   # Import schema to local MySQL
   mysql -u root -p nm_socialists_local < database-schema.sql
   ```

4. **Start local PHP server**:
   ```bash
   php -S localhost:8000
   ```

5. **Test locally**:
   - Open http://localhost:8000
   - Test form submission

**Important:** Never commit your `.env` file! It's in `.gitignore` to prevent this.

### Local PHP Configuration

For local development, PHP's `getenv()` won't work the same as on IONOS. Options:

1. **Use fallback values** (already in `submit-form.php`)
2. **Use PHP's built-in `.env` loader** (requires `vlucas/phpdotenv` package)
3. **Manually set environment variables** before starting PHP server:
   ```bash
   export DB_HOST=localhost
   export DB_NAME=nm_socialists_local
   php -S localhost:8000
   ```

## Troubleshooting

### Deployment Fails

**Symptom**: GitHub Actions workflow fails

**Common Causes**:

1. **Incorrect SFTP credentials**
   - Verify `IONOS_FTP_HOST`, `IONOS_FTP_USER`, `IONOS_FTP_PASS`
   - Test credentials with FTP client

2. **Wrong remote path**
   - IONOS usually uses `/httpdocs/`
   - Some accounts may use `/`
   - Check IONOS documentation

3. **File permission issues**
   - Ensure SFTP user has write permissions
   - Check IONOS file manager permissions

**Solution**: 
- Review workflow logs in GitHub Actions
- Verify all secrets are set correctly
- Test SFTP connection manually

### Form Submission Fails

**Symptom**: Form returns error when submitting

**Common Causes**:

1. **Database connection fails**
   - Verify `IONOS_DB_HOST`, `IONOS_DB_NAME`, `IONOS_DB_USER`, `IONOS_DB_PASS`
   - Check database exists in IONOS panel
   - Verify table `form_submissions` exists

2. **Environment variables not set**
   - Check `.htaccess` file uploaded to server
   - Verify Apache `mod_env` enabled (usually is on IONOS)
   - Check PHP `getenv()` works on server

3. **PHP errors**
   - Check IONOS error logs
   - Enable temporary error display for debugging

**Solution**:
- Test database connection via phpMyAdmin
- Add debug logging to `submit-form.php`:
  ```php
  error_log("DB_HOST: " . getenv('DB_HOST'));
  ```

### Email Not Received

**Symptom**: Form submits successfully but no email

**Common Causes**:

1. **IONOS mail() function restrictions**
   - Some hosting packages restrict `mail()`
   - May require authenticated SMTP

2. **Email marked as spam**
   - Check spam folder
   - Verify `FROM_EMAIL_DOMAIN` matches your domain

3. **Incorrect admin email**
   - Verify `ADMIN_EMAIL` secret
   - Check for typos

**Solution**:
- Check database - if entry exists, form works but email failed
- Contact IONOS support about mail() function
- Consider using SMTP library (PHPMailer)

### Site Shows 500 Error

**Symptom**: Site returns HTTP 500 Internal Server Error

**Common Causes**:

1. **PHP syntax error**
   - Check PHP version compatibility
   - Review error logs

2. **`.htaccess` misconfiguration**
   - Syntax error in `.htaccess`
   - Unsupported directives

3. **File permissions**
   - Scripts need 644 permissions
   - Directories need 755 permissions

**Solution**:
- Check IONOS error logs
- Temporarily rename `.htaccess` to test
- Verify PHP version (IONOS usually supports 7.4+)

### Workflow Secrets Not Found

**Symptom**: Workflow fails with "secret not found" error

**Solution**:
1. Go to Settings → Secrets → Actions
2. Verify all required secrets are added
3. Check secret names match exactly (case-sensitive)
4. Re-run workflow

### SFTP Connection Times Out

**Symptom**: "Connection timeout" in workflow logs

**Solution**:
1. Verify `IONOS_FTP_HOST` is correct
2. Check IONOS firewall settings
3. Try increasing timeout in workflow:
   ```yaml
   args: '-o ConnectTimeout=30'
   ```

## Security Best Practices

### ✅ Do's

- ✅ **Use GitHub Secrets** for all credentials
- ✅ **Never commit `.env` files** with real credentials
- ✅ **Regularly rotate passwords** (database, FTP)
- ✅ **Use strong passwords** (16+ characters, mixed case, symbols)
- ✅ **Review deployment logs** for security issues
- ✅ **Keep PHP and dependencies updated**
- ✅ **Monitor form submissions** for suspicious activity
- ✅ **Use HTTPS only** (IONOS provides free SSL)
- ✅ **Backup database regularly** via IONOS panel

### ❌ Don'ts

- ❌ **Never commit credentials to Git**
- ❌ **Don't share secrets** via insecure channels
- ❌ **Don't use simple passwords** like "password123"
- ❌ **Don't disable security headers** in `.htaccess`
- ❌ **Don't expose database schema** publicly
- ❌ **Don't use FTP** (use SFTP only)
- ❌ **Don't commit `.htaccess`** with real values

### Regular Security Checklist

Weekly:
- [ ] Review form submissions for spam
- [ ] Check email notifications are working
- [ ] Verify site is accessible and fast

Monthly:
- [ ] Review GitHub Actions logs
- [ ] Check for failed login attempts in IONOS
- [ ] Verify database backups are current
- [ ] Update dependencies if needed

Quarterly:
- [ ] Rotate FTP password
- [ ] Rotate database password
- [ ] Review and update secrets in GitHub
- [ ] Test rollback procedure

## Support

### Resources

- [IONOS Web Hosting Documentation](https://www.ionos.com/help/web-hosting/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PHP getenv() Documentation](https://www.php.net/manual/en/function.getenv.php)

### Getting Help

1. **Check GitHub Actions logs** - Most errors show here
2. **Check IONOS error logs** - Available in hosting panel
3. **Review this guide** - Covers common issues
4. **Contact IONOS support** - For hosting-specific issues
5. **Create GitHub issue** - For code/workflow issues

## Summary

This deployment system provides:

- **Security**: Zero credentials in code, all via encrypted GitHub Secrets
- **Automation**: Push to deploy, no manual FTP needed
- **Reliability**: Automated verification catches issues immediately  
- **Simplicity**: One-time setup, then push-to-deploy
- **Rollback**: Easy revert via Git if issues occur

After initial setup with GitHub Secrets, deployment is as simple as:

```bash
git push origin netlify-working-backup
```

The site automatically updates at https://newmexicosocialists.org with zero manual steps!
