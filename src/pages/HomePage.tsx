import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>메모리핀</h1>
        <p className={styles.subtitle}>지금 이 장소에서, 나만의 기억을 남겨보세요</p>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryButton} onClick={() => navigate('/create')}>
          여기에 기억 남기기
        </button>
        <button className={styles.secondaryButton} onClick={() => navigate('/list')}>
          기억 보기 (리스트)
        </button>
        <button className={styles.secondaryButton} onClick={() => navigate('/map')}>
          기억 보기 (지도)
        </button>
      </div>
    </div>
  );
}
