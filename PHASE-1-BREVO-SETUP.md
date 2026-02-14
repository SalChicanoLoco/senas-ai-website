# Brevo Newsletter Setup Guide

## Introduction
This document provides a comprehensive guide for setting up the Brevo (formerly Sendinblue) newsletter service, covering account creation, domain verification, member import, integration with PHP forms, bilingual email templates, testing procedures, and admin documentation.

## 1. Account Creation
- Go to the [Brevo website](https://www.brevo.com).
- Click on "Sign Up" and fill in your details.
- Verify your email address to activate your account.

## 2. Domain Verification
- In your Brevo dashboard, navigate to the domain settings.
- Add your domain and follow the instructions to verify it (typically involves adding TXT records to your DNS settings).
- Wait for confirmation of successful verification.

## 3. Member Import from MySQL
- Export your MySQL database entries as a CSV file.
- In Brevo, go to the Contacts section and click on "Import Contacts."
- Choose the CSV file and map the fields accordingly.

## 4. PHP Form Integration
- Create a PHP form for subscription:
  ```php
  <form action="YOUR_FORM_ACTION" method="POST">
      <input type="email" name="email" required placeholder="Enter your email">
      <button type="submit">Subscribe</button>
  </form>
  ```
- Use the Brevo API to add subscribers from this form to your Brevo account.

## 5. Bilingual Email Templates
- Design your emails using the Brevo email editor.
- Create templates in both languages (e.g., English and Spanish).
- Make use of Brevo’s dynamic content features to customize content based on user preferences.

## 6. Testing Procedures
- Send test emails to check functionality and layout.
- Verify that links, images, and dynamic content work as intended.
- Have team members review for correctness in both languages.

## 7. Admin Documentation
- Document procedures for managing subscribers, creating campaigns, and analyzing reports.
- Include troubleshooting steps for common issues such as email bounce backs or spam reports.