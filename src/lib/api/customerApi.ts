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
  
  // Transform the data from snake_case to camelCase
  return {
    id: data.id,
    name: data.name,
    licensePlate: data.license_plate,
    summerTireSize: data.summer_tire_size,
    winterTireSize: data.winter_tire_size,
    phone: data.phone,
    email: data.email,
    status: data.status as 'active' | 'interim' | 'inactive'
  }
}

export async function searchCustomers(query: string) {
  console.log("=== API searchCustomers Start ===");
  console.log("Received query:", query);
  
  const locationMatch = query.match(/H(\d+)-([A-Z])-(\d+)/i);
  
  let supabaseQuery = supabase
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
    `);

  if (locationMatch) {
    console.log("Location match found:", locationMatch);
    const [, hotel, section, shelf] = locationMatch;
    supabaseQuery = supabaseQuery
      .eq('storage_locations.hotel', hotel)
      .eq('storage_locations.section', section)
      .eq('storage_locations.shelf', shelf);
  } else {
    console.log("Using name/license plate search");
    supabaseQuery = supabaseQuery.or(
      `name.ilike.%${query}%,license_plate.ilike.%${query}%`
    );
  }

  console.log("Executing Supabase query...");
  const { data, error } = await supabaseQuery.limit(10);

  if (error) {
    console.error('Supabase query error:', error);
    throw error;
  }

  console.log("Raw Supabase response:", data);

  const mappedData = data.map(customer => ({
    id: customer.id,
    name: customer.name,
    licensePlate: customer.license_plate,
    summerTireSize: customer.summer_tire_size,
    winterTireSize: customer.winter_tire_size,
    phone: customer.phone,
    email: customer.email,
    status: customer.status as 'active' | 'interim' | 'inactive',
    storageLocation: customer.storage_locations?.[0] ? {
      hotel: customer.storage_locations[0].hotel,
      section: customer.storage_locations[0].section,
      shelf: customer.storage_locations[0].shelf,
      level: customer.storage_locations[0].level,
      position: customer.storage_locations[0].position,
    } : undefined
  }));

  console.log("Mapped response data:", mappedData);
  console.log("=== API searchCustomers End ===");
  
  return mappedData;
}

export async function getCustomerById(id: string) {
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
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    licensePlate: data.license_plate,
    summerTireSize: data.summer_tire_size,
    winterTireSize: data.winter_tire_size,
    phone: data.phone,
    email: data.email,
    status: data.status as 'active' | 'interim' | 'inactive',
    storageLocation: data.storage_locations ? {
      hotel: data.storage_locations.hotel,
      section: data.storage_locations.section,
      shelf: data.storage_locations.shelf,
      level: data.storage_locations.level,
      position: data.storage_locations.position,
    } : undefined
  };
}

export async function updateCustomer(id: string, customer: Partial<Customer>) {
  const { error } = await supabase
    .from('customers')
    .update({
      name: customer.name,
      license_plate: customer.licensePlate,
      summer_tire_size: customer.summerTireSize,
      winter_tire_size: customer.winterTireSize,
      phone: customer.phone,
      email: customer.email,
      status: customer.status
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}
