import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { useMemories } from '../hooks/useMemories';
import type { Memory } from '../types/memory';
import styles from './MapPage.module.css';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
if (API_KEY) {
  setOptions({ key: API_KEY, v: 'weekly', language: 'ko' });
}

export default function MapPage() {
  const navigate = useNavigate();
  const { memories, loading } = useMemories();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // 지도 초기화 (한 번만)
  useEffect(() => {
    if (!mapRef.current || !API_KEY || mapInstanceRef.current) return;

    importLibrary('maps').then(({ Map }) => {
      mapInstanceRef.current = new Map(mapRef.current!, {
        center: { lat: 37.5665, lng: 126.978 },
        zoom: 13,
      });
    });
  }, []);

  // 메모리 마커 업데이트
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || loading) return;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
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

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          ←
        </button>
        <h2 className={styles.headerTitle}>기억 지도</h2>
        <div style={{ width: 32 }} />
      </header>

      <div className={styles.mapWrapper}>
        {!API_KEY ? (
          <div className={styles.placeholder}>
            Google Maps API 키를 .env에 설정해주세요
          </div>
        ) : (
          <div ref={mapRef} className={styles.map} />
        )}
      </div>

      {selectedMemory && (
        <div className={styles.card} onClick={() => navigate(`/memory/${selectedMemory.id}`)}>
          {selectedMemory.photo && (
            <img src={selectedMemory.photo} alt="" className={styles.cardImage} />
          )}
          <div className={styles.cardInfo}>
            <p className={styles.cardText}>{selectedMemory.text}</p>
            <span className={styles.cardMeta}>
              {selectedMemory.address} · {formatDate(selectedMemory.createdAt)}
            </span>
          </div>
          <button
            className={styles.cardClose}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMemory(null);
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
