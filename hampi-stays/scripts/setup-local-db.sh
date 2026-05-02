#!/bin/bash
# scripts/setup-local-db.sh
# Run this once to create your local PostgreSQL database.
# Usage: bash scripts/setup-local-db.sh

set -e

DB_NAME="hampistays_db"
DB_USER="hampistays"
DB_PASS="hampistays123"

echo "🐘 Setting up local PostgreSQL for HampiStays..."

# Create user and database
sudo -u postgres psql <<EOF
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
    RAISE NOTICE 'User $DB_USER created.';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
  WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo ""
echo "✅ Database ready!"
echo "   DB:   $DB_NAME"
echo "   User: $DB_USER"
echo "   Pass: $DB_PASS"
echo ""
echo "📌 Now run: npm run db:migrate -- --name init"
echo "   Then:    npm run db:seed"
