import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentLocation } from '../../shared/hooks/useCurrentLocation';
import { useMemories } from '../../features/memory';
import { reverseGeocode } from '../../shared/lib/geocode';
import { pickImageFromFile } from '../../shared/lib/pickImage';
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
      const dataUri = response.dataUri.startsWith('data:')
        ? response.dataUri
        : 'data:image/jpeg;base64,' + response.dataUri;
      setPhoto(dataUri);
    } catch {
      pickImageFromFile(setPhoto, 'environment');
    }
  };

  const handleAlbum = async () => {
    try {
      const { fetchAlbumPhotos } = await import('@apps-in-toss/web-framework');
      const response = await fetchAlbumPhotos({ base64: true, maxWidth: 720 });
      if (response.length > 0) {
        const dataUri = response[0].dataUri.startsWith('data:')
          ? response[0].dataUri
          : 'data:image/jpeg;base64,' + response[0].dataUri;
        setPhoto(dataUri);
      }
    } catch {
      pickImageFromFile(setPhoto);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) return;

    if (text.length > 1000) {
      alert('텍스트는 1000자를 초과할 수 없습니다.');
      return;
    }

    if (link.trim() && !/^https?:\/\//i.test(link.trim())) {
      alert('링크는 http:// 또는 https://로 시작해야 합니다.');
      return;
    }

    setSaving(true);

    try {
      await addMemory({
        photo,
        text: text.trim(),
        link: link.trim(),
        latitude: latitude || null,
        longitude: longitude || null,
        address,
        createdAt: new Date().toISOString(),
      });
      navigate('/list');
    } catch (err) {
      const message = err instanceof Error ? err.message : '저장에 실패했습니다.';
      alert(message);
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)} aria-label="뒤로">
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
              <button className={styles.removePhoto} onClick={() => setPhoto(null)} aria-label="사진 제거">
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
          maxLength={1000}
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
