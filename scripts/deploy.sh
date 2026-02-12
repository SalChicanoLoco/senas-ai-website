#!/bin/bash
# Deployment script for IONOS hosting
# Validates environment, generates .htaccess, uploads files via SFTP, and verifies deployment

set -e

echo "🚀 Starting deployment to IONOS..."
echo ""

# Validate required environment variables
echo "🔍 Validating environment variables..."
required_vars=("SFTP_HOST" "SFTP_USER" "SFTP_PRIVATE_KEY" "DB_HOST" "DB_NAME" "DB_USER" "DB_PASS" "ADMIN_EMAIL" "FROM_EMAIL_DOMAIN")
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
    echo "Please ensure all GitHub Secrets are configured correctly."
    exit 1
fi

echo "✅ All environment variables validated"
echo ""

# Generate .htaccess file with environment variables
echo "🔧 Generating .htaccess file..."
export DB_HOST DB_NAME DB_USER DB_PASS ADMIN_EMAIL FROM_EMAIL_DOMAIN
bash scripts/setup-htaccess.sh
echo ""

# Setup SSH key for SFTP
echo "🔑 Setting up SSH authentication..."
mkdir -p ~/.ssh
echo "$SFTP_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan -H "$SFTP_HOST" >> ~/.ssh/known_hosts 2>/dev/null || true
echo "✅ SSH key configured"
echo ""

# Create list of files to upload
echo "📋 Preparing file list..."
files_to_upload=(
    "index.html"
    "submit-form.php"
    ".htaccess"
)

# Check if files exist
for file in "${files_to_upload[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Required file '$file' not found"
        exit 1
    fi
done
echo "✅ All required files present"
echo ""

# Upload files via SFTP
echo "📤 Uploading files to IONOS..."
sftp_port="${SFTP_PORT:-22}"
web_root="${WEB_ROOT:-/}"

# Create SFTP batch file
cat > /tmp/sftp_commands.txt << SFTP_EOF
cd ${web_root}
put index.html
put submit-form.php
put .htaccess
mkdir -p assets/css
mkdir -p assets/js
mkdir -p assets/img
cd assets/css
lcd assets/css
mput *
cd ../js
lcd ../js
mput *
cd ../img
lcd ../img
mput *
bye
SFTP_EOF

# Execute SFTP upload
if sftp -P "$sftp_port" -b /tmp/sftp_commands.txt "${SFTP_USER}@${SFTP_HOST}"; then
    echo "✅ Files uploaded successfully"
else
    echo "❌ SFTP upload failed"
    exit 1
fi
echo ""

# Set correct permissions (if supported by IONOS)
echo "🔒 Setting file permissions..."
ssh -p "$sftp_port" "${SFTP_USER}@${SFTP_HOST}" << SSH_EOF || echo "⚠️  Permission setting may not be supported on IONOS (this is OK)"
cd ${web_root}
chmod 644 index.html 2>/dev/null || true
chmod 644 submit-form.php 2>/dev/null || true
chmod 644 .htaccess 2>/dev/null || true
chmod -R 644 assets/css/* 2>/dev/null || true
chmod -R 644 assets/js/* 2>/dev/null || true
chmod -R 644 assets/img/* 2>/dev/null || true
exit
SSH_EOF
echo ""

# Verify deployment
echo "🧪 Verifying deployment..."
deployment_url="${DEPLOYMENT_URL:-https://newmexicosocialists.org}"

# Check if site is accessible
if curl -f -s -o /dev/null -w "%{http_code}" "$deployment_url" | grep -q "200"; then
    echo "✅ Website is accessible at $deployment_url"
else
    echo "⚠️  Warning: Website may not be accessible yet (DNS propagation may take time)"
fi
echo ""

# Check if submit-form.php is accessible
if curl -f -s -o /dev/null -w "%{http_code}" "$deployment_url/submit-form.php" | grep -q "405"; then
    echo "✅ submit-form.php is accessible (405 = POST required, as expected)"
else
    echo "⚠️  Warning: submit-form.php may not be accessible"
fi
echo ""

# Clean up sensitive files
echo "🧹 Cleaning up..."
rm -f ~/.ssh/id_rsa
rm -f /tmp/sftp_commands.txt
rm -f .htaccess
echo "✅ Sensitive files removed"
echo ""

echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Visit $deployment_url to verify the site is working"
echo "  2. Test form submission to ensure database connectivity"
echo "  3. Check email notifications are being sent"
echo ""
