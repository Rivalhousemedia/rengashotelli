export type Customer = {
  id: string;
  created_at: string;
  name: string;
  license_plate: string;
  summer_tire_size: string;
  winter_tire_size: string;
  phone: string;
  email: string;
  status: string;
  storage_location_id?: string;
}

export type StorageLocation = {
  id: string;
  created_at: string;
  hotel: number;
  section: string;
  shelf: string;
  level: number;
  position: number;
  customer_id?: string;
}