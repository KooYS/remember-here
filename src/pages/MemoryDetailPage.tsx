import { useParams, useNavigate } from 'react-router-dom';
import { useMemories } from '../hooks/useMemories';
import styles from './MemoryDetailPage.module.css';

export default function MemoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { memories, loading, deleteMemory } = useMemories();
  const memory = memories.find((m) => m.id === id);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleDelete = async () => {
    if (!memory) return;
    if (confirm('이 기억을 삭제할까요?')) {
      await deleteMemory(memory.id);
      navigate('/list');
    }
  };

  if (loading) return <div className={styles.loading}>불러오는 중...</div>;
  if (!memory) return <div className={styles.loading}>기억을 찾을 수 없어요</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/list')}>
          ←
        </button>
        <h2 className={styles.headerTitle}>기억 상세</h2>
        <button className={styles.deleteHeaderButton} onClick={handleDelete}>
          삭제
        </button>
      </header>

      <div className={styles.content}>
        {memory.photo && (
          <img src={memory.photo} alt="" className={styles.photo} />
        )}

        <div className={styles.body}>
          <p className={styles.text}>{memory.text}</p>

          {memory.link && (
            <a
              href={memory.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {memory.link}
            </a>
          )}

          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>장소</span>
              <span className={styles.metaValue}>{memory.address}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>시간</span>
              <span className={styles.metaValue}>{formatDate(memory.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
