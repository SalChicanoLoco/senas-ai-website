# Post-Deployment Database Setup

After deploying the code to IONOS, you need to initialize the database for form submissions to work.

## Method 1: Automated Setup (Recommended)

1. Find your SETUP_KEY in the `config.php` file (or set it via environment variables)
2. Visit: `https://newmexicosocialists.org/api/setup-database.php?key=YOUR_SETUP_KEY_HERE`
   (Replace YOUR_SETUP_KEY_HERE with the actual value from config.php)
3. You should see a success message like:
   ```json
   {
     "success": true,
     "message": "Database setup complete!",
     "table": "form_submissions",
     "status": "ready"
   }
   ```

4. Verify the setup by visiting: `https://newmexicosocialists.org/api/health-check.php`
   
   You should see all checks passing:
   ```json
   {
     "success": true,
     "status": "healthy",
     "checks": {
       "config": { "status": "pass" },
       "connection": { "status": "pass" },
       "table": { "status": "pass", "rows": 0 }
     }
   }
   ```

## Method 2: Manual Setup via phpMyAdmin

If the automated setup doesn't work:

1. Log in to IONOS control panel
2. Navigate to **Databases** → **MySQL Databases**
3. Click **phpMyAdmin** for your database
4. Click **Import** tab
5. Choose `database-schema.sql` file
6. Click **Go** to import
7. Verify `form_submissions` table exists

## Troubleshooting

### Form submissions fail with error messages

**Check database status:**
```
https://newmexicosocialists.org/api/health-check.php
```

If the health check shows:
- `config: fail` → Database credentials in `config.php` are incorrect
- `connection: fail` → Cannot connect to database server
- `table: fail` → Table doesn't exist, run setup-database.php

### Member counter shows "--"

This happens when:
1. Database table doesn't exist (run setup-database.php)
2. Database connection fails (check credentials)
3. Table exists but is empty (this is normal for new installations)

## Security Notes

- The `SETUP_KEY` in `config.php` prevents unauthorized database initialization
- After running setup once, you can remove the `api/setup-database.php` file for added security
- The health check endpoint reveals database status but not sensitive data

## Testing Form Submission

After setup:

1. Visit: `https://newmexicosocialists.org/#join`
2. Fill out the form with test data
3. Click "¡Únete! / Join Us!"
4. You should see: "Thanks for signing up! ¡Gracias por unirte!"
5. Verify in health check that rows count increased

## Support

If you encounter issues:
- Check the health check endpoint for diagnostic info
- Check browser console for JavaScript errors
- Check IONOS error logs in the control panel
- Email: xava@newmexicosocialists.org
