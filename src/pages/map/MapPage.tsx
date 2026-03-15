import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useMemories } from '../../features/memory';
import type { Memory } from '../../features/memory';
import Icon from '../../shared/components/Icon';
import BottomNav from '../../shared/components/BottomNav';
import styles from './MapPage.module.css';

export default function MapPage() {
  const navigate = useNavigate();
  const { memories, loading } = useMemories();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // 지도 초기화 (한 번만)
  useEffect(() => {
    if (!mapRef.current || !API_KEY || mapInstanceRef.current) return;

    setOptions({ key: API_KEY, v: 'weekly', language: 'ko' });

    importLibrary('maps').then(({ Map }) => {
      mapInstanceRef.current = new Map(mapRef.current!, {
        center: { lat: 37.5665, lng: 126.978 },
        zoom: 13,
        disableDefaultUI: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#1c1c1e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#1c1c1e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#6b7684' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2e' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#101012' }] },
        ],
      });
    });
  }, [API_KEY]);

  // 메모리 마커 업데이트
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || loading) return;

    // 기존 마커 리스너 + 지도 제거
    markersRef.current.forEach((m) => {
      google.maps.event.clearInstanceListeners(m);
      m.setMap(null);
    });
    markersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    memories.forEach((memory) => {
      if (memory.latitude == null || memory.longitude == null) return;

      const position = { lat: memory.latitude, lng: memory.longitude };
      const marker = new google.maps.Marker({ position, map });

      marker.addListener('click', () => {
        setSelectedMemory(memory);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    if (memories.length > 1) {
      map.fitBounds(bounds);
    } else if (memories.length === 1 && memories[0].latitude != null) {
      map.setCenter({ lat: memories[0].latitude, lng: memories[0].longitude! });
    }
  }, [loading, memories]);

  const handleMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        mapInstanceRef.current?.setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        mapInstanceRef.current?.setZoom(15);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? '위치 권한을 허용해주세요'
            : '현재 위치를 가져올 수 없습니다';
        alert(message);
      },
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.headerButton} onClick={() => navigate('/')} aria-label="뒤로">
          <Icon name="arrow_back_ios_new" size={20} />
        </button>
        <h2 className={styles.headerTitle}>기억나니?</h2>
        <button className={styles.headerButton} aria-label="검색">
          <Icon name="search" size={24} />
        </button>
      </div>

      {/* Map Area */}
      <div className={styles.mapArea}>
        {!API_KEY ? (
          <div className={styles.placeholder}>
            Google Maps API 키를 .env에 설정해주세요
          </div>
        ) : (
          <div ref={mapRef} className={styles.map} />
        )}

        {/* Search Bar Overlay */}
        <div className={styles.searchBar}>
          <div className={styles.searchInner}>
            <Icon name="search" size={20} className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="추억의 장소를 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Map Controls */}
        <div className={styles.mapControls}>
          <div className={styles.zoomControls}>
            <button
              className={styles.controlButton}
              aria-label="확대"
              onClick={() => {
                const map = mapInstanceRef.current;
                if (map) map.setZoom((map.getZoom() ?? 13) + 1);
              }}
            >
              <Icon name="add" size={24} />
            </button>
            <div className={styles.controlDivider} />
            <button
              className={styles.controlButton}
              aria-label="축소"
              onClick={() => {
                const map = mapInstanceRef.current;
                if (map) map.setZoom((map.getZoom() ?? 13) - 1);
              }}
            >
              <Icon name="remove" size={24} />
            </button>
          </div>
          <button className={styles.locationButton} onClick={handleMyLocation} aria-label="내 위치">
            <Icon name="my_location" size={24} className={styles.locationIcon} />
          </button>
        </div>

        {/* Memory Preview Card */}
        {selectedMemory && (
          <div className={styles.previewCard}>
            <div className={styles.previewContent}>
              <div className={styles.previewInfo}>
                <p className={styles.previewTitle}>{selectedMemory.text}</p>
                <p className={styles.previewAddress}>
                  <Icon name="location_on" size={16} />
                  {selectedMemory.address}
                </p>
              </div>
              <button
                className={styles.previewAction}
                onClick={() => navigate(`/memory/${selectedMemory.id}`)}
              >
                자세히 보기
                <Icon name="chevron_right" size={18} />
              </button>
            </div>
            {selectedMemory.photo && (
              <img src={selectedMemory.photo} alt="" className={styles.previewImage} />
            )}
            <button
              className={styles.previewClose}
              onClick={() => setSelectedMemory(null)}
              aria-label="닫기"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
