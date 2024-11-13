import { supabase } from './api/supabaseClient';
import type { Customer } from './types';

export async function createCustomer(customerData: Omit<Customer, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert([{
      name: customerData.name,
      license_plate: customerData.licensePlate,
      summer_tire_size: customerData.summerTireSize,
      winter_tire_size: customerData.winterTireSize,
      phone: customerData.phone,
      email: customerData.email,
      status: customerData.status
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating customer:', error);
    throw error;
  }

  // Parse the location code if it exists
  const locationMatch = customerData.storageLocation?.toString().match(/H(\d+)-([A-Z])-(\d+)/);
  
  if (locationMatch) {
    const [, hotel, section, shelf] = locationMatch;
    
    // Assign the location
    const { error: locationError } = await supabase
      .from('storage_locations')
      .insert([{
        customer_id: data.id,
        hotel: parseInt(hotel),
        section: section,
        shelf: shelf,
        level: 1,
        position: 1
      }]);

    if (locationError) {
      console.error('Error assigning location:', locationError);
      throw locationError;
    }
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
    storageLocation: locationMatch ? {
      hotel: parseInt(locationMatch[1]),
      section: locationMatch[2],
      shelf: locationMatch[3],
      level: 1,
      position: 1
    } : undefined
  };
}