import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStalls, deleteStall } from '../api/stallApi';
import { getErrorMessage } from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { canCreate, canEdit, canDelete } from '../utils/permissions';
import type { Stall } from '../types';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const LIMIT = 6;

export default function StallListPage() {
  const { user } = useAuth();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [filters, setFilters] = useState({ search: '', category: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getStalls({
        search: filters.search || undefined,
        category: filters.category || undefined,
        page,
        limit: LIMIT,
      });
      setStalls(res.data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setFilters({ search: searchInput.trim(), category: categoryInput });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus warung ini?')) return;
    try {
      await deleteStall(id);
      setMessage('Warung berhasil dihapus.');
      load(); // muat ulang dari backend
    } catch (e) {
      setMessage('');
      setError(getErrorMessage(e)); // 401/403 tampil di sini
    }
  };

  const hasNext = stalls.length === LIMIT;

  return (
    <>
      <div className="toolbar">
        <h1>Daftar Warung</h1>
        {canCreate(user) && (
          <Link className="btn" to="/stalls/new">+ Tambah Warung</Link>
        )}
      </div>

      <form onSubmit={onSearch} className="search">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Cari nama/deskripsi warung..."
        />
        <select value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)}>
          <option value="">Semua kategori</option>
          <option value="Makanan Berat">Makanan Berat</option>
          <option value="Minuman">Minuman</option>
          <option value="Cemilan">Cemilan</option>
        </select>
        <button type="submit">Cari</button>
      </form>

      {message && <div className="state success">{message}</div>}
      {loading && <Loading />}
      {error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && stalls.length === 0 && (
        <EmptyState
          message={
            filters.search || filters.category
              ? 'Tidak ada warung yang cocok dengan pencarian.'
              : 'Belum ada warung.'
          }
        />
      )}

      {!loading && (
        <div className="grid">
          {stalls.map((s) => (
            <div className="card" key={s.id}>
              <span className="tag">{s.category ?? 'Tanpa kategori'}</span>
              <h3>{s.name}</h3>
              <p>{s.description ?? 'Belum ada deskripsi.'}</p>
              <small>📍 {s.location ?? '-'}</small>
              <div className="actions">
                <Link to={`/stalls/${s.id}`}>Detail</Link>
                {canEdit(user, s) && <Link to={`/stalls/${s.id}/edit`}>Ubah</Link>}
                {canDelete(user) && (
                  <button className="danger" onClick={() => handleDelete(s.id)}>Hapus</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(page > 1 || hasNext) && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ Prev</button>
          <span>Halaman {page}</span>
          <button disabled={!hasNext} onClick={() => setPage(page + 1)}>Next ›</button>
        </div>
      )}
    </>
  );
}