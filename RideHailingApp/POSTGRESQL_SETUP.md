# 🐘 PostgreSQL Setup Guide - Replacing Supabase

This guide will help you set up a standalone PostgreSQL database with PostGIS to replace Supabase in your ride-hailing app.

## 📋 Prerequisites

- PostgreSQL 14+ installed
- Node.js 16+ installed
- npm or yarn package manager

## 🔧 1. Install Required Dependencies

```bash
cd RideHailingApp
npm install pg @types/pg crypto-js
```

## 🗄️ 2. PostgreSQL Installation

### Option A: Local Installation

#### macOS (using Homebrew)
```bash
brew install postgresql@14 postgis
brew services start postgresql@14
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql-14 postgresql-14-postgis-3 postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Windows
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Install with PostGIS extension
3. Start PostgreSQL service

### Option B: Docker Installation (Recommended for Development)

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:14-3.2
    container_name: rideapp_postgres
    environment:
      POSTGRES_DB: rideapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password_here
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    restart: unless-stopped

volumes:
  postgres_data:
```

Start with Docker:
```bash
docker-compose up -d
```

## 🔑 3. Database Setup

### Create Database and User
```sql
-- Connect as postgres user
psql -U postgres

-- Create database
CREATE DATABASE rideapp;

-- Create user (if needed)
CREATE USER rideapp_user WITH PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE rideapp TO rideapp_user;

-- Connect to the database
\c rideapp;
```

### Enable PostGIS Extension
```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Verify installation
SELECT PostGIS_Version();
```

## 📊 4. Database Schema

Run the complete schema from `MVP_SETUP.md`:

```bash
# Save the schema to a file
psql -U postgres -d rideapp -f database_schema.sql
```

Or execute the SQL directly:

```sql
-- Drop existing tables to recreate with PostGIS
DROP TABLE IF EXISTS ride_reviews, rides, drivers, saved_places, payment_methods, vehicle_info, users CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom types
CREATE TYPE user_type AS ENUM ('rider', 'driver');
CREATE TYPE ride_status AS ENUM ('requested', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled');
CREATE TYPE vehicle_type AS ENUM ('economy', 'comfort', 'premium', 'xl');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'digital_wallet');

-- Users table (with password_hash for custom auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL,
  phone VARCHAR,
  name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  user_type user_type NOT NULL DEFAULT 'rider',
  push_token VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicle information
CREATE TABLE vehicle_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  year INTEGER NOT NULL,
  color VARCHAR NOT NULL,
  license_plate VARCHAR NOT NULL UNIQUE,
  vehicle_type vehicle_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drivers table with PostGIS location
CREATE TABLE drivers (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  vehicle_info_id UUID REFERENCES vehicle_info(id),
  license_number VARCHAR NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT FALSE,
  current_location GEOMETRY(POINT, 4326),
  location_updated_at TIMESTAMP WITH TIME ZONE,
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_rides INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rest of the schema... (continue with the complete schema from MVP_SETUP.md)
```

## 🔐 5. Environment Configuration

Update your `.env` file:

```env
# PostgreSQL Database Configuration
EXPO_PUBLIC_DB_HOST=localhost
EXPO_PUBLIC_DB_PORT=5432
EXPO_PUBLIC_DB_NAME=rideapp
EXPO_PUBLIC_DB_USER=postgres
EXPO_PUBLIC_DB_PASSWORD=your_password_here
EXPO_PUBLIC_DB_SSL=false

# JWT Secret for Authentication
EXPO_PUBLIC_JWT_SECRET=your-super-secure-jwt-secret-key-here

# Keep existing Google Maps, etc.
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
# ... other existing environment variables
```

## 🔧 6. Application Configuration

### Update package.json
```json
{
  "dependencies": {
    "pg": "^8.11.3",
    "@types/pg": "^8.10.7",
    "crypto-js": "^4.1.1"
  }
}
```

### Database Connection Test
Create `test-db-connection.js`:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'rideapp',
  user: 'postgres',
  password: 'your_password_here',
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected successfully!');
    console.log('Current time:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await pool.end();
  }
}

testConnection();
```

Run test:
```bash
node test-db-connection.js
```

## 🚀 7. Migration from Supabase

### Data Export from Supabase (if you have existing data)

1. **Export data from Supabase dashboard**:
   - Go to Table Editor
   - Export each table as CSV

2. **Import data to PostgreSQL**:
```sql
-- Example for users table
COPY users FROM '/path/to/users.csv' DELIMITER ',' CSV HEADER;
```

### Remove Supabase Dependencies
```bash
npm uninstall @supabase/supabase-js
```

Update any remaining imports in your code:
```typescript
// Replace all instances of:
import { supabase } from '../services/supabase';

// With:
import { DatabaseUtils, db } from '../services/database';
```

## 🔒 8. Security Setup

### Create Database Roles
```sql
-- Create read-only role for analytics
CREATE ROLE analytics_user WITH LOGIN PASSWORD 'analytics_password';
GRANT CONNECT ON DATABASE rideapp TO analytics_user;
GRANT USAGE ON SCHEMA public TO analytics_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_user;

-- Create app role with limited permissions
CREATE ROLE app_user WITH LOGIN PASSWORD 'app_password';
GRANT CONNECT ON DATABASE rideapp TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;
```

### Enable SSL (Production)
```sql
-- In postgresql.conf
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

Update connection string for production:
```env
EXPO_PUBLIC_DB_SSL=true
```

## 📊 9. Monitoring and Maintenance

### Create Monitoring Views
```sql
-- Active connections
CREATE VIEW active_connections AS
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  query
FROM pg_stat_activity
WHERE state != 'idle';

-- Database size monitoring
CREATE VIEW db_size_info AS
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Backup Script
```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/path/to/backups"
DB_NAME="rideapp"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -U postgres -h localhost $DB_NAME > $BACKUP_DIR/rideapp_backup_$DATE.sql
```

### Performance Tuning
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM find_nearby_drivers(40.7128, -74.0060, 10);

-- Update table statistics
ANALYZE users;
ANALYZE rides;
ANALYZE drivers;
```

## 🧪 10. Testing

### Test Authentication
```bash
# Test user registration
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password","name":"Test User","user_type":"rider"}'
```

### Test Database Functions
```sql
-- Test PostGIS functions
SELECT * FROM find_nearby_drivers(40.7128, -74.0060, 10);
SELECT * FROM calculate_route_info(40.7128, -74.0060, 40.7580, -73.9855);
SELECT get_surge_multiplier(40.7128, -74.0060);
```

## 🔧 11. Production Deployment

### Cloud PostgreSQL Options

1. **AWS RDS PostgreSQL**
2. **Google Cloud SQL for PostgreSQL**
3. **Azure Database for PostgreSQL**
4. **DigitalOcean Managed Databases**
5. **Railway PostgreSQL**
6. **Render PostgreSQL**

### Example Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add postgresql
railway deploy
```

## ✅ 12. Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] PostGIS extension enabled
- [ ] Database schema created
- [ ] Environment variables configured
- [ ] Database connection test passes
- [ ] Authentication service working
- [ ] PostGIS functions working
- [ ] Real-time polling working
- [ ] App connects successfully
- [ ] All features functional

## 🆘 Troubleshooting

### Common Issues

1. **Connection refused**
   ```bash
   # Check if PostgreSQL is running
   pg_isready -h localhost -p 5432
   
   # Start PostgreSQL service
   sudo systemctl start postgresql  # Linux
   brew services start postgresql   # macOS
   ```

2. **Permission denied**
   ```sql
   -- Grant permissions
   GRANT ALL PRIVILEGES ON DATABASE rideapp TO your_user;
   ```

3. **PostGIS not found**
   ```sql
   -- Install PostGIS extension
   CREATE EXTENSION postgis;
   ```

4. **Function not found**
   ```sql
   -- Recreate functions from schema
   \i database_functions.sql
   ```

Your ride-hailing app is now running with PostgreSQL instead of Supabase! 🎉

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [Node.js pg Documentation](https://node-postgres.com/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)