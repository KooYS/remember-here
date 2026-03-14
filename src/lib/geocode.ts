const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface GoogleGeoResult {
  formatted_address: string;
}

interface GoogleGeoResponse {
  results: GoogleGeoResult[];
  status: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  if (!GOOGLE_MAPS_API_KEY) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}&language=ko`
    );
    const data: GoogleGeoResponse = await res.json();
    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
