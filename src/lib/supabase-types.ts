export type Customer = {
  id: string
  created_at: string
  name: string
  license_plate: string
  tire_size: string
  storage_location_id?: string
}

export type StorageLocation = {
  id: string
  created_at: string
  hotel: number
  section: string
  shelf: number
  position: number
  customer_id?: string
}