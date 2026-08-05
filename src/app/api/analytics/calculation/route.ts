import { NextResponse } from 'next/server';
import { z } from 'zod';
import { recordCalculationEvent } from '@/modules/analytics/analytics.service';

const bodySchema = z.object({
  pickupAddress: z.string().min(1).max(500),
  destinationAddress: z.string().min(1).max(500),
  pickupLat: z.number().optional(),
  pickupLng: z.number().optional(),
  destinationLat: z.number().optional(),
  destinationLng: z.number().optional(),
  distanceKm: z.number().min(0),
  estimatedPrice: z.number().min(0),
  vehicleType: z.string().min(1).max(50),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = bodySchema.parse(json);

    await recordCalculationEvent(data);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
