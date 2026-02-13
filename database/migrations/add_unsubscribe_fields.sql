-- Migration: Add unsubscribe fields to form_submissions table
-- Purpose: Support email unsubscribe functionality and track unsubscribe status
-- Date: 2026-02-13

-- Add unsubscribe tracking columns
ALTER TABLE `form_submissions` 
ADD COLUMN `unsubscribed` BOOLEAN DEFAULT FALSE AFTER `ip_address`,
ADD COLUMN `unsubscribe_token` VARCHAR(64) UNIQUE AFTER `unsubscribed`,
ADD COLUMN `unsubscribed_at` TIMESTAMP NULL DEFAULT NULL AFTER `unsubscribe_token`;

-- Add index on unsubscribe_token for faster lookups
CREATE INDEX `idx_unsubscribe_token` ON `form_submissions` (`unsubscribe_token`);

-- Add index on unsubscribed status for filtering
CREATE INDEX `idx_unsubscribed` ON `form_submissions` (`unsubscribed`);
