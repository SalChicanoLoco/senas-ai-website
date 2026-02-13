# Auto-Response Email and Unsubscribe System

## Overview
This implementation adds two critical email features to the New Mexico Socialists website:
1. Automatic welcome/confirmation email sent to new subscribers
2. One-click unsubscribe system compliant with CAN-SPAM Act

## Files Added/Modified

### New Files
1. **database/migrations/add_unsubscribe_fields.sql** - Database migration for unsubscribe tracking
2. **unsubscribe.php** - Unsubscribe request handler with bilingual UI
3. **EMAIL_SYSTEM_README.md** - This documentation file

### Modified Files
1. **submit-form.php** - Updated to generate tokens, send welcome emails, and store unsubscribe tokens

## Database Migration

Before using the new features, run the database migration:

```bash
# Via phpMyAdmin:
# 1. Log in to IONOS phpMyAdmin
# 2. Select your database
# 3. Go to "Import" tab
# 4. Choose database/migrations/add_unsubscribe_fields.sql
# 5. Click "Go"
```

The migration adds three new columns to `form_submissions`:
- `unsubscribed` (BOOLEAN) - Tracks if user has unsubscribed
- `unsubscribe_token` (VARCHAR(64)) - Unique token for unsubscribe links
- `unsubscribed_at` (TIMESTAMP) - When user unsubscribed

## Features

### 1. Welcome Email
When someone submits the join form:
- Admin receives notification (existing functionality)
- Subscriber receives bilingual welcome email
- Welcome email includes:
  - Warm greeting in English and Spanish
  - Information about what they'll receive
  - Clear unsubscribe link at bottom
  - CAN-SPAM compliant headers

### 2. Unsubscribe System
- Each email contains a unique, secure unsubscribe link
- One-click unsubscribe process
- Bilingual confirmation page
- Rate limiting to prevent abuse
- Handles edge cases (already unsubscribed, invalid tokens)

## Security Features

### Token Security
- Cryptographically secure tokens using `random_bytes(32)`
- 64-character hexadecimal tokens
- Unique per subscriber
- Validated with regex pattern

### Email Security
- Header injection prevention
- Input sanitization
- XSS protection on all output
- SQL injection prevention with prepared statements

### Rate Limiting
- Session-based rate limiting on unsubscribe.php
- Max 10 attempts per hour per session
- Prevents abuse and DOS attacks

## CAN-SPAM Compliance

The implementation follows CAN-SPAM Act requirements:
- Clear "From" identification
- Honest subject line
- Physical address in footer
- Clear unsubscribe mechanism
- `List-Unsubscribe` header for email clients
- Prompt processing of unsubscribe requests

## Email Headers

### Welcome Email Headers
```
From: New Mexico Socialists Website <noreply@newmexicosocialists.org>
Reply-To: xava@newmexicosocialists.org
Content-Type: text/plain; charset=UTF-8
List-Unsubscribe: <https://newmexicosocialists.org/unsubscribe.php?token=...>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

## Error Handling

### Form Submission
- Welcome email failures are logged but don't break form submission
- Database errors are caught and user-friendly messages shown
- Duplicate email submissions are handled gracefully

### Unsubscribe Page
- Invalid tokens show appropriate error messages
- Database errors are caught and logged
- Already-unsubscribed status is shown clearly
- All messages are bilingual

## Testing

### Manual Testing Checklist
- [ ] Submit form and verify welcome email received
- [ ] Check welcome email contains unsubscribe link
- [ ] Click unsubscribe link and verify success page
- [ ] Try unsubscribe link again (should show "already unsubscribed")
- [ ] Test with invalid token (should show error)
- [ ] Verify admin notification still works
- [ ] Test on mobile device (responsive design)
- [ ] Check email deliverability

### Automated Tests
Run the test script:
```bash
php /tmp/test_email_system.php
```

## Troubleshooting

### Welcome Email Not Sending
1. Check PHP error logs: `error_log()` calls will log failures
2. Verify email configuration in `config.php`
3. Check mail server settings on IONOS
4. Test with a simple mail() call

### Unsubscribe Link Not Working
1. Verify database migration ran successfully
2. Check that `unsubscribe_token` column exists
3. Verify token in database matches URL parameter
4. Check PHP error logs for database errors

### Database Migration Errors
If migration fails:
1. Check if columns already exist
2. Verify database user has ALTER privileges
3. Run queries individually to isolate issue

## Future Enhancements

Planned for future migration to Listmonk:
- Advanced email templates
- Campaign management
- Analytics and tracking
- Subscriber segmentation
- Scheduled newsletters
- A/B testing

## Support

For technical issues:
- Email: xava@newmexicosocialists.org
- Check PHP error logs on server
- Review database for data integrity

## License

Part of New Mexico Socialists website project.
