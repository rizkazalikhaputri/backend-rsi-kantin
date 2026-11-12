import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStallById } from '../api/stallApi';
import { getErrorMessage } from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { canEdit } from '../utils/permissions';
import type { Stall } from '../types';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function StallDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStallById(id!)
      .then(setStall)
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error) return (
    <>
      <ErrorMessage message={error} />
      <Link to="/">← Kembali ke daftar</Link>
    </>
  );
  if (!stall) return null;

  return (
    <div className="card detail">
      <Link to="/">← Kembali</Link>
      <span className="tag">{stall.category ?? 'Tanpa kategori'}</span>
      <h1>{stall.name}</h1>
      <p>{stall.description ?? 'Belum ada deskripsi.'}</p>
      <p>📍 {stall.location ?? '-'}</p>
      <p>⭐ {stall.avg_rating} ({stall.review_count} ulasan)</p>
      {canEdit(user, stall) && (
        <Link className="btn" to={`/stalls/${stall.id}/edit`}>Ubah Warung</Link>
      )}
    </div>
  );
}