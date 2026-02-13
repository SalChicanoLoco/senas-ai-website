# Auto-Response Email and Unsubscribe System - Testing Guide

## Manual Testing Instructions

### Prerequisites
1. Database migration has been applied (run `database/migrations/add_unsubscribe_fields.sql`)
2. PHP mail() function is configured on the server
3. Form is accessible at the website

### Test 1: Form Submission with Welcome Email

**Steps:**
1. Navigate to the website's join form
2. Fill in all required fields:
   - Name: Test User
   - Email: your-test-email@example.com
   - Country: United States
   - State: New Mexico
   - City: Albuquerque
   - Zip: 87101
3. Submit the form

**Expected Results:**
- Success message appears: "Thanks for signing up! ¡Gracias por unirte!"
- Admin receives notification email at `xava@newmexicosocialists.org`
- Test user receives welcome email with:
  - Bilingual content (English and Spanish)
  - List of what they'll receive
  - Unsubscribe link at bottom

**Verify:**
- Check inbox for welcome email
- Verify email has proper headers (From, Reply-To)
- Confirm unsubscribe link is present

### Test 2: Unsubscribe Functionality

**Steps:**
1. From the welcome email received in Test 1, click the unsubscribe link
2. Observe the unsubscribe confirmation page

**Expected Results:**
- Page displays success message in both English and Spanish
- Shows "You Have Been Unsubscribed" with checkmark icon
- Displays the unsubscribed email address
- Shows contact information for questions

**Verify:**
- Page is mobile-responsive
- Icons have proper accessibility attributes
- Email address is displayed correctly
- Contact link works

### Test 3: Already Unsubscribed Status

**Steps:**
1. Click the same unsubscribe link again from Test 2
2. Observe the response

**Expected Results:**
- Page displays "Already Unsubscribed" message
- Shows information icon
- Bilingual content displayed
- Option to rejoin via contact email

**Verify:**
- No error occurs
- Clear messaging about status
- Contact information provided

### Test 4: Invalid Unsubscribe Token

**Steps:**
1. Navigate to `/unsubscribe.php?token=invalid123`
2. Observe the error page

**Expected Results:**
- Error page displays "Invalid unsubscribe token"
- Warning icon shown
- Bilingual error message
- Contact information provided

**Verify:**
- Graceful error handling
- No PHP errors displayed
- User-friendly messaging

### Test 5: Rate Limiting

**Steps:**
1. Visit unsubscribe page with different invalid tokens 11 times rapidly
2. Observe response on 11th request

**Expected Results:**
- After 10 attempts, receive "Too many requests" error (HTTP 429)
- Message: "Too many requests. Please try again later."

**Verify:**
- Rate limiting is working
- Counter resets after 1 hour

### Test 6: Database Verification

**Steps:**
1. After completing Test 1-2, check the database
2. Query: `SELECT email, unsubscribe_token, unsubscribed, unsubscribed_at FROM form_submissions WHERE email='your-test-email@example.com'`

**Expected Results:**
- Record exists with email from test
- `unsubscribe_token` is 64-character hex string
- `unsubscribed` is TRUE (1)
- `unsubscribed_at` has timestamp of when unsubscribe occurred

### Test 7: Security Testing

**Email Header Injection Test:**
1. Try submitting form with email: `test@test.com\r\nBcc:hacker@evil.com`
2. Check if injection is prevented

**SQL Injection Test:**
1. Try unsubscribe with token: `'; DROP TABLE form_submissions; --`
2. Verify database is not affected

**XSS Test:**
1. Try unsubscribe with malicious token containing `<script>alert('XSS')</script>`
2. Verify output is escaped

**Expected Results:**
- All injection attempts fail safely
- No malicious code executes
- Proper sanitization applied

### Test 8: Mobile Responsiveness

**Steps:**
1. Visit unsubscribe page on mobile device or use browser dev tools
2. Test with viewport sizes: 320px, 375px, 768px, 1024px

**Expected Results:**
- Page renders correctly at all sizes
- Text is readable without zooming
- Buttons/links are easily tappable
- No horizontal scrolling

## Automated Testing

Run the unit test suite:
```bash
php /tmp/test_email_system.php
```

**Expected Output:**
```
Testing Auto-Response Email and Unsubscribe System
=================================================

Test 1: Generate Unsubscribe Token
✓ All checks pass

Test 2: Build Unsubscribe URL
✓ URL format valid

Test 3: Email Sanitization
✓ Sanitization works

Test 4: Token Validation Pattern
✓ All validation checks pass

Test 5: Welcome Email Content
✓ All content checks pass
```

## Troubleshooting

### Welcome Email Not Received
1. Check PHP error logs: `tail -f /path/to/php_errors.log`
2. Look for: "Failed to send welcome email to: [email]"
3. Verify mail() function works: `php -r "mail('test@test.com', 'Test', 'Test');"`
4. Check spam folder

### Unsubscribe Link Not Working
1. Verify database migration ran successfully
2. Check token length in database (should be 64 chars)
3. Look for PHP errors in logs
4. Verify token in URL matches database

### Form Submission Fails
1. Check if database connection is working
2. Verify all required fields are filled
3. Check for duplicate email errors
4. Review PHP error logs

## Success Criteria

✅ Form submission creates database record with unsubscribe token
✅ Admin notification email sent
✅ Welcome email sent to subscriber with unsubscribe link
✅ Unsubscribe link works and updates database
✅ Already-unsubscribed status shown correctly
✅ Invalid tokens handled gracefully
✅ All security measures in place
✅ Bilingual content displays correctly
✅ Mobile-responsive design works
✅ No breaking changes to existing functionality
✅ CAN-SPAM Act compliant

## Performance Considerations

- Token generation uses cryptographically secure `random_bytes()`
- Database queries use prepared statements for security
- Indexes added for token and unsubscribe status lookups
- Rate limiting prevents abuse
- Email sending failures don't break form submission

## Post-Deployment Checklist

- [ ] Database migration executed successfully
- [ ] Test form submission on production
- [ ] Verify welcome email delivery
- [ ] Test unsubscribe functionality
- [ ] Check email deliverability (not marked as spam)
- [ ] Monitor PHP error logs for issues
- [ ] Verify mobile responsiveness
- [ ] Test with multiple email providers (Gmail, Yahoo, Outlook)
- [ ] Confirm List-Unsubscribe header works in email clients
- [ ] Document any production issues

## Notes

- Keep test emails for reference
- Save screenshots of each test scenario
- Document any edge cases discovered
- This is an interim solution; future migration to Listmonk planned
