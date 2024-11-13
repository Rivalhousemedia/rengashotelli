import { supabase } from './supabaseClient'
import type { Customer } from '../types'

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at'>) {
  const { data: existingCustomers } = await supabase
    .from('customers')
    .select()
    .or(
      `name.eq.${customer.name},` +
      `license_plate.eq.${customer.licensePlate},` +
      `phone.eq.${customer.phone},` +
      `email.eq.${customer.email}`
    );

  if (existingCustomers && existingCustomers.length > 0) {
    throw new Error('A customer with the same name, license plate, phone, or email already exists');
  }

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
    .select(`
      *,
      storage_locations!storage_locations_customer_id_fkey (
        hotel,
        section,
        shelf,
        level,
        position
      )
    `)
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
    storageLocation: customer.storage_locations ? {
      hotel: customer.storage_locations.hotel,
      section: customer.storage_locations.section,
      shelf: customer.storage_locations.shelf,
      level: customer.storage_locations.level,
      position: customer.storage_locations.position,
    } : undefined
  }))
}