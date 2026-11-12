import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import StallListPage from './pages/StallListPage';
import StallDetailPage from './pages/StallDetailPage';
import StallFormPage from './pages/StallFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<StallListPage />} />
          <Route path="/stalls/:id" element={<StallDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/stalls/new"
            element={<ProtectedRoute roles={['admin', 'owner']}><StallFormPage /></ProtectedRoute>}
          />
          <Route
            path="/stalls/:id/edit"
            element={<ProtectedRoute roles={['admin', 'owner']}><StallFormPage /></ProtectedRoute>}
          />
          <Route path="*" element={<h1>404 – Halaman tidak ditemukan</h1>} />
        </Routes>
      </main>
    </>
  );
}