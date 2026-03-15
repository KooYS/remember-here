import { useNavigate } from 'react-router-dom';
import { useMemories } from '../../features/memory';
import { formatDate } from '../../shared/lib/formatDate';
import styles from './MemoryListPage.module.css';

export default function MemoryListPage() {
  const navigate = useNavigate();
  const { memories, loading, deleteMemory } = useMemories();

  const handleDelete = async (id: string) => {
    if (confirm('이 기억을 삭제할까요?')) {
      await deleteMemory(id);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate('/')} aria-label="뒤로">
          ←
        </button>
        <h2 className={styles.headerTitle}>내 기억들</h2>
        <div style={{ width: 32 }} />
      </header>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.empty}>불러오는 중...</div>
        ) : memories.length === 0 ? (
          <div className={styles.empty}>
            <p>아직 남긴 기억이 없어요</p>
            <button className={styles.createButton} onClick={() => navigate('/create')}>
              첫 기억 남기기
            </button>
          </div>
        ) : (
          <ul className={styles.list}>
            {memories.map((memory) => (
              <li key={memory.id} className={styles.item}>
                <button
                  type="button"
                  className={styles.itemContent}
                  onClick={() => navigate(`/memory/${memory.id}`)}
                  aria-label={`${memory.text} - ${memory.address}`}
                >
                  {memory.photo && (
                    <img src={memory.photo} alt="" className={styles.thumbnail} />
                  )}
                  <div className={styles.itemInfo}>
                    <p className={styles.itemText}>{memory.text}</p>
                    <span className={styles.itemMeta}>
                      {memory.address} · {formatDate(memory.createdAt)}
                    </span>
                  </div>
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(memory.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
