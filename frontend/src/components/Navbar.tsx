import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🍜 Review Kantin</Link>
      <div className="nav-right">
        {user ? (
          <>
            <span className="badge">{user.name} · {user.role}</span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Daftar</Link>
          </>
        )}
      </div>
    </nav>
  );
}