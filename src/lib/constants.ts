/**
 * Application-wide constants.
 * Country-specific defaults live in locale.defaults.ts — not hardcoded branding.
 */

export const APP_NAME = 'Tow Truck Service Platform';

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DISPATCHED: 'DISPATCHED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const VEHICLE_TYPES = {
  PASSENGER_CAR: 'PASSENGER_CAR',
  SUV: 'SUV',
  VAN: 'VAN',
  LARGE_SUV: 'LARGE_SUV',
  TRUCK: 'TRUCK',
  MOTORCYCLE: 'MOTORCYCLE',
  OTHER: 'OTHER',
} as const;

export type VehicleType = (typeof VEHICLE_TYPES)[keyof typeof VEHICLE_TYPES];

export const PRICING_SURCHARGE_TYPES = {
  VEHICLE_TYPE: 'VEHICLE_TYPE',
  NIGHT: 'NIGHT',
  WEEKEND: 'WEEKEND',
  HOLIDAY: 'HOLIDAY',
  DIFFICULT_LOADING: 'DIFFICULT_LOADING',
  EMERGENCY_DISPATCH: 'EMERGENCY_DISPATCH',
} as const;

export type PricingSurchargeType =
  (typeof PRICING_SURCHARGE_TYPES)[keyof typeof PRICING_SURCHARGE_TYPES];

export const NOTIFICATION_CHANNELS = {
  WHATSAPP: 'WHATSAPP',
  EMAIL: 'EMAIL',
  TELEGRAM: 'TELEGRAM',
} as const;

export type NotificationChannel =
  (typeof NOTIFICATION_CHANNELS)[keyof typeof NOTIFICATION_CHANNELS];

export const NOTIFICATION_EVENTS = {
  ORDER_CREATED: 'order.created',
  ORDER_STATUS_CHANGED: 'order.status_changed',
  ORDER_CANCELLED: 'order.cancelled',
} as const;

export type NotificationEvent =
  (typeof NOTIFICATION_EVENTS)[keyof typeof NOTIFICATION_EVENTS];
