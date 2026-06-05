import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const papelLabel = {
  produtor: 'Produtor',
  comprador: 'Comprador / Freteiro',
  admin: 'Administrador',
};

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src="/logo.png" alt="Porto Digital Amazônico" style={{ height: '72px', display: 'block', filter: 'brightness(0) invert(1)' }} />
      </Link>
      {usuario && (
        <div className="navbar-user">
          <span>{usuario.nome}</span>
          <span className="papel-badge">{papelLabel[usuario.papel]}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}
