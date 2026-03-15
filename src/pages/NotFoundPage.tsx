import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        gap: 16,
        padding: 20,
      }}
    >
      <p style={{ fontSize: 48, margin: 0 }}>404</p>
      <p style={{ fontSize: 16, color: 'var(--text-secondary)', margin: 0 }}>페이지를 찾을 수 없어요</p>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: 8,
          padding: '10px 24px',
          border: 'none',
          borderRadius: 12,
          background: 'var(--accent)',
          color: 'var(--text-on-primary)',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
