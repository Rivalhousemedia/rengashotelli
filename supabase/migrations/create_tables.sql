-- Create customers table first since it's referenced by storage_locations
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  license_plate TEXT NOT NULL,
  tire_size TEXT NOT NULL
);

-- Create storage_locations table
CREATE TABLE storage_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  hotel INTEGER NOT NULL,
  section TEXT NOT NULL,
  shelf INTEGER NOT NULL,
  position INTEGER NOT NULL,
  customer_id UUID UNIQUE REFERENCES customers(id)
);

-- Add the storage_location_id to customers table after storage_locations exists
ALTER TABLE customers 
ADD COLUMN storage_location_id UUID REFERENCES storage_locations(id);

-- Add indexes for better query performance
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_license_plate ON customers(license_plate);