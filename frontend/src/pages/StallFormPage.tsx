import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStall, getStallById, updateStall } from '../api/stallApi';
import { getErrorMessage } from '../api/axiosInstance';
import Loading from '../components/Loading';

export default function StallFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', category: '', location: '', description: '' });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getStallById(id!)
      .then((s) =>
        setForm({
          name: s.name,
          category: s.category ?? '',
          location: s.location ?? '',
          description: s.description ?? '',
        })
      )
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 3) return setError('Nama warung minimal 3 karakter.');
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category || undefined,
        location: form.location || undefined,
        description: form.description || undefined,
      };
      if (isEdit) await updateStall(id!, payload);
      else await createStall(payload);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err)); // termasuk 403 "Anda bukan pemilik warung ini"
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <form className="form" onSubmit={onSubmit}>
      <h1>{isEdit ? 'Ubah Warung' : 'Tambah Warung'}</h1>
      {error && <div className="state error">{error}</div>}
      <label>
        Nama (min. 3 karakter)
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label>
        Kategori
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Pilih kategori</option>
          <option value="Makanan Berat">Makanan Berat</option>
          <option value="Minuman">Minuman</option>
          <option value="Cemilan">Cemilan</option>
        </select>
      </label>
      <label>
        Lokasi
        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      </label>
      <label>
        Deskripsi
        <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </label>
      <button disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan'}</button>
    </form>
  );
}