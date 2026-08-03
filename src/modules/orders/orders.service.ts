/**
 * Public service interface for the Orders module.
 * Phase 8: Prisma repository + notification dispatch on create.
 */

import type { CreateOrderInput, Order } from './orders.types';

export const OrdersService = {
  async create(_input: CreateOrderInput): Promise<Order> {
    throw new Error('OrdersService.create — implemented in Phase 8');
  },

  async getById(_id: string): Promise<Order | null> {
    throw new Error('OrdersService.getById — implemented in Phase 8');
  },

  async list(_params?: { status?: string; limit?: number; offset?: number }): Promise<Order[]> {
    throw new Error('OrdersService.list — implemented in Phase 8');
  },

  async updateStatus(_id: string, _status: string, _adminUserId: string): Promise<Order> {
    throw new Error('OrdersService.updateStatus — implemented in Phase 8');
  },
};
