import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useMemories } from '../hooks/useMemories';
import { reverseGeocode } from '../lib/geocode';
import styles from './CreateMemoryPage.module.css';

export default function CreateMemoryPage() {
  const navigate = useNavigate();
  const { latitude, longitude, fetchLocation } = useCurrentLocation();
  const { addMemory } = useMemories();

  const [photo, setPhoto] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    if (latitude && longitude) {
      reverseGeocode(latitude, longitude).then(setAddress);
    }
  }, [latitude, longitude]);

  const handleCamera = async () => {
    try {
      const { openCamera } = await import('@apps-in-toss/web-framework');
      const response = await openCamera({ base64: true });
      setPhoto('data:image/jpeg;base64,' + response.dataUri);
    } catch {
      // 브라우저 fallback
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhoto(reader.result as string);
        reader.readAsDataURL(file);
      };
      input.click();
    }
  };

  const handleAlbum = async () => {
    try {
      const { fetchAlbumPhotos } = await import('@apps-in-toss/web-framework');
      const response = await fetchAlbumPhotos({ base64: true, maxWidth: 720 });
      if (response.length > 0) {
        setPhoto('data:image/jpeg;base64,' + response[0].dataUri);
      }
    } catch {
      // 브라우저 fallback
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPhoto(reader.result as string);
        reader.readAsDataURL(file);
      };
      input.click();
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    setSaving(true);

    try {
      await addMemory({
        photo,
        text: text.trim(),
        link: link.trim(),
        latitude,
        longitude,
        address,
        createdAt: new Date().toISOString(),
      });
      navigate('/list');
    } catch (err) {
      console.error('저장 실패:', err);
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ←
        </button>
        <h2 className={styles.headerTitle}>기억 남기기</h2>
        <div style={{ width: 32 }} />
      </header>

      <div className={styles.content}>
        {/* 사진 영역 */}
        <div className={styles.photoSection}>
          {photo ? (
            <div className={styles.photoPreview}>
              <img src={photo} alt="미리보기" className={styles.previewImage} />
              <button className={styles.removePhoto} onClick={() => setPhoto(null)}>
                ×
              </button>
            </div>
          ) : (
            <div className={styles.photoButtons}>
              <button className={styles.photoButton} onClick={handleCamera}>
                촬영하기
              </button>
              <button className={styles.photoButton} onClick={handleAlbum}>
                앨범에서 선택
              </button>
            </div>
          )}
        </div>

        {/* 텍스트 입력 */}
        <textarea
          className={styles.textInput}
          placeholder="이 장소에서의 기억을 적어주세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />

        {/* 링크 입력 */}
        <input
          className={styles.linkInput}
          type="url"
          placeholder="관련 링크 (선택)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        {/* 위치 정보 */}
        <div className={styles.locationInfo}>
          <span className={styles.locationIcon}>📍</span>
          <span className={styles.locationText}>{address || '위치 확인 중...'}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={!text.trim() || saving}
        >
          {saving ? '저장 중...' : '기억 저장하기'}
        </button>
      </div>
    </div>
  );
}
