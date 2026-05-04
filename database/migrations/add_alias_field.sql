-- Add alias field to form_submissions table
-- This allows users to provide an alias/username instead of their real name
ALTER TABLE form_submissions 
ADD COLUMN alias VARCHAR(100) DEFAULT NULL AFTER name;
