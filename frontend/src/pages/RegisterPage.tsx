import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import { getErrorMessage } from '../api/axiosInstance';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 3) return setError('Nama minimal 3 karakter.');
    if (form.password.length < 8) return setError('Password minimal 8 karakter.');
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/login?registered=1');
    } catch (err) {
      setError(getErrorMessage(err)); // pesan validasi/409 dari backend
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <h1>Registrasi</h1>
      {error && <div className="state error">{error}</div>}
      <label>
        Nama
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </label>
      <label>
        Password (min. 8 karakter)
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </label>
      <button disabled={loading}>{loading ? 'Memproses...' : 'Daftar'}</button>
      <p>Sudah punya akun? <Link to="/login">Login</Link></p>
    </form>
  );
}