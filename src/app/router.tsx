import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/home/HomePage';
import NotFoundPage from '../pages/NotFoundPage';

const CreateMemoryPage = lazy(() => import('../pages/memory/CreateMemoryPage'));
const MemoryListPage = lazy(() => import('../pages/memory/MemoryListPage'));
const MemoryDetailPage = lazy(() => import('../pages/memory/MemoryDetailPage'));
const MapPage = lazy(() => import('../pages/map/MapPage'));

function Loading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', background: '#101012', color: '#8b95a1' }}>
      불러오는 중...
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateMemoryPage />} />
        <Route path="/list" element={<MemoryListPage />} />
        <Route path="/memory/:id" element={<MemoryDetailPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
