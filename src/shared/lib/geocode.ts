import { importLibrary } from '@googlemaps/js-api-loader';

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

  try {
    const { Geocoder } = await importLibrary('geocoding');
    const geocoder = new Geocoder();
    const response = await geocoder.geocode({ location: { lat, lng } });

    if (response.results.length > 0) {
      return response.results[0].formatted_address;
    }
    return fallback;
  } catch {
    return fallback;
  }
}
