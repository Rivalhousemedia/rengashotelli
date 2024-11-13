export interface Customer {
  id: string;
  name: string;
  licensePlate: string;
  tireSize: string;
  storageLocation?: StorageLocation;
}

export interface StorageLocation {
  hotel: number;
  section: string;
  shelf: number;
  position: number;
}

export interface SearchResult {
  customers: Customer[];
  total: number;
}