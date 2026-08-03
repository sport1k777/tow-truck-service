import type { OrderStatus, VehicleType } from '@/lib/constants';

export interface Order {
  id: string;
  referenceNumber: string;
  status: OrderStatus;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  distanceKm: number;
  durationMinutes: number;
  estimatedPrice: number;
  currency: string;
  vehicleType: VehicleType;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  comments: string | null;
  isDifficultLoading: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderInput {
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  distanceKm: number;
  durationMinutes: number;
  estimatedPrice: number;
  vehicleType: VehicleType;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  comments?: string;
  isDifficultLoading?: boolean;
}
