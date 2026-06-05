import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiSmartphone } from 'react-icons/fi';
import { MdEco } from 'react-icons/md';

const MOCK_CODES = { '111.111.111-11': '1234', '222.222.222-22': '5678', '333.333.333-33': '9012', '000.000.000-00': '0000', '444.444.444-44': '3456' };

const papelLabel = {
  produtor: 'Produtor',
  comprador: 'Comprador / Freteiro',
  admin: 'Administrador',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState(1); // 1: CPF+papel, 2: código SMS
  const [cpf, setCpf] = useState('');
  const [papel, setPapel] = useState('produtor');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');

  function handleContinuar(e) {
    e.preventDefault();
    setErro('');
    if (!MOCK_CODES[cpf]) {
      setErro('CPF não encontrado. Verifique ou realize o cadastro.');
      return;
    }
    setEtapa(2);
  }

  function handleAutenticar(e) {
    e.preventDefault();
    setErro('');
    const codigoEsperado = MOCK_CODES[cpf];
    if (codigo !== codigoEsperado) {
      setErro('Código inválido. Tente novamente.');
      return;
    }
    const ok = login(cpf, papel);
    if (!ok) {
      setErro('Este CPF não possui o perfil selecionado.');
      return;
    }
    navigate('/dashboard');
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-big"><MdEco /></span>
          <h1>Porto Digital Amazônico</h1>
          <p>Plataforma de comércio e logística fluvial</p>
        </div>

        {etapa === 1 ? (
          <form onSubmit={handleContinuar}>
            <div className="form-group">
              <label className="form-label">CPF</label>
              <input
                className="form-input"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Entrar como</label>
              <select className="form-select" value={papel} onChange={(e) => setPapel(e.target.value)}>
                <option value="produtor">Produtor</option>
                <option value="comprador">Comprador / Freteiro</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            {erro && <div className="alert alert-error">{erro}</div>}

            <button type="submit" className="btn btn-primary w-full">
              Continuar →
            </button>

            <div className="alert alert-info mt-2" style={{ fontSize: '0.8rem' }}>
              <div>
                <strong>CPFs de teste:</strong><br />
                Produtor: <code>111.111.111-11</code> ou <code>444.444.444-44</code><br />
                Comprador: <code>222.222.222-22</code> ou <code>333.333.333-33</code><br />
                Admin: <code>000.000.000-00</code>
              </div>
            </div>

            <p className="text-center mt-2 text-muted">
              Não tem conta?{' '}
              <Link to="/cadastro/produtor" style={{ color: 'var(--verde-medio)', fontWeight: 600 }}>
                Cadastrar como Produtor
              </Link>
              {' '}ou{' '}
              <Link to="/cadastro/comprador" style={{ color: 'var(--azul-rio)', fontWeight: 600 }}>
                Comprador
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleAutenticar}>
            <div className="alert alert-success mb-2">
              <FiSmartphone /> Código enviado para o celular cadastrado no CPF <strong>{cpf}</strong>
            </div>
            <div className="alert alert-warning mb-2" style={{ fontSize: '0.8rem' }}>
              Código de teste: <strong>{MOCK_CODES[cpf]}</strong>
            </div>

            <div className="form-group">
              <label className="form-label">Código de verificação (SMS)</label>
              <input
                className="form-input"
                placeholder="Digite o código"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                maxLength={6}
                style={{ fontSize: '1.4rem', letterSpacing: '0.4rem', textAlign: 'center' }}
              />
            </div>

            {erro && <div className="alert alert-error">{erro}</div>}

            <button type="submit" className="btn btn-primary w-full">
              Autenticar
            </button>
            <button type="button" className="btn btn-outline w-full mt-1" onClick={() => setEtapa(1)}>
              ← Voltar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
