-- Create customers table first since it's referenced by storage_locations
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  license_plate TEXT NOT NULL,
  summer_tire_size TEXT NOT NULL,
  winter_tire_size TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  storage_location_id UUID UNIQUE
);

-- Create storage_locations table
CREATE TABLE storage_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  hotel INTEGER NOT NULL,
  section TEXT NOT NULL,
  shelf TEXT NOT NULL,
  level INTEGER NOT NULL,
  position INTEGER NOT NULL,
  customer_id UUID UNIQUE REFERENCES customers(id)
);

-- Add foreign key constraint
ALTER TABLE customers 
ADD CONSTRAINT fk_storage_location 
FOREIGN KEY (storage_location_id) 
REFERENCES storage_locations(id);

-- Add indexes for better query performance
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_license_plate ON customers(license_plate);
CREATE INDEX idx_customers_status ON customers(status);