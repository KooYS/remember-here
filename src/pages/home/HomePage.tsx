import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemories } from '../../features/memory';
import { formatRelativeDate } from '../../shared/lib/formatDate';
import Icon from '../../shared/components/Icon';
import BottomNav from '../../shared/components/BottomNav';
import styles from './HomePage.module.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { memories, loading } = useMemories();

  const uniquePlaces = useMemo(
    () => new Set(memories.map((m) => m.address)).size,
    [memories],
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Icon name="calendar_today" filled size={28} className={styles.headerIcon} />
          <h1 className={styles.headerTitle}>기억나니?</h1>
        </div>
        <button className={styles.headerAction} aria-label="프로필">
          <Icon name="person" size={24} />
        </button>
      </header>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h2 className={styles.heroTitle}>
            오늘의 기억을
            <br />
            심어볼까요?
          </h2>
          <button className={styles.ctaButton} onClick={() => navigate('/create')}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaIconWrap}>
                <Icon name="photo_camera" filled size={28} className={styles.ctaIcon} />
              </div>
              <div className={styles.ctaText}>
                <p className={styles.ctaTitle}>기억 남기기</p>
                <p className={styles.ctaSubtitle}>지금 이 순간을 잊지 않게</p>
              </div>
            </div>
            <Icon name="chevron_right" size={24} className={styles.ctaChevron} />
          </button>
        </section>

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>저장된 기억</p>
            <p className={styles.statValue}>{loading ? '-' : `${memories.length}개`}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>발견한 장소</p>
            <p className={styles.statValue}>{loading ? '-' : `${uniquePlaces}곳`}</p>
          </div>
        </div>

        {/* Recent Memories */}
        <section className={styles.recentSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>최근 기억</h3>
            <button className={styles.viewAllButton} onClick={() => navigate('/list')}>
              모두 보기
              <Icon name="chevron_right" size={16} />
            </button>
          </div>
          <div className={styles.memoryList}>
            {loading ? (
              <div className={styles.empty}>불러오는 중...</div>
            ) : memories.length === 0 ? (
              <div className={styles.empty}>아직 남긴 기억이 없어요</div>
            ) : (
              memories.slice(0, 5).map((memory) => (
                <button
                  type="button"
                  key={memory.id}
                  className={styles.memoryRow}
                  onClick={() => navigate(`/memory/${memory.id}`)}
                  aria-label={`${memory.text} - ${memory.address}`}
                >
                  <div className={styles.memoryThumb}>
                    {memory.photo ? (
                      <img src={memory.photo} alt="" className={styles.thumbImg} />
                    ) : (
                      <div className={styles.thumbPlaceholder}>
                        <Icon name="image" size={24} />
                      </div>
                    )}
                  </div>
                  <div className={styles.memoryInfo}>
                    <p className={styles.memoryDate}>
                      {formatRelativeDate(memory.createdAt)}
                    </p>
                    <h4 className={styles.memoryText}>{memory.text}</h4>
                    <div className={styles.memoryLocation}>
                      <Icon name="location_on" size={14} />
                      <span>{memory.address}</span>
                    </div>
                  </div>
                  <Icon name="chevron_right" size={20} className={styles.rowChevron} />
                </button>
              ))
            )}
          </div>
        </section>
      </main>

     
      <BottomNav />
    </div>
  );
}
