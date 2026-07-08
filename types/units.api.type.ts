/** Response shapes of the Sakena backend property endpoints (`/api/v1`). */

export interface ApartmentApiResponse {
  id: string;
  buildingId: string;
  unitNumber: string;
  floorNumber: number;
  areaSquareMeters: number;
  bedrooms: number;
  createdAt: string;
  updatedAt: string;
}

export interface BuildingApiResponse {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}
