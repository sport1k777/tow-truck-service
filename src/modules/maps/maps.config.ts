import { DEFAULT_MAP_CENTER, DEFAULT_MAPS_CONFIG, DEFAULT_MAP_ZOOM } from '@/lib/locale.defaults';

/** Client-safe Google Maps API key — never hardcode. */
export function getGoogleMapsApiKey(): string | undefined {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  return apiKey || undefined;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(getGoogleMapsApiKey());
}

export const MAPS_API_LIBRARIES = ['places', 'geometry'] as const;

export const MAPS_LOADER_OPTIONS = {
  version: 'weekly' as const,
  libraries: [...MAPS_API_LIBRARIES],
  language: DEFAULT_MAPS_CONFIG.language,
  region: DEFAULT_MAPS_CONFIG.region,
};

export const MAPS_DEFAULT_CENTER = DEFAULT_MAP_CENTER;
export const MAPS_DEFAULT_ZOOM = DEFAULT_MAP_ZOOM;

/** Legacy widget options — kept for reference; autocomplete uses Places API (New). */
export const MAPS_AUTOCOMPLETE_OPTIONS = {
  componentRestrictions: DEFAULT_MAPS_CONFIG.componentRestrictions,
  fields: ['formatted_address', 'geometry', 'place_id', 'name'] as const,
};

/** Places API (New) autocomplete request defaults. */
export const MAPS_AUTOCOMPLETE_REQUEST_OPTIONS = {
  includedRegionCodes: [DEFAULT_MAPS_CONFIG.componentRestrictions.country],
  language: DEFAULT_MAPS_CONFIG.language,
  region: DEFAULT_MAPS_CONFIG.region,
} as const;

/** Prefer street-level results over cities when ranking autocomplete suggestions. */
export const MAPS_ADDRESS_TYPE_RANK: Record<string, number> = {
  street_address: 100,
  premise: 90,
  subpremise: 85,
  route: 80,
  establishment: 70,
  point_of_interest: 60,
  geocode: 50,
  postal_code: 40,
  neighborhood: 30,
  administrative_area_level_3: 20,
  locality: 10,
  administrative_area_level_2: 8,
  administrative_area_level_1: 5,
  country: 1,
};

/** Premium dark blue/black map theme aligned with the landing calculator. */
export const MAP_DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1628' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3f4' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#b8d9f8' }],
  },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b9fd4' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#0d1f38' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#5a8fc4' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a3050' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#152840' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9bbce0' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2563eb' }] },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1d4ed8' }],
  },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#c5d9f5' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#142640' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#7eb3e8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#030712' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a7aa8' }] },
];

export const ROUTE_POLYLINE_OPTIONS: google.maps.PolylineOptions = {
  strokeColor: '#38bdf8',
  strokeOpacity: 0.95,
  strokeWeight: 5,
};

export const MAPS_PLACEHOLDER_MESSAGES = {
  notConfigured:
    'Карта тимчасово недоступна. Додайте NEXT_PUBLIC_GOOGLE_MAPS_API_KEY для автоматичного розрахунку маршруту.',
  loading: 'Завантаження карти...',
  loadError: 'Не вдалося завантажити Google Maps. Перевірте API ключ та спробуйте пізніше.',
  awaitingRoute: "Маршрут з'явиться після вибору адрес",
  calculatingRoute: 'Будуємо маршрут...',
} as const;
