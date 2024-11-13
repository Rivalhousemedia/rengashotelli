import { createClient } from '@supabase/supabase-js'
import type { Customer, StorageLocation } from './supabase-types'

// Provide default values for development - replace these with your actual Supabase project values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not found in environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single()
  
  if (error) throw error
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