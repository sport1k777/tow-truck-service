'use server';

import { PricingService } from '@/modules/pricing/pricing.service';
import type { PricingInput } from '@/modules/pricing/pricing.types';
import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import type { ActionResult } from '@/types/api.types';
import { errorResult, successResult } from '@/types/api.types';
import type { PriceCalculationResult } from '@/modules/pricing/pricing.types';

export async function calculatePriceAction(
  input: PricingInput,
): Promise<ActionResult<PriceCalculationResult>> {
  try {
    const result = await PricingService.calculate(input);
    return successResult(result);
  } catch (error) {
    logger.error('Price calculation failed', {
      module: 'pricing',
      action: 'calculatePriceAction',
      metadata: { error: String(error) },
    });

    if (error instanceof AppError) {
      return errorResult(error.code, error.message);
    }

    return errorResult('INTERNAL_ERROR', 'Unable to calculate price');
  }
}
