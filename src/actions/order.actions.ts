'use server';

import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import type { CreateOrderInput } from '@/modules/orders/orders.types';
import { OrdersService } from '@/modules/orders/orders.service';
import type { ActionResult } from '@/types/api.types';
import { errorResult, successResult } from '@/types/api.types';

interface CreateOrderResult {
  orderId: string;
  referenceNumber: string;
}

export async function createOrderAction(
  _input: CreateOrderInput,
): Promise<ActionResult<CreateOrderResult>> {
  try {
    const order = await OrdersService.create(_input);
    return successResult({
      orderId: order.id,
      referenceNumber: order.referenceNumber,
    });
  } catch (error) {
    logger.error('Order creation failed', {
      module: 'orders',
      action: 'createOrderAction',
      metadata: { error: String(error) },
    });

    if (error instanceof AppError) {
      return errorResult(error.code, error.message);
    }

    return errorResult('INTERNAL_ERROR', 'Unable to create order');
  }
}
