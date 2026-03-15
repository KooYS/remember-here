import { useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import styles from './BottomNav.module.css';

const tabs = [
  { path: '/', icon: 'home', label: '홈' },
  { path: '/list', icon: 'format_list_bulleted', label: '목록' },
  { path: '/map', icon: 'map', label: '지도' },
  { path: '/settings', icon: 'settings', label: '설정' },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.tabs}>
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                className={`${styles.tab} ${active ? styles.active : ''}`}
                onClick={() => navigate(tab.path)}
              >
                <Icon name={tab.icon} filled={active} size={24} />
                <span className={styles.label}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
