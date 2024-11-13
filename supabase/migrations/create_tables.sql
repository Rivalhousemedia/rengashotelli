-- First drop existing tables if they exist (in reverse order of creation to handle foreign keys)
DROP TABLE IF EXISTS storage_locations CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Create customers table first since it's referenced by storage_locations
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  license_plate TEXT NOT NULL UNIQUE,
  summer_tire_size TEXT NOT NULL,
  winter_tire_size TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  UNIQUE(name)
);

-- Create storage_locations table with a single relationship to customers
CREATE TABLE storage_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  hotel INTEGER NOT NULL,
  section TEXT NOT NULL,
  shelf TEXT NOT NULL,
  level INTEGER NOT NULL,
  position INTEGER NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  UNIQUE(hotel, section, shelf)
);

-- Add indexes for better query performance
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_license_plate ON customers(license_plate);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_storage_locations_customer_id ON storage_locations(customer_id);