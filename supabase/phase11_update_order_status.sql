-- This migration adds the missing order statuses to the order_status ENUM
-- 'processing', 'returned', and 'refunded' were added to the frontend but not the database ENUM

-- Note: ALTER TYPE cannot be run inside a transaction block.

ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'processing';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'returned';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'refunded';
