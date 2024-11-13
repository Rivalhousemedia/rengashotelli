import { supabase } from './supabaseClient'
import type { StorageLocation } from '../types'

export async function getCustomersWithLocations() {
  console.log("Fetching customers with locations");
  const { data, error } = await supabase
    .from('customers')
    .select(`
      id,
      name,
      license_plate,
      summer_tire_size,
      winter_tire_size,
      phone,
      email,
      status,
      storage_locations!storage_locations_customer_id_fkey (
        hotel,
        section,
        shelf,
        level,
        position
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers with locations:', error);
    throw error;
  }

  const mappedData = data.map(customer => ({
    id: customer.id,
    name: customer.name,
    licensePlate: customer.license_plate,
    summerTireSize: customer.summer_tire_size,
    winterTireSize: customer.winter_tire_size,
    phone: customer.phone,
    email: customer.email,
    status: customer.status as 'active' | 'interim' | 'inactive',
    storageLocation: customer.storage_locations ? {
      hotel: parseInt(customer.storage_locations[0]?.hotel),
      section: customer.storage_locations[0]?.section,
      shelf: customer.storage_locations[0]?.shelf,
      level: customer.storage_locations[0]?.level,
      position: customer.storage_locations[0]?.position,
    } : undefined
  }));

  console.log("Fetched and mapped customers:", mappedData);
  return mappedData;
}

export async function assignStorageLocation(
  customerId: string,
  location: Omit<StorageLocation, 'id' | 'created_at'> | null
) {
  console.log("Assigning storage location:", { customerId, location });

  if (!location) {
    console.log("Removing storage location for customer:", customerId);
    const { error } = await supabase
      .from('storage_locations')
      .delete()
      .eq('customer_id', customerId);

    if (error) {
      console.error('Error removing storage location:', error);
      throw error;
    }
    return null;
  }

  const { data: existingLocations, error: fetchError } = await supabase
    .from('storage_locations')
    .select()
    .eq('customer_id', customerId);

  if (fetchError) {
    console.error('Error fetching existing locations:', fetchError);
    throw fetchError;
  }

  console.log("Existing locations for customer:", existingLocations);

  if (existingLocations && existingLocations.length > 0) {
    console.log("Updating existing location");
    const { data: locationData, error: locationError } = await supabase
      .from('storage_locations')
      .update({
        hotel: location.hotel,
        section: location.section,
        shelf: location.shelf,
        level: location.level,
        position: location.position
      })
      .eq('customer_id', customerId)
      .select();

    if (locationError) {
      console.error('Error updating storage location:', locationError);
      throw locationError;
    }

    console.log("Location updated successfully:", locationData);
    return locationData[0];
  }

  console.log("Creating new location");
  const { data: locationData, error: locationError } = await supabase
    .from('storage_locations')
    .insert([{
      hotel: location.hotel,
      section: location.section,
      shelf: location.shelf,
      level: location.level,
      position: location.position,
      customer_id: customerId
    }])
    .select();

  if (locationError) {
    console.error('Error creating storage location:', locationError);
    throw locationError;
  }

  console.log("New location created successfully:", locationData);
  return locationData[0];
}