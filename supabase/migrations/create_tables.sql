-- Create customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  license_plate TEXT NOT NULL,
  tire_size TEXT NOT NULL,
  storage_location_id UUID REFERENCES storage_locations(id)
);

-- Create storage_locations table first since it's referenced by customers
CREATE TABLE storage_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  hotel INTEGER NOT NULL,
  section TEXT NOT NULL,
  shelf INTEGER NOT NULL,
  position INTEGER NOT NULL,
  customer_id UUID UNIQUE REFERENCES customers(id)
);

-- Add indexes for better query performance
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_license_plate ON customers(license_plate);