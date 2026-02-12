#!/bin/bash
# Verify deployment was successful

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Error: Domain name required"
    echo "Usage: $0 <domain>"
    echo "Example: $0 newmexicosocialists.org"
    exit 1
fi

echo "🔍 Checking deployment at $DOMAIN..."
echo ""

# Check homepage loads
echo "Testing homepage..."
HTTP_CODE=$(curl -L -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" 2>/dev/null || echo "failed")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "✅ Homepage accessible (HTTP $HTTP_CODE)"
else
    echo "❌ Homepage failed (HTTP $HTTP_CODE)"
    exit 1
fi

# Check form endpoint exists
echo "Testing form endpoint..."
FORM_CODE=$(curl -L -s -o /dev/null -w "%{http_code}" -X POST "https://$DOMAIN/submit-form.php" 2>/dev/null || echo "failed")

if [ "$FORM_CODE" = "400" ] || [ "$FORM_CODE" = "200" ]; then
    echo "✅ Form endpoint accessible (HTTP $FORM_CODE)"
else
    echo "❌ Form endpoint failed (HTTP $FORM_CODE)"
    exit 1
fi

# Check if assets are accessible
echo "Testing assets..."
ASSET_CODE=$(curl -L -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/assets/css/styles.css" 2>/dev/null || echo "failed")

if [ "$ASSET_CODE" = "200" ]; then
    echo "✅ Assets accessible (HTTP $ASSET_CODE)"
else
    echo "⚠️  Assets may not be accessible (HTTP $ASSET_CODE)"
fi

echo ""
echo "✅ Deployment verified!"
echo "🌐 Site: https://$DOMAIN"
