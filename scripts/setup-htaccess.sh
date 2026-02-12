#!/bin/bash
# Generates .htaccess with SetEnv directives for IONOS shared hosting
# This is how PHP reads environment variables on IONOS shared hosting

set -e

echo "🔧 Generating .htaccess file with environment variables..."

# Validate required environment variables
required_vars=("DB_HOST" "DB_NAME" "DB_USER" "DB_PASS" "ADMIN_EMAIL" "FROM_EMAIL_DOMAIN")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "❌ Error: The following required environment variables are not set:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please set these variables before running this script."
    exit 1
fi

# Generate .htaccess file
cat > .htaccess << EOF
# Environment Variables for New Mexico Socialists
# Generated automatically by setup-htaccess.sh
# DO NOT commit this file to version control!

SetEnv DB_HOST "${DB_HOST}"
SetEnv DB_NAME "${DB_NAME}"
SetEnv DB_USER "${DB_USER}"
SetEnv DB_PASS "${DB_PASS}"
SetEnv ADMIN_EMAIL "${ADMIN_EMAIL}"
SetEnv FROM_EMAIL_DOMAIN "${FROM_EMAIL_DOMAIN}"

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# PHP settings
php_flag display_errors Off
php_flag log_errors On
php_value error_log /tmp/php_errors.log

# Disable directory listing
Options -Indexes

# Protect sensitive files
<FilesMatch "\.(env|bak|backup|sql|log)$">
    Order allow,deny
    Deny from all
</FilesMatch>
EOF

echo "✅ .htaccess file generated successfully!"
echo ""
echo "⚠️  IMPORTANT: This file contains sensitive credentials."
echo "    Make sure it is NOT committed to version control."
echo "    It will be uploaded to IONOS via SFTP during deployment."
