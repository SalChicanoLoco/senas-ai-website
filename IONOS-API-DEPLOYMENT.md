# IONOS API Deployment Guide - Automated CI/CD

This guide covers setting up automated, secure deployment to IONOS hosting using GitHub Actions. This eliminates manual FTP uploads and keeps credentials secure.

## 🎯 Overview

This deployment system:
- ✅ **Secure**: No credentials in code, all via GitHub Secrets
- ✅ **Automated**: Deploy on every push to `main` or `netlify-working-backup`
- ✅ **Manual trigger**: Can be triggered via GitHub Actions UI
- ✅ **Verified**: Tests deployment success automatically
- ✅ **Environment variables**: PHP reads config from `.htaccess` on IONOS

## 📋 Prerequisites

Before starting, ensure you have:

1. **IONOS Hosting Account**
   - Active hosting plan with PHP and MySQL support
   - SSH/SFTP access enabled
   - Database already created (see IONOS-DEPLOYMENT.md)

2. **GitHub Repository Access**
   - Admin or write access to the repository
   - Ability to add/modify GitHub Secrets

3. **IONOS Credentials**
   - SFTP hostname (e.g., `access-5019605769.webspace-host.com`)
   - SFTP username (e.g., `a2040943`)
   - SSH private key or password for SFTP authentication
   - Database credentials (host, name, user, password)

## 🔐 Step 1: Generate SSH Key for SFTP

IONOS supports both password and SSH key authentication. SSH keys are more secure for automated deployments.

### Option A: Use SSH Key Authentication (Recommended)

1. **Generate SSH key pair** (on your local machine):
   ```bash
   ssh-keygen -t rsa -b 4096 -C "github-actions-deployment" -f ionos_deploy_key
   ```
   - This creates two files:
     - `ionos_deploy_key` (private key - keep this secret!)
     - `ionos_deploy_key.pub` (public key - upload to IONOS)

2. **Upload public key to IONOS**:
   - Log in to IONOS Control Panel
   - Navigate to **Hosting** → **SSH Access** or **SFTP**
   - Find **Authorized Keys** or **SSH Keys** section
   - Upload or paste content of `ionos_deploy_key.pub`
   - Save changes

3. **Test SSH connection**:
   ```bash
   ssh -i ionos_deploy_key your_username@your_host.webspace-host.com
   ```
   - Replace `your_username` and `your_host` with your actual IONOS credentials
   - If successful, you should see IONOS shell prompt

4. **Save private key for GitHub Secrets** (see Step 2)

### Option B: Use Password Authentication

If SSH keys aren't supported or you prefer password authentication:

1. You'll use your IONOS SFTP password directly
2. Store it in GitHub Secrets as `SFTP_PASS` (see Step 2)
3. Modify workflow to use `sshpass` for authentication (less secure)

## 🔑 Step 2: Configure GitHub Secrets

GitHub Secrets securely store sensitive credentials for GitHub Actions workflows.

### Navigate to Secrets

1. Open your repository on GitHub
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button

### Add Required Secrets

Add the following secrets one by one:

#### SFTP/SSH Configuration

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `SFTP_HOST` | IONOS SFTP hostname | `your_host.webspace-host.com` |
| `SFTP_USER` | IONOS SFTP username | `your_username` |
| `SFTP_PORT` | SFTP port (usually 22) | `22` |
| `SFTP_PRIVATE_KEY` | SSH private key content (from Step 1) | *entire content of `ionos_deploy_key` file* |
| `WEB_ROOT` | Web root directory path | `/` (or `/html`, `/httpdocs` depending on your IONOS setup) |

**For `SFTP_PRIVATE_KEY`**:
```bash
# Copy entire private key content including headers
cat ionos_deploy_key
```
Copy everything from `-----BEGIN OPENSSH PRIVATE KEY-----` to `-----END OPENSSH PRIVATE KEY-----` and paste into the secret value.

#### Database Configuration

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `DB_HOST` | Database hostname | `db12345.hosting-data.io` |
| `DB_NAME` | Database name | `dbs12345` |
| `DB_USER` | Database username | `dbu12345` |
| `DB_PASS` | Database password | *your database password* |

#### Email Configuration

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `ADMIN_EMAIL` | Email for form notifications | `xava@newmexicosocialists.org` |
| `FROM_EMAIL_DOMAIN` | Domain for outgoing emails | `newmexicosocialists.org` |

#### Optional Secrets

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `DEPLOYMENT_URL` | Your website URL | `https://newmexicosocialists.org` |

### Verify Secrets Configuration

1. After adding all secrets, you should see them listed
2. Click on a secret name to verify it exists (values are hidden)
3. Secrets are encrypted and never displayed after creation

## 🚀 Step 3: First Deployment

### Automatic Deployment (Push to Branch)

The workflow automatically runs when you push to `main` or `netlify-working-backup`:

1. Make any change to your repository
2. Commit and push to `main` or `netlify-working-backup`:
   ```bash
   git add .
   git commit -m "Trigger deployment"
   git push origin main
   ```
3. GitHub Actions automatically starts deployment

### Manual Deployment (Workflow Dispatch)

You can manually trigger deployment without pushing code:

1. Go to your repository on GitHub
2. Click **Actions** tab
3. Click **Deploy to IONOS** workflow in left sidebar
4. Click **Run workflow** button (on the right)
5. Select branch (usually `main`)
6. Click green **Run workflow** button

## 📊 Step 4: Monitor Deployment

### View Workflow Progress

1. Go to **Actions** tab in GitHub repository
2. Click on the running workflow (you'll see a yellow dot 🟡)
3. Click on the **deploy** job to see detailed logs
4. Watch each step execute:
   - ✅ Checkout code
   - ✅ Setup SSH key
   - ✅ Generate .htaccess
   - ✅ Deploy files via SFTP
   - ✅ Set file permissions
   - ✅ Verify deployment

### Understanding the Output

Each step shows detailed logs:

```
🔧 Generating .htaccess file with environment variables...
✅ All environment variables validated
✅ .htaccess file generated successfully!

📤 Uploading files to IONOS...
index.html                 100%   21KB   1.2MB/s   00:00
submit-form.php           100%    6KB   800KB/s   00:00
.htaccess                 100%    1KB   150KB/s   00:00
✅ Files uploaded successfully

🧪 Verifying deployment...
✅ Website is accessible (HTTP 200)
✅ submit-form.php is accessible (405 = POST required)
🎉 Deployment complete!
```

### Deployment Success

- Green checkmark ✅ means deployment succeeded
- Red X ❌ means deployment failed (see Troubleshooting below)

## 🔧 Step 5: Environment Variable Management

### How Environment Variables Work on IONOS

IONOS shared hosting doesn't support direct environment variables. Instead:

1. **GitHub Actions generates `.htaccess`** with `SetEnv` directives
2. **`.htaccess` is uploaded** to IONOS root directory
3. **PHP reads environment variables** via `getenv()` function
4. **`.htaccess` is NOT committed** to version control (contains secrets)

### Example .htaccess (Generated Automatically)

```apache
# Environment Variables for New Mexico Socialists
SetEnv DB_HOST "db5019682681.hosting-data.io"
SetEnv DB_NAME "dbs5019682681"
SetEnv DB_USER "dbu924798"
SetEnv DB_PASS "your_secure_password"
SetEnv ADMIN_EMAIL "xava@newmexicosocialists.org"
SetEnv FROM_EMAIL_DOMAIN "newmexicosocialists.org"

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# PHP settings
php_flag display_errors Off
php_flag log_errors On
```

### Updating Environment Variables

To update environment variables:

1. Go to GitHub repository **Settings** → **Secrets**
2. Click on the secret you want to update
3. Click **Update secret**
4. Enter new value and click **Update secret**
5. Trigger a new deployment (push code or manual trigger)
6. New `.htaccess` with updated values is deployed

## 🗄️ Step 6: Database Setup

The database must be created manually via IONOS Control Panel (one-time setup):

### Create Database (If Not Already Done)

1. Log in to IONOS Control Panel
2. Navigate to **Databases** → **MySQL Databases**
3. Click **Create New Database**
4. Note credentials (host, name, user, password)
5. Add these credentials to GitHub Secrets (Step 2)

### Import Database Schema

1. Open **phpMyAdmin** from IONOS Control Panel
2. Select your database
3. Click **Import** tab
4. Upload `database-schema.sql` from repository
5. Click **Go** to import
6. Verify `form_submissions` table exists

### Test Database Connection

After deployment, test form submission:

1. Visit your website
2. Fill out the join form
3. Submit form
4. Check phpMyAdmin for new entry in `form_submissions` table
5. Check email for notification

## 🔒 Step 7: SSL Certificate Configuration

IONOS provides free SSL certificates:

### Enable SSL (One-Time Setup)

1. Log in to IONOS Control Panel
2. Navigate to **Domains** → **SSL Certificates**
3. Click **Activate SSL** for your domain
4. Choose **Let's Encrypt** (free) or upload custom certificate
5. Wait 10-30 minutes for certificate activation
6. IONOS automatically configures HTTPS

### Force HTTPS (Optional)

Add to `.htaccess` (modify `scripts/setup-htaccess.sh`):

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## 🧪 Step 8: Deployment Verification

### Automated Checks (Included in Workflow)

The workflow automatically verifies:
- ✅ Website is accessible (HTTP 200)
- ✅ PHP file responds correctly (HTTP 405 for GET)
- ✅ Files uploaded successfully

### Manual Verification Checklist

After deployment, manually verify:

- [ ] Website loads at `https://newmexicosocialists.org`
- [ ] All 19 memes display correctly
- [ ] CSS and JavaScript load correctly
- [ ] Form submission works
- [ ] Form data saves to database
- [ ] Email notification is sent
- [ ] No PHP errors in logs

### Check PHP Error Logs

If issues occur:

1. Log in to IONOS Control Panel
2. Navigate to **Hosting** → **Logs** → **Error Logs**
3. Look for PHP errors related to `submit-form.php`
4. Common issues:
   - Database connection failed → Check DB credentials
   - Undefined function → Check PHP version (needs 7.0+)
   - Permission denied → Check file permissions

## 🐛 Troubleshooting Common Issues

### Deployment Fails: "Permission denied (publickey)"

**Cause**: SSH key not properly configured

**Solutions**:
1. Verify `SFTP_PRIVATE_KEY` secret contains entire private key
2. Check key includes `-----BEGIN` and `-----END` headers
3. Verify public key is uploaded to IONOS
4. Test SSH connection locally first

### Deployment Fails: "Connection refused"

**Cause**: Wrong SFTP hostname or port

**Solutions**:
1. Verify `SFTP_HOST` matches IONOS provided hostname
2. Verify `SFTP_PORT` is 22 (default for SFTP)
3. Check IONOS Control Panel for correct connection details

### Deployment Succeeds but Site Shows Errors

**Cause**: Environment variables not loading

**Solutions**:
1. Check `.htaccess` was uploaded (not in `.gitignore` during upload)
2. Verify IONOS supports `SetEnv` directives
3. Check PHP version is 7.0+ (older versions may not support `getenv()`)
4. Test by adding debug to `submit-form.php`:
   ```php
   var_dump(getenv('DB_HOST')); exit;
   ```

### Form Submission Returns Database Error

**Cause**: Database credentials incorrect

**Solutions**:
1. Verify `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` in GitHub Secrets
2. Test credentials in phpMyAdmin
3. Check database user has proper permissions
4. Verify database exists and schema is imported

### No Email Notifications

**Cause**: Email configuration issue

**Solutions**:
1. Check spam/junk folder
2. Verify `ADMIN_EMAIL` is correct in GitHub Secrets
3. Verify `FROM_EMAIL_DOMAIN` matches your IONOS domain
4. Contact IONOS to ensure PHP `mail()` is enabled
5. Consider using transactional email service (SendGrid, Mailgun)

### Files Not Uploading via SFTP

**Cause**: Directory structure or permissions

**Solutions**:
1. Verify files exist in repository before deployment
2. Check SFTP batch commands in workflow logs
3. Verify `assets/` directory structure matches expected
4. Check IONOS disk quota (may be full)

### Workflow Shows "Warning: Website not accessible"

**Cause**: DNS propagation delay or IONOS downtime

**Solutions**:
1. Wait 5-10 minutes and check again
2. Verify domain is correctly pointed to IONOS
3. Check IONOS status page for outages
4. Test with direct IP address instead of domain

## 🔄 Step 9: Rollback Procedures

If a deployment breaks the site:

### Quick Rollback via FTP

1. Connect to IONOS via FTP/SFTP
2. Download current files as backup
3. Upload previous working version
4. Test site functionality

### Rollback via GitHub

1. Identify last working commit:
   ```bash
   git log --oneline
   ```
2. Revert to that commit:
   ```bash
   git revert HEAD
   git push origin main
   ```
3. Deployment automatically runs with reverted code

### Emergency Manual Upload

If automated deployment is broken:

1. Use FileZilla or similar FTP client
2. Connect with IONOS FTP credentials
3. Upload files manually:
   - `index.html`
   - `submit-form.php`
   - `assets/` directory
4. Create `.htaccess` manually with environment variables
5. Fix automated deployment before next push

## 📝 Step 10: Best Practices

### Security

- ✅ Never commit `.htaccess` with real credentials
- ✅ Never commit `.env` files with real credentials
- ✅ Rotate SSH keys every 6-12 months
- ✅ Use strong database passwords (20+ characters)
- ✅ Regularly audit GitHub Secrets access
- ✅ Enable 2FA on GitHub and IONOS accounts

### Development Workflow

- ✅ Test changes locally before pushing
- ✅ Use feature branches for major changes
- ✅ Review deployment logs after each push
- ✅ Keep `main` branch always deployable
- ✅ Use `workflow_dispatch` for manual deploys during testing

### Monitoring

- ✅ Check deployment status after every push
- ✅ Monitor form submissions in phpMyAdmin weekly
- ✅ Review PHP error logs monthly
- ✅ Test form submission functionality monthly
- ✅ Verify email notifications are working

### Backups

- ✅ Export database monthly via phpMyAdmin
- ✅ Keep local copy of all website files
- ✅ Store SSH keys securely (password manager or vault)
- ✅ Document all IONOS credentials in secure location

## 🆘 Getting Help

### Resources

- **IONOS Support**: https://www.ionos.com/help/
- **IONOS Control Panel**: https://my.ionos.com/
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Repository Issues**: Use GitHub Issues for code-related problems

### Support Contacts

- **Technical Issues**: xava@newmexicosocialists.org
- **IONOS Hosting Support**: Contact via IONOS Control Panel
- **GitHub Repository**: Open an issue with detailed error logs

## 📚 Additional Documentation

- **Manual Deployment**: See `IONOS-DEPLOYMENT.md` for FTP-based deployment
- **Database Schema**: See `database-schema.sql` for table structure
- **Local Development**: See `.env.example` for environment variable template
- **Scripts**:
  - `scripts/setup-htaccess.sh`: Generate .htaccess file
  - `scripts/deploy.sh`: Complete deployment script

## 🎉 Success!

You've successfully set up automated, secure deployment to IONOS! 

Every push to `main` or `netlify-working-backup` now automatically:
1. ✅ Generates secure `.htaccess` with environment variables
2. ✅ Uploads files via SFTP
3. ✅ Sets correct permissions
4. ✅ Verifies deployment success

No more manual FTP uploads! 🚀
