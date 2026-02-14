# 📧 Phase 1: Brevo Newsletter Setup Guide

**Complete Step-by-Step Implementation for New Mexico Socialists**

---

## 🎯 1. Overview

### Why Brevo?

**FREE Tier Benefits:**
- ✅ **300 emails per day** on Free Plan (9,000/month)
- ✅ **Unlimited contacts** - no contact limit restrictions
- ✅ **No server needed** - cloud-based platform
- ✅ **Professional email infrastructure** - SPF, DKIM, DMARC included
- ✅ **Beautiful drag-and-drop editor** for email templates
- ✅ **Real-time analytics** - opens, clicks, bounces, unsubscribes
- ✅ **API access** for form integration
- ✅ **Automation workflows** available
- ✅ **Transactional email support**
- ✅ **GDPR/CAN-SPAM compliant** tools built-in

**Perfect for grassroots organizations** - professional email marketing without the cost barrier.

### Timeline & Effort

| Day | Task | Time Required |
|-----|------|---------------|
| **Day 1** | Account Setup & Domain Verification | ~2 hours |
| **Day 2** | Member Export & Import | ~1 hour |
| **Day 3** | PHP Form Integration | ~2 hours |
| **Day 4** | Email Templates | ~1.5 hours |
| **Day 5** | Testing | ~1 hour |
| **Day 6** | Launch | ~0.5 hours |
| **Total** | **6 days** | **~8 hours** |

### Cost

**$0.00** - Completely free using Brevo's Free Plan

---

## 📅 Day 1: Account Setup & Domain Verification

### Step 1: Create Brevo Account

1. **Visit Brevo:** https://www.brevo.com
2. **Click "Sign up free"**
3. **Fill in registration form:**
   - Email: `xava@newmexicosocialists.org`
   - Company name: `New Mexico Socialists`
   - Company type: `Non-profit`
   - Country: `United States`
4. **Verify email address** (check inbox for verification link)
5. **Complete onboarding wizard**
6. **Select "Free Plan"** when prompted

### Step 2: Domain Verification

**Why verify your domain?**
- ✅ Better email deliverability (avoid spam folder)
- ✅ Use custom "From" addresses (`news@newmexicosocialists.org`)
- ✅ Builds sender reputation
- ✅ Required for DKIM authentication

#### Add Domain in Brevo

1. **Login to Brevo dashboard**
2. **Navigate to:** Settings → Senders & IP → Domains
3. **Click "Add a domain"**
4. **Enter domain:** `newmexicosocialists.org`
5. **Brevo will display DNS records to add**

#### DNS Records You'll Need to Add (IONOS)

Brevo will provide you with specific records. They'll look similar to this:

**SPF Record (TXT):**
```
Type: TXT
Name: @ (or blank)
Value: v=spf1 include:spf.brevo.com ~all
TTL: 3600
```

**DKIM Record (TXT):**
```
Type: TXT
Name: mail._domainkey
Value: k=rsa; p=[LONG_KEY_PROVIDED_BY_BREVO]
TTL: 3600
```

**DMARC Record (TXT):** *(Optional but recommended)*
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:xava@newmexicosocialists.org
TTL: 3600
```

### Step 3: Add DNS Records in IONOS

1. **Login to IONOS:** https://www.ionos.com
2. **Navigate to:** Domains & SSL → `newmexicosocialists.org`
3. **Click "DNS Settings"** or "Manage DNS"
4. **Add TXT Records:**
   - Click "Add Record"
   - Select record type: **TXT**
   - Enter Name/Host (e.g., `@` for SPF, `mail._domainkey` for DKIM)
   - Paste Value exactly as provided by Brevo
   - Set TTL to 3600 seconds
   - Click "Save"
5. **Repeat for each DNS record** (SPF, DKIM, DMARC)

**Important Notes:**
- DNS propagation takes **15 minutes to 48 hours** (usually within 1 hour)
- Some registrars use `@` for root domain, others use blank field
- Copy/paste values carefully - no extra spaces

### Step 4: Verify Domain in Brevo

1. **Return to Brevo dashboard**
2. **Go to:** Settings → Senders & IP → Domains
3. **Click "Verify" next to your domain**
4. **Wait for verification** (may take up to 48 hours)
5. **Check verification status** - should show green checkmark

### Step 5: Configure Sender

1. **Navigate to:** Settings → Senders & IP → Senders
2. **Click "Add a sender"**
3. **Fill in details:**
   - Name: `New Mexico Socialists`
   - Email: `news@newmexicosocialists.org` (or `noreply@...`)
   - Reply-to email: `xava@newmexicosocialists.org`
4. **Set as default sender**

### Step 6: Create Contact List with Custom Attributes

1. **Navigate to:** Contacts → Lists
2. **Click "Create a list"**
3. **List name:** `New Mexico Socialists Members`
4. **Folder:** Create folder "Main Lists"

#### Add Custom Contact Attributes

1. **Navigate to:** Contacts → Settings → Contact attributes
2. **Click "Create an attribute"**
3. **Add these custom fields:**

| Attribute Name | Type | Category | Required |
|----------------|------|----------|----------|
| `NAME` | Text | Normal | No |
| `CITY` | Text | Normal | No |
| `STATE` | Text | Normal | No |
| `COUNTRY` | Text | Normal | No |
| `ZIP_CODE` | Text | Normal | No |

4. **Save each attribute**

**✅ Day 1 Complete!** Your Brevo account is set up and ready for contacts.

---

## 📅 Day 2: Member Export & Import

### Step 1: Export Members from MySQL

Create a PHP script to export existing members from your database:

**File:** `/scripts/export-members-brevo.php`

```php
<?php
/**
 * Export Members for Brevo Import
 * Exports contacts from form_submissions table to CSV format
 * Only exports members who have NOT unsubscribed
 */

// Load configuration
require_once dirname(__DIR__) . '/config.php';

// Set CSV headers
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=brevo-members-' . date('Y-m-d') . '.csv');

// Create output stream
$output = fopen('php://output', 'w');

// Write CSV header row (must match Brevo contact attributes)
fputcsv($output, ['EMAIL', 'NAME', 'CITY', 'STATE', 'COUNTRY', 'ZIP_CODE']);

try {
    // Connect to database
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }
    
    // Set charset
    $conn->set_charset('utf8mb4');
    
    // Query: Select all non-unsubscribed members
    $sql = "SELECT email, name, city, state, country, zip_code 
            FROM form_submissions 
            WHERE unsubscribed = FALSE
            ORDER BY submitted_at ASC";
    
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception('Query failed: ' . $conn->error);
    }
    
    // Write each row to CSV
    while ($row = $result->fetch_assoc()) {
        fputcsv($output, [
            $row['email'],
            $row['name'],
            $row['city'],
            $row['state'],
            $row['country'],
            $row['zip_code']
        ]);
    }
    
    // Close database connection
    $conn->close();
    
} catch (Exception $e) {
    // Log error and output error message
    error_log('Brevo export error: ' . $e->getMessage());
    fputcsv($output, ['ERROR', $e->getMessage()]);
}

// Close output stream
fclose($output);
exit;
?>
```

### Step 2: Run Export Script

**Option A: Via Browser**
1. Upload `export-members-brevo.php` to `/scripts/` directory
2. Navigate to: `https://newmexicosocialists.org/scripts/export-members-brevo.php`
3. File will download automatically as CSV

**Option B: Via Command Line (SSH)**
```bash
cd /path/to/website
php scripts/export-members-brevo.php > brevo-members-$(date +%Y-%m-%d).csv
```

**Security Note:** Add password protection or delete file after use!

### Step 3: Import Contacts to Brevo

1. **Login to Brevo dashboard**
2. **Navigate to:** Contacts → Import contacts
3. **Click "Upload a file"**
4. **Select your CSV file** (downloaded from export script)
5. **Choose import options:**
   - ☑️ Update existing contacts
   - ☑️ Create new contacts
   - ☐ Ignore invalid email addresses (keep checked to skip errors)
6. **Map CSV columns to Brevo attributes:**
   - `EMAIL` → Email address *(required)*
   - `NAME` → NAME attribute
   - `CITY` → CITY attribute
   - `STATE` → STATE attribute
   - `COUNTRY` → COUNTRY attribute
   - `ZIP_CODE` → ZIP_CODE attribute
7. **Select list:** `New Mexico Socialists Members`
8. **Review and confirm import**
9. **Wait for processing** (Brevo will send email when complete)

### Step 4: Verify Import

1. **Navigate to:** Contacts → Lists
2. **Open:** `New Mexico Socialists Members`
3. **Check contact count** - should match your database count
4. **Click on a few contacts** to verify data imported correctly
5. **Check for errors** - Brevo will flag invalid emails

**✅ Day 2 Complete!** All existing members are now in Brevo.

---

## 📅 Day 3: PHP Form Integration

### Step 1: Get Brevo API Key

1. **Login to Brevo dashboard**
2. **Navigate to:** Settings → SMTP & API → API Keys
3. **Click "Create a new API key"**
4. **Name:** `Website Form Integration`
5. **Copy the API key** (starts with `xkeysib-...`)
6. **Save securely** - you can only see it once!

### Step 2: Get List ID

1. **Navigate to:** Contacts → Lists
2. **Open:** `New Mexico Socialists Members`
3. **Look at URL** - the number at the end is your List ID
   - Example: `https://app.brevo.com/contact/list/id/12345` → List ID is `12345`
4. **Write down List ID**

### Step 3: Update config.php

Add Brevo configuration to your existing `config.php`:

```php
<?php
// IONOS Database Configuration
define('DB_HOST', 'db5019682681.hosting-data.io');
define('DB_NAME', 'dbs5019682681');
define('DB_USER', 'dbu5019682681');
define('DB_PASS', 'yXSXxlB2!nvjz0o');
define('DB_CHARSET', 'utf8mb4');

// Email Configuration
define('NOTIFICATION_EMAIL', 'xava@newmexicosocialists.org');

// Setup Key (for database initialization script)
define('SETUP_KEY', 'nmsocialists-setup-2026');

// === BREVO API CONFIGURATION ===
// Get API key from: Settings → SMTP & API → API Keys
define('BREVO_API_KEY', 'xkeysib-YOUR-API-KEY-HERE');

// Get List ID from: Contacts → Lists (look at URL)
define('BREVO_LIST_ID', 12345); // Replace with your actual List ID
?>
```

**⚠️ Security:** Make sure `config.php` is protected by `.htaccess` and NOT in git repository!

### Step 4: Add Brevo Integration Function

Add this function to `submit-form.php` (after the `send_notification()` function):

```php
/**
 * Add contact to Brevo email list via API
 */
function add_to_brevo($subscriber_data) {
    // Check if Brevo is configured
    if (!defined('BREVO_API_KEY') || !defined('BREVO_LIST_ID')) {
        error_log('Brevo not configured - skipping contact sync');
        return false;
    }
    
    // Prepare API request
    $api_url = 'https://api.brevo.com/v3/contacts';
    
    $contact_data = [
        'email' => $subscriber_data['email'],
        'attributes' => [
            'NAME' => $subscriber_data['name'],
            'CITY' => $subscriber_data['city'],
            'STATE' => $subscriber_data['state'],
            'COUNTRY' => $subscriber_data['country'],
            'ZIP_CODE' => $subscriber_data['zip_code']
        ],
        'listIds' => [intval(BREVO_LIST_ID)],
        'updateEnabled' => true // Update contact if already exists
    ];
    
    // Initialize cURL
    $ch = curl_init($api_url);
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($contact_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'accept: application/json',
        'api-key: ' . BREVO_API_KEY,
        'content-type: application/json'
    ]);
    
    // Execute request
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);
    
    // Log response
    if ($http_code >= 200 && $http_code < 300) {
        error_log("Brevo: Successfully added contact {$subscriber_data['email']}");
        return true;
    } else if ($http_code == 400) {
        // Contact might already exist - this is OK
        error_log("Brevo: Contact {$subscriber_data['email']} may already exist (HTTP 400)");
        return true;
    } else {
        error_log("Brevo API error: HTTP {$http_code} - {$response}");
        if ($curl_error) {
            error_log("Brevo cURL error: {$curl_error}");
        }
        return false;
    }
}
```

### Step 5: Integrate with Form Submission

In `submit-form.php`, find the section after database insert (around line 237) and add the Brevo integration:

**Find this code:**
```php
    // Close statement and connection
    $stmt->close();
    $conn->close();
    
    // Send email notifications
    $email_data = [
```

**Add Brevo integration BEFORE "Send email notifications":**
```php
    // Close statement and connection
    $stmt->close();
    $conn->close();
    
    // === ADD TO BREVO NEWSLETTER LIST ===
    $brevo_data = [
        'name' => $name,
        'email' => $email,
        'city' => $city,
        'state' => $state,
        'country' => $country,
        'zip_code' => $zip_code
    ];
    
    // Attempt to add to Brevo (non-blocking - don't fail form if Brevo fails)
    try {
        add_to_brevo($brevo_data);
    } catch (Exception $e) {
        error_log("Failed to add to Brevo: " . $e->getMessage());
        // Continue even if Brevo fails - form submission still succeeds
    }
    
    // Send email notifications
    $email_data = [
```

### Step 6: Test Integration

**Create a test HTML form or use your existing form:**

1. **Submit test form** with your own email
2. **Check logs** for Brevo success message:
   - Linux: `/var/log/apache2/error.log` or `/var/log/php/error.log`
   - IONOS: Check hosting control panel logs
3. **Verify in Brevo:**
   - Go to Contacts → Lists
   - Open "New Mexico Socialists Members"
   - Search for your test email
   - Should appear with all custom attributes

**Troubleshooting:**
- ❌ If API key invalid: Check `BREVO_API_KEY` in config.php
- ❌ If list not found: Verify `BREVO_LIST_ID` is correct number
- ❌ If cURL error: Ensure cURL is enabled on server

**✅ Day 3 Complete!** New form submissions now automatically sync to Brevo.

---

## 📅 Day 4: Email Templates

### Welcome Email Template (Bilingual)

#### Create Template in Brevo

1. **Navigate to:** Campaigns → Templates
2. **Click "Create a template"**
3. **Choose:** Drag & drop editor
4. **Template name:** `Welcome Email - Bilingual`

#### Email Subject Line

```
Welcome to New Mexico Socialists / Bienvenido a New Mexico Socialists ✊
```

#### HTML Email Content

Use Brevo's drag-and-drop editor to create this layout:

**Design Tips:**
- **Colors:** Red (#DC143C) and Black (#000000) - socialist aesthetic
- **Logo:** Upload New Mexico Socialists logo at top
- **Font:** Clean sans-serif (Arial, Helvetica)
- **Layout:** Single column, mobile-responsive

**Content Structure:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to New Mexico Socialists</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
    
    <!-- Container -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                
                <!-- Email Content -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    
                    <!-- Header with Red Background -->
                    <tr>
                        <td style="background-color: #DC143C; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <!-- Logo placeholder - replace with actual logo URL -->
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✊ New Mexico Socialists</h1>
                        </td>
                    </tr>
                    
                    <!-- English Content -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px;">
                            <h2 style="color: #DC143C; margin-top: 0;">Welcome, {{ contact.NAME }}!</h2>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                                Thank you for joining <strong>New Mexico Socialists</strong>! We're excited to have you as part of our community fighting for social and economic justice.
                            </p>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                                <strong>You will receive updates about:</strong>
                            </p>
                            <ul style="color: #333333; font-size: 16px; line-height: 1.8;">
                                <li>Community events and meetings in {{ contact.CITY }}, {{ contact.STATE }}</li>
                                <li>Educational resources and workshops</li>
                                <li>Organizing opportunities and campaigns</li>
                                <li>Important announcements and actions</li>
                            </ul>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                                We respect your privacy and will <strong>never</strong> share your information with third parties.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 30px;">
                            <hr style="border: none; border-top: 2px solid #DC143C; margin: 20px 0;">
                        </td>
                    </tr>
                    
                    <!-- Spanish Content -->
                    <tr>
                        <td style="padding: 20px 30px;">
                            <h2 style="color: #DC143C;">¡Bienvenido/a, {{ contact.NAME }}!</h2>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                                ¡Gracias por unirte a <strong>New Mexico Socialists</strong>! Estamos emocionados de tenerte como parte de nuestra comunidad que lucha por la justicia social y económica.
                            </p>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                                <strong>Recibirás actualizaciones sobre:</strong>
                            </p>
                            <ul style="color: #333333; font-size: 16px; line-height: 1.8;">
                                <li>Eventos y reuniones comunitarias en {{ contact.CITY }}, {{ contact.STATE }}</li>
                                <li>Recursos educativos y talleres</li>
                                <li>Oportunidades de organización y campañas</li>
                                <li>Anuncios importantes y acciones</li>
                            </ul>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 1.6;">
                                Respetamos tu privacidad y <strong>nunca</strong> compartiremos tu información con terceros.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Call-to-Action Button (Optional) -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <a href="https://newmexicosocialists.org" style="display: inline-block; background-color: #DC143C; color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 5px; font-size: 16px; font-weight: bold;">
                                Visit Our Website / Visita Nuestro Sitio
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-radius: 0 0 8px 8px;">
                            <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                                New Mexico Socialists<br>
                                Email: xava@newmexicosocialists.org
                            </p>
                            
                            <!-- Unsubscribe Link (REQUIRED for CAN-SPAM) -->
                            <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                                <a href="{{ unsubscribe }}" style="color: #999999; text-decoration: underline;">
                                    Unsubscribe / Darse de baja
                                </a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
    
</body>
</html>
```

**Brevo Variables to Use:**
- `{{ contact.NAME }}` - Subscriber's name
- `{{ contact.CITY }}` - Subscriber's city
- `{{ contact.STATE }}` - Subscriber's state
- `{{ unsubscribe }}` - Auto-generated unsubscribe link

**Save template** when complete.

### Monthly Newsletter Template

Create a flexible template for monthly updates:

1. **Create new template:** `Monthly Newsletter Template`
2. **Structure:**
   - **Header:** Logo + Month/Year
   - **Hero Section:** Main announcement or featured content
   - **Content Blocks:** 2-3 sections for news/events
   - **Action Section:** Upcoming events or volunteer opportunities
   - **Footer:** Contact info + social media + unsubscribe

**Key Design Elements:**
- Red/black color scheme
- Bold typography
- Clear hierarchy
- Mobile-responsive
- Images: protests, community gatherings, solidarity imagery

### Design Best Practices

✅ **DO:**
- Use single-column layout (mobile-friendly)
- Keep text concise and scannable
- Use bullet points and short paragraphs
- Include clear call-to-action buttons
- Test on multiple email clients
- Always include unsubscribe link

❌ **DON'T:**
- Use all caps (looks like spam)
- Overuse images (slow loading, may block)
- Use background images (poor email client support)
- Forget alt text for images
- Use tiny fonts (<14px body text)

**✅ Day 4 Complete!** Your email templates are ready to send.

---

## 📅 Day 5: Testing

### Pre-Launch Testing Checklist

#### Test 1: Send Test Email to Self

1. **Navigate to:** Campaigns → Create a campaign
2. **Choose:** Email campaign
3. **Select template:** `Welcome Email - Bilingual`
4. **Recipient:** Test list with just your email
5. **Send test email**
6. **Check inbox:**
   - ☑️ Subject line displays correctly
   - ☑️ From name shows "New Mexico Socialists"
   - ☑️ Content renders properly
   - ☑️ Personalization (NAME, CITY, STATE) works
   - ☑️ Links are clickable
   - ☑️ Unsubscribe link works
   - ☑️ Mobile view looks good

#### Test 2: Spam Score Check

1. **In Brevo campaign editor:** Check spam score indicator
2. **Use Mail-Tester.com:**
   - Send test email to address provided by Mail-Tester
   - Check score (aim for 8/10 or higher)
   - Fix any issues flagged
3. **Common spam triggers to avoid:**
   - ❌ All caps subject lines
   - ❌ Excessive exclamation marks!!!
   - ❌ Words like "FREE", "ACT NOW", "URGENT"
   - ❌ Poor text-to-image ratio
   - ❌ Broken links

#### Test 3: Multi-Provider Testing

Send test emails to different email providers:

| Provider | Test Email | Check |
|----------|-----------|-------|
| Gmail | your.test@gmail.com | ☑️ Inbox placement |
| Yahoo | your.test@yahoo.com | ☑️ Inbox placement |
| Outlook/Hotmail | your.test@outlook.com | ☑️ Inbox placement |
| ProtonMail | your.test@protonmail.com | ☑️ Inbox placement |

**Check for each:**
- Landed in inbox (not spam/promotions)
- Images display properly
- Links work correctly
- Mobile rendering

#### Test 4: Create Test Segment

1. **Navigate to:** Contacts → Segments
2. **Create segment:** `Test Group - Albuquerque`
3. **Filters:**
   - List: `New Mexico Socialists Members`
   - City: `Albuquerque`
   - Limit: 10 contacts
4. **Send campaign to this segment**
5. **Monitor results:**
   - Delivery rate (should be 95%+)
   - Open rate (check within 24 hours)
   - Click rate
   - Bounces (should be near 0%)

#### Test 5: Form Integration Test

1. **Submit test form** on your website
2. **Verify:**
   - ☑️ Form submits successfully
   - ☑️ Contact appears in Brevo within 1 minute
   - ☑️ All attributes populated correctly
   - ☑️ Added to correct list
3. **Check for duplicate handling:**
   - Submit same email again
   - Should update existing contact, not create duplicate

#### Test 6: Unsubscribe Flow

1. **Click unsubscribe link** in test email
2. **Verify:**
   - ☑️ Unsubscribe page loads
   - ☑️ Confirmation message shows
   - ☑️ Contact marked as unsubscribed in Brevo
   - ☑️ No longer receives emails

#### Test 7: Mobile Responsiveness

Test on actual mobile devices:
- iPhone (iOS Mail app)
- Android (Gmail app)
- Tablet

**Check:**
- Text is readable (not too small)
- Buttons are tappable (large enough)
- Images scale properly
- No horizontal scrolling

### Testing Summary

**Deliverability Checklist:**
- ☑️ Domain verified (SPF, DKIM)
- ☑️ Sender reputation good
- ☑️ Spam score 8/10+
- ☑️ Unsubscribe link present
- ☑️ Physical address in footer (optional for non-commercial)

**Quality Checklist:**
- ☑️ No typos or grammar errors
- ☑️ Links all work
- ☑️ Personalization accurate
- ☑️ Bilingual content correct
- ☑️ Images optimized (< 1MB total)
- ☑️ Mobile-friendly

**✅ Day 5 Complete!** Your email system is tested and verified.

---

## 📅 Day 6: Launch

### Send Welcome Email to All Members

#### Step 1: Create Welcome Campaign

1. **Navigate to:** Campaigns → Create a campaign
2. **Campaign type:** Email campaign
3. **Campaign name:** `Welcome Email - First Send`
4. **Select template:** `Welcome Email - Bilingual`

#### Step 2: Configure Campaign

**Recipients:**
- **List:** `New Mexico Socialists Members`
- **Exclude:** Any test segments used
- **Expected recipients:** (should show total member count)

**Subject Line:**
```
Welcome to New Mexico Socialists / Bienvenido ✊
```

**Preview Text:**
```
Thank you for joining our community / Gracias por unirte
```

**Sender:**
- **From name:** New Mexico Socialists
- **From email:** news@newmexicosocialists.org
- **Reply-to:** xava@newmexicosocialists.org

#### Step 3: Schedule or Send Immediately

**Recommended:** Schedule for optimal delivery time
- **Best time:** Tuesday or Wednesday, 10 AM - 2 PM Mountain Time
- **Avoid:** Monday mornings, Friday afternoons, weekends

**OR Send immediately** if time-sensitive.

#### Step 4: Monitor Real-Time Analytics

**Dashboard metrics to watch:**
- **Delivered:** Should be 95%+ within 1 hour
- **Opens:** Track first 24-48 hours (expect 15-30% open rate)
- **Clicks:** Track link engagement
- **Bounces:** Investigate any hard bounces (invalid emails)
- **Unsubscribes:** Normal to have 0.5-2% unsubscribe rate

#### Step 5: Review First Hour

**1 hour after send:**
1. **Check Brevo dashboard:** Campaigns → Reports
2. **Verify delivery rate:** Should be 90%+ delivered
3. **Check for issues:**
   - High bounce rate (>5%) - investigate email quality
   - No opens after 1 hour - check spam folder (send test to yourself)
   - Error messages in Brevo - contact support

#### Step 6: 24-Hour Review

**Metrics to review:**
- **Deliverability:** 95%+ is excellent
- **Open rate:** 15-30% is healthy for first email
- **Click rate:** 2-10% is good engagement
- **Unsubscribes:** <2% is normal

**Success Indicators:**
- ✅ Most emails delivered
- ✅ Decent open rate (shows good subject line)
- ✅ Few complaints or bounces
- ✅ No spam folder issues
- ✅ Positive responses from members

### Post-Launch Actions

1. **Clean bounce list:**
   - Remove hard bounces (invalid emails)
   - Keep soft bounces (temporary issues)
2. **Note feedback:**
   - Any member replies or questions
   - Suggestions for improvement
3. **Document learnings:**
   - What worked well
   - What to improve for next send

**✅ Day 6 Complete!** Your newsletter system is live and operational!

---

## 🔄 8. Ongoing Operations

### How to Send Monthly Newsletters

#### Preparation (2-3 days before send)

1. **Gather content:**
   - Upcoming events
   - Recent organizing wins
   - Educational resources
   - Calls to action
2. **Write copy:**
   - Keep it concise (300-500 words max)
   - Use clear headings
   - Include specific dates/locations
3. **Source images:**
   - Event photos (with permission)
   - Graphics with red/black theme
   - Optimize for web (< 200KB each)

#### Creating Campaign

1. **Navigate to:** Campaigns → Create campaign
2. **Choose:** Email campaign
3. **Template:** `Monthly Newsletter Template`
4. **Customize content:**
   - Update month/year in header
   - Add event details
   - Update call-to-action links
5. **Preview:** Test on desktop and mobile view

#### Sending Strategy

**Frequency:** Once per month (consistent schedule)
- **Recommended day:** First Tuesday of each month
- **Time:** 10 AM Mountain Time

**Segmentation Options:**
- **All members:** Standard monthly update
- **By location:** Albuquerque-specific events
- **By engagement:** Re-engagement campaign for inactive subscribers

#### Content Ideas

**Monthly newsletter sections:**
1. **Opening message** (50 words) - What's happening this month
2. **Featured event** (100 words) - Main organizing focus
3. **Community highlights** (100 words) - Recent wins or news
4. **Educational resource** (100 words) - Reading/video recommendation
5. **Action item** (50 words) - How members can help
6. **Upcoming events** (100 words) - Calendar for next 4 weeks

**Bilingual approach:**
- Either: Separate English/Spanish sections (like welcome email)
- Or: Alternate monthly (English one month, Spanish next)
- Or: Send two separate campaigns to segmented lists

### Best Practices

#### Timing

**Best days to send:**
- ✅ Tuesday (highest open rates)
- ✅ Wednesday (good engagement)
- ⚠️ Monday (lower opens - people catching up)
- ❌ Friday/Weekend (poor engagement)

**Best times:**
- ✅ 10 AM - 2 PM local time
- ⚠️ Early morning (6-8 AM) - OK for urgent updates
- ❌ Evening (after 6 PM) - lower opens

#### Frequency Guidelines

| Frequency | Best For | Risk |
|-----------|----------|------|
| Weekly | Active campaigns, high engagement orgs | Unsubscribes if too repetitive |
| Bi-weekly | Balanced approach | Good middle ground |
| **Monthly** | **Sustainable for most orgs** | **✅ RECOMMENDED** |
| Quarterly | Minimal updates | Risk losing connection |

**Additional emails OK for:**
- Urgent actions (protest, petition)
- Event reminders (1 week before)
- Breaking news affecting community

### Analytics Interpretation

#### Email Metrics Explained

**Delivery Rate:**
- **Good:** 95%+ delivered
- **Average:** 90-95%
- **Poor:** <90% (clean your list)

**Open Rate:**
- **Excellent:** 30%+
- **Good:** 20-30%
- **Average:** 15-20%
- **Low:** <15% (improve subject lines)

**Click Rate:**
- **Excellent:** 5%+
- **Good:** 2-5%
- **Average:** 1-2%
- **Low:** <1% (improve content/CTAs)

**Unsubscribe Rate:**
- **Normal:** <2% per campaign
- **Concerning:** 2-5% (review content quality)
- **Crisis:** >5% (major content/frequency issue)

**Bounce Rate:**
- **Good:** <2%
- **Average:** 2-5%
- **Poor:** >5% (clean list immediately)

#### How to Improve Metrics

**Boost Open Rates:**
- Compelling subject lines (curiosity, urgency, value)
- A/B test different subjects
- Consistent "From" name (build recognition)
- Optimize send time

**Boost Click Rates:**
- Clear call-to-action buttons
- Limit number of links (focus on 1-2 main actions)
- Compelling copy that drives action
- Mobile-friendly buttons (easy to tap)

**Reduce Unsubscribes:**
- Don't over-send (stick to monthly)
- Provide value in every email
- Segment by interest (send relevant content)
- Set expectations (what they'll receive)

---

## 🚀 9. Advanced Features

### Automation Workflows

**Use case:** Automated welcome series for new members

1. **Navigate to:** Automation → Create workflow
2. **Trigger:** Contact added to list "New Mexico Socialists Members"
3. **Actions:**
   - **Immediately:** Send welcome email
   - **Wait 7 days:** Send "Get Involved" email with action opportunities
   - **Wait 30 days:** Send "Monthly Roundup" template

**Benefits:** Consistent onboarding without manual work

### Segmentation Strategies

#### By Location

**Albuquerque Members:**
```
List: New Mexico Socialists Members
Filter: CITY contains "Albuquerque"
```
**Use for:** ABQ-specific events

**Santa Fe Members:**
```
List: New Mexico Socialists Members
Filter: CITY contains "Santa Fe"
```

**By State (for out-of-state supporters):**
```
List: New Mexico Socialists Members
Filter: STATE not equal to "New Mexico"
```

#### By Engagement

**Highly Engaged:**
```
Filter: Opened last 3 campaigns
```
**Use for:** Volunteer recruitment

**At Risk:**
```
Filter: Has NOT opened last 5 campaigns
```
**Use for:** Re-engagement campaign

### SMTP Relay for Transactional Emails

**Current system:** PHP `mail()` function for form submissions

**Upgrade option:** Use Brevo SMTP for better deliverability

**Benefits:**
- Higher delivery rates
- Better tracking
- Professional infrastructure

**Implementation:**
1. **Get SMTP credentials:** Settings → SMTP & API
2. **Update PHP mail configuration:**
   - Host: `smtp-relay.brevo.com`
   - Port: 587 (TLS)
   - Username: Your login email
   - Password: SMTP key (not API key)

---

## 🛠️ 10. Troubleshooting

### Domain Verification Issues

**Problem:** Domain verification fails after 48 hours

**Solutions:**
1. **Check DNS records:**
   ```bash
   # Check SPF record
   dig TXT newmexicosocialists.org
   
   # Check DKIM record
   dig TXT mail._domainkey.newmexicosocialists.org
   ```
2. **Verify correct values:** Compare with Brevo's provided records
3. **Check TTL:** May need to wait longer if TTL is high
4. **Clear DNS cache:** Try from different network
5. **Contact IONOS support:** Ask them to verify DNS changes

**Still not working?**
- Use default Brevo domain temporarily
- Sender will show `yourname@mail.brevo.com`

### Low Deliverability / Landing in Spam

**Symptoms:**
- Delivery rate <90%
- Low open rates (<10%)
- Members report not receiving emails

**Diagnosis:**
1. **Send test to yourself** - does it land in spam?
2. **Check spam score** with Mail-Tester.com
3. **Review bounce messages** in Brevo dashboard

**Solutions:**

**If landing in spam:**
- ✅ Verify domain (SPF, DKIM, DMARC)
- ✅ Remove spam trigger words from subject
- ✅ Include plain text version (Brevo auto-generates)
- ✅ Don't use URL shorteners
- ✅ Maintain good text-to-image ratio (60%+ text)

**If high bounce rate:**
- 🧹 Clean email list (remove obvious invalids)
- 🧹 Remove hard bounces after each campaign
- ✅ Use double opt-in for new signups (optional)

**If blacklisted:**
- Check: https://mxtoolbox.com/blacklists.aspx
- Follow delist procedures if found

### Form Integration Debugging

**Problem:** Contact not appearing in Brevo after form submit

**Debug steps:**

1. **Check PHP error logs:**
   ```bash
   tail -f /var/log/apache2/error.log
   # or
   tail -f /path/to/php-error.log
   ```

2. **Look for Brevo errors:**
   - Should see: `Brevo: Successfully added contact email@example.com`
   - Or error: `Brevo API error: HTTP XXX`

3. **Test API key manually:**
   ```bash
   curl -X GET "https://api.brevo.com/v3/account" \
        -H "accept: application/json" \
        -H "api-key: YOUR-API-KEY"
   ```
   Should return account info, not 401 Unauthorized

4. **Verify config.php:**
   - ✅ `BREVO_API_KEY` defined and correct
   - ✅ `BREVO_LIST_ID` is numeric, matches your list
   - ✅ No quotes around List ID

5. **Test with minimal code:**
   ```php
   <?php
   require 'config.php';
   
   $ch = curl_init('https://api.brevo.com/v3/account');
   curl_setopt($ch, CURLOPT_HTTPHEADER, [
       'api-key: ' . BREVO_API_KEY
   ]);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   
   $result = curl_exec($ch);
   echo $result; // Should show account details
   ?>
   ```

**Common issues:**
- ❌ API key expired/revoked - generate new one
- ❌ List ID incorrect - double-check in Brevo URL
- ❌ cURL not installed - install: `sudo apt-get install php-curl`
- ❌ Firewall blocking API calls - whitelist Brevo IPs

### API Rate Limits

**Brevo Free Plan Limits:**
- 300 emails/day
- API rate: 60 requests/minute

**If you hit limits:**

**Email limit (300/day):**
- ✅ Spread sends over multiple days
- ✅ Upgrade to Lite plan ($25/month for 20k emails)

**API rate limit:**
- ✅ Add delays between API calls if bulk importing
- ✅ Implement exponential backoff retry logic
- ✅ Cache contact checks to reduce API calls

### CSV Import Errors

**Problem:** Brevo rejects CSV import

**Common causes:**

1. **Encoding issue:**
   - ✅ Save CSV as UTF-8 (not UTF-8 BOM)
   - ✅ Use Excel: "CSV UTF-8 (Comma delimited)"

2. **Invalid email format:**
   - ❌ Contains spaces
   - ❌ Missing @ symbol
   - ❌ Invalid domain
   - ✅ Fix in database first

3. **Column mapping:**
   - ✅ First row MUST be headers
   - ✅ EMAIL column is required
   - ✅ Attribute names match exactly (case-sensitive)

4. **File size:**
   - Free plan: 100MB max
   - Solution: Split into multiple files if needed

**Test CSV structure:**
```csv
EMAIL,NAME,CITY,STATE,COUNTRY,ZIP_CODE
test@example.com,John Doe,Albuquerque,New Mexico,United States,87101
```

---

## 📚 11. Resources

### Official Brevo Documentation

- **Getting Started:** https://help.brevo.com/hc/en-us/categories/360000479140
- **API Documentation:** https://developers.brevo.com/
- **Email Best Practices:** https://www.brevo.com/blog/email-marketing-best-practices/
- **Deliverability Guide:** https://help.brevo.com/hc/en-us/articles/360000991960

### Email Marketing Best Practices

- **Litmus Email Resources:** https://www.litmus.com/resources
- **Really Good Emails (inspiration):** https://reallygoodemails.com/
- **Can Spam Act Compliance:** https://www.ftc.gov/tips-advice/business-center/guidance/can-spam-act-compliance-guide-business

### Nonprofit Email Benchmarks

**Average metrics for nonprofit emails:**
- Open rate: 25-30%
- Click rate: 2.5-3%
- Unsubscribe rate: 0.2-0.5%

**Source:** M+R Benchmarks Study

### Tools for Testing

- **Mail Tester:** https://www.mail-tester.com/ (spam score)
- **MXToolbox:** https://mxtoolbox.com/ (DNS/blacklist check)
- **Email on Acid:** https://www.emailonacid.com/ (rendering tests)

### Community Resources

- **r/emailmarketing** (Reddit community)
- **Email Geeks Slack** (professional community)
- **DSA National resources** (for socialist organizing)

---

## 📋 12. Admin Quick Reference

### Daily Tasks Cheat Sheet

**Nothing required daily!** Newsletter is mostly automated.

### Weekly Tasks (5 minutes)

1. **Check analytics:** Review last campaign performance
2. **Monitor list growth:** Note new subscribers
3. **Clean bounces:** Remove hard bounces from list

### Monthly Tasks (2 hours)

1. **Plan newsletter content** (30 min)
2. **Write and design email** (1 hour)
3. **Send and monitor** (30 min)

### Quick Links

| Task | Link |
|------|------|
| **Dashboard** | https://app.brevo.com/ |
| **Create Campaign** | Campaigns → Create |
| **View Contacts** | Contacts → Lists |
| **Check Analytics** | Campaigns → Reports |
| **Edit Templates** | Campaigns → Templates |
| **API Keys** | Settings → SMTP & API |

### Common Tasks Quick Guide

**Send a campaign:**
1. Campaigns → Create
2. Choose template
3. Select list
4. Schedule or send

**Add manual contact:**
1. Contacts → Add a contact
2. Fill email + attributes
3. Choose list
4. Save

**Export contacts:**
1. Contacts → Lists
2. Open list
3. Click "Export" button
4. Choose CSV format

**Check deliverability:**
1. Campaigns → Reports
2. Select campaign
3. View delivery metrics

### Emergency Contacts

**Brevo Support:**
- **Email:** support@brevo.com
- **Help Center:** https://help.brevo.com/
- **Response time:** 24-48 hours

**Technical Admin:**
- **Email:** xava@newmexicosocialists.org

### Monthly Checklist

```
Monthly Newsletter Checklist:
☐ Content drafted and reviewed
☐ Images optimized and uploaded
☐ Links tested (all clickable)
☐ Template personalization working
☐ Subject line A/B test (optional)
☐ Spam score checked (8/10+)
☐ Preview on mobile device
☐ Send test to yourself
☐ Schedule for Tuesday 10 AM MT
☐ Monitor first hour after send
☐ Review 24-hour metrics
☐ Clean bounce list
☐ Note learnings for next month
```

---

## 🎉 Congratulations!

You've successfully set up a **professional, zero-cost newsletter system** for New Mexico Socialists using Brevo!

### What You've Accomplished:

✅ **Professional email infrastructure** with domain verification  
✅ **Imported all existing members** into Brevo  
✅ **Automated contact sync** from website form  
✅ **Bilingual email templates** ready to send  
✅ **Tested and verified** deliverability  
✅ **Launched first welcome campaign** to all members  
✅ **Ongoing operations** plan for monthly newsletters  

### Next Steps:

1. **Send your first monthly newsletter** (first Tuesday next month)
2. **Monitor analytics** and improve based on data
3. **Engage with members** who reply to emails
4. **Grow your list** through organizing and events
5. **Build solidarity** through consistent communication

### Keep Building Power! ✊🚩

**Questions or issues?** Contact: xava@newmexicosocialists.org

---

**Document Version:** 2.0  
**Last Updated:** February 14, 2026  
**Prepared for:** New Mexico Socialists  
**Platform:** Brevo (Free Plan)  
**Status:** Production Ready ✅
