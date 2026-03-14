import { useState, useCallback } from 'react';

interface LocationState {
  latitude: number;
  longitude: number;
  loading: boolean;
  error: string | null;
}

export function useCurrentLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: 0,
    longitude: 0,
    loading: false,
    error: null,
  });

  const fetchLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // 앱인토스 SDK 환경에서는 getCurrentLocation 사용
      const { getCurrentLocation, Accuracy } = await import('@apps-in-toss/web-framework');
      const location = await getCurrentLocation({ accuracy: Accuracy.Balanced });
      setState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        loading: false,
        error: null,
      });
    } catch {
      // 브라우저 fallback (로컬 개발용)
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setState({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              loading: false,
              error: null,
            });
          },
          (err) => {
            setState((prev) => ({ ...prev, loading: false, error: err.message }));
          }
        );
      } else {
        setState((prev) => ({ ...prev, loading: false, error: '위치 정보를 가져올 수 없습니다.' }));
      }
    }
  }, []);

  return { ...state, fetchLocation };
}
