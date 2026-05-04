-- Add phone field to form_submissions table
-- This allows users to optionally provide their phone number
ALTER TABLE form_submissions 
ADD COLUMN phone VARCHAR(20) DEFAULT NULL AFTER email;
