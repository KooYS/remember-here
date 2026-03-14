import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateMemoryPage from './pages/CreateMemoryPage';
import MemoryListPage from './pages/MemoryListPage';
import MemoryDetailPage from './pages/MemoryDetailPage';
import MapPage from './pages/MapPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateMemoryPage />} />
        <Route path="/list" element={<MemoryListPage />} />
        <Route path="/memory/:id" element={<MemoryDetailPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}
