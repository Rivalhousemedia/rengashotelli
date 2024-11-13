import { createClient } from '@supabase/supabase-js'
import type { Customer, StorageLocation } from './types'

const supabaseUrl = 'https://asvbflcyaspdrhihjmcg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdmJmbGN5YXNwZHJoaWhqbWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MzA0NzEsImV4cCI6MjA0NzEwNjQ3MX0.4J3SmtC2C0xzTJO02e4LH8fI2HEwgEHMwsC42B1gK1k'

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert([{
      name: customer.name,
      license_plate: customer.licensePlate,
      summer_tire_size: customer.summerTireSize,
      winter_tire_size: customer.winterTireSize,
      phone: customer.phone,
      email: customer.email,
      status: customer.status
    }])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating customer:', error)
    throw error
  }
  
  return data
}

export async function searchCustomers(query: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`name.ilike.%${query}%,license_plate.ilike.%${query}%`)
    .limit(10)

  if (error) {
    console.error('Error searching customers:', error)
    throw error
  }

  return data.map(customer => ({
    id: customer.id,
    name: customer.name,
    licensePlate: customer.license_plate,
    summerTireSize: customer.summer_tire_size,
    winterTireSize: customer.winter_tire_size,
    phone: customer.phone,
    email: customer.email,
    status: customer.status as 'active' | 'interim' | 'inactive',
  }))
}

export async function getCustomersWithLocations() {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      storage_locations (
        hotel,
        section,
        shelf,
        level,
        position
      )
    `)
    .not('storage_locations', 'is', null);

  if (error) {
    console.error('Error fetching customers with locations:', error);
    throw error;
  }

  return data.map(customer => ({
    id: customer.id,
    name: customer.name,
    licensePlate: customer.license_plate,
    summerTireSize: customer.summer_tire_size,
    winterTireSize: customer.winter_tire_size,
    phone: customer.phone,
    email: customer.email,
    status: customer.status as 'active' | 'interim' | 'inactive',
    storageLocation: customer.storage_locations ? {
      hotel: customer.storage_locations.hotel,
      section: customer.storage_locations.section,
      shelf: customer.storage_locations.shelf,
      level: customer.storage_locations.level,
      position: customer.storage_locations.position,
    } : undefined
  }));
}

export async function updateStorageLocation(
  customerId: string,
  location: Omit<StorageLocation, 'id' | 'created_at' | 'customer_id'>
) {
  const { data, error } = await supabase
    .from('storage_locations')
    .upsert({
      customer_id: customerId,
      ...location,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getCustomerLocation(customerId: string) {
  const { data, error } = await supabase
    .from('storage_locations')
    .select('*')
    .eq('customer_id', customerId)
    .single()

  if (error) throw error
  return data
}
