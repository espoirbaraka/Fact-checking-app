#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS vector;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    SELECT 'CREATE DATABASE fact_checking_ai'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fact_checking_ai')\gexec
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "fact_checking_ai" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS vector;
EOSQL
