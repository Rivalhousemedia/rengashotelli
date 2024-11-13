export interface Customer {
  id: string;
  name: string;
  licensePlate: string;
  summerTireSize: string;
  winterTireSize: string;
  phone: string;
  email: string;
  status: 'active' | 'interim' | 'inactive';
  storageLocation?: StorageLocation;
}

export interface StorageLocation {
  hotel: number;
  section: string;
  shelf: string; // L for Left, R for Right
  level: number;
  position: number;
}

export interface SearchResult {
  customers: Customer[];
  total: number;
}