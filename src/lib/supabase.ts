import { createClient } from '@supabase/supabase-js'
import type { Customer, StorageLocation } from './supabase-types'

const supabaseUrl = 'https://asvbflcyaspdrhihjmcg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdmJmbGN5YXNwZHJoaWhqbWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MzA0NzEsImV4cCI6MjA0NzEwNjQ3MX0.4J3SmtC2C0xzTJO02e4LH8fI2HEwgEHMwsC42B1gK1k'

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
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

  if (error) throw error
  return data
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