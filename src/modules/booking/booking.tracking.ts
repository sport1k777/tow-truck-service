/** Static order tracking steps — UI foundation for Phase 7.5+ backend updates */

export type OrderTrackingStepStatus = 'completed' | 'current' | 'upcoming';

export interface OrderTrackingStep {
  id: string;
  label: string;
  status: OrderTrackingStepStatus;
}

export const INITIAL_ORDER_TRACKING_STEPS: OrderTrackingStep[] = [
  { id: 'received', label: 'Замовлення отримано', status: 'completed' },
  { id: 'pending_confirmation', label: 'Очікує підтвердження', status: 'current' },
  { id: 'driver_assigned', label: 'Водій призначений', status: 'upcoming' },
  { id: 'dispatched', label: 'Евакуатор виїхав', status: 'upcoming' },
  { id: 'completed', label: 'Виконано', status: 'upcoming' },
];
