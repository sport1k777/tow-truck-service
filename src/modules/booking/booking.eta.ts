/** Minutes added for dispatcher assignment before driver travel time. */
const DISPATCH_BUFFER_MINUTES = 15;

const FALLBACK_TRAVEL_MINUTES = 30;

export function calculateEstimatedArrival(durationMinutes: number | null, from = new Date()): Date {
  const travelMinutes =
    durationMinutes !== null && durationMinutes > 0 ? durationMinutes : FALLBACK_TRAVEL_MINUTES;

  return new Date(from.getTime() + (DISPATCH_BUFFER_MINUTES + travelMinutes) * 60 * 1000);
}

export function formatEstimatedArrival(isoDate: string): string {
  return new Date(isoDate).toLocaleString('uk-UA', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}
