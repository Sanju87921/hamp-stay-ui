-- Migration: add provider-agnostic payment fields and RefundRequest table
-- Run this SQL against your database (psql) after backing up.

-- 1) Create enum for refund status
CREATE TYPE IF NOT EXISTS refund_status AS ENUM ('PENDING','APPROVED','DECLINED','PROCESSED');

-- 2) Add provider fields to payments table
ALTER TABLE IF EXISTS payments
  ADD COLUMN IF NOT EXISTS provider TEXT,
  ADD COLUMN IF NOT EXISTS provider_order_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS provider_payload JSONB,
  ADD COLUMN IF NOT EXISTS provider_status TEXT,
  ADD COLUMN IF NOT EXISTS provider_created_at TIMESTAMP;

-- 3) Unique indexes for provider ids (Postgres allows multiple NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_order_id_key ON payments (provider_order_id);
CREATE UNIQUE INDEX IF NOT EXISTS payments_provider_payment_id_key ON payments (provider_payment_id);

-- 4) Create refund_requests table
CREATE TABLE IF NOT EXISTS refund_requests (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  requester_id TEXT NOT NULL,
  reason TEXT,
  status refund_status DEFAULT 'PENDING' NOT NULL,
  processed_by TEXT,
  payout_reference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL
);

-- 5) Foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'refund_requests_booking_id_fkey'
  ) THEN
    ALTER TABLE refund_requests
      ADD CONSTRAINT refund_requests_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'refund_requests_requester_id_fkey'
  ) THEN
    ALTER TABLE refund_requests
      ADD CONSTRAINT refund_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'refund_requests_processed_by_fkey'
  ) THEN
    ALTER TABLE refund_requests
      ADD CONSTRAINT refund_requests_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES users(id);
  END IF;
END$$;

-- 6) Migrate existing razorpay ids into provider fields (idempotent)
UPDATE payments
SET provider = COALESCE(provider, 'razorpay')
WHERE (provider IS NULL) AND (razorpayOrderId IS NOT NULL OR razorpayPaymentId IS NOT NULL);

UPDATE payments
SET provider_order_id = COALESCE(provider_order_id, razorpayOrderId)
WHERE provider_order_id IS NULL AND razorpayOrderId IS NOT NULL;

UPDATE payments
SET provider_payment_id = COALESCE(provider_payment_id, razorpayPaymentId)
WHERE provider_payment_id IS NULL AND razorpayPaymentId IS NOT NULL;

-- EOF
