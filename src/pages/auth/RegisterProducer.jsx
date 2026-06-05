import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { portos, produtos } from '../../data/mockData';
import { FiCheck } from 'react-icons/fi';
import { MdEco } from 'react-icons/md';

export default function RegisterProducer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '', cpf: '', comunidade: '', portoReferencia: '', telefone: '', pix: '', tiposProducao: [],
  });
  const [sucesso, setSucesso] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function toggleProduto(p) {
    setForm((f) => ({
      ...f,
      tiposProducao: f.tiposProducao.includes(p)
        ? f.tiposProducao.filter((x) => x !== p)
        : [...f.tiposProducao, p],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSucesso(true);
    setTimeout(() => navigate('/login'), 2500);
  }

  if (sucesso) {
    return (
      <div className="auth-page">
        <div className="auth-card text-center">
          <div style={{ fontSize: '3rem' }}><FiCheck /></div>
          <h2 style={{ color: 'var(--verde-floresta)', marginTop: '1rem' }}>Cadastro realizado!</h2>
          <p className="text-muted mt-1">Redirecionando para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', padding: '2rem' }}>
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <div className="auth-logo">
          <span className="logo-big"><MdEco /></span>
          <h1>Cadastro de Produtor</h1>
          <p>UC01 — Cadastrar Produtor/Agricultor</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome completo *</label>
              <input name="nome" className="form-input" value={form.nome} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">CPF *</label>
              <input name="cpf" className="form-input" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Comunidade *</label>
              <input name="comunidade" className="form-input" value={form.comunidade} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Porto de referência *</label>
              <select name="portoReferencia" className="form-select" value={form.portoReferencia} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {portos.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Telefone *</label>
              <input name="telefone" className="form-input" placeholder="(92) 99999-0000" value={form.telefone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chave PIX *</label>
              <input name="pix" className="form-input" placeholder="CPF, e-mail ou telefone" value={form.pix} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tipos de produção *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
              {produtos.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleProduto(p)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: '2px solid var(--verde-medio)',
                    background: form.tiposProducao.includes(p) ? 'var(--verde-medio)' : 'transparent',
                    color: form.tiposProducao.includes(p) ? 'white' : 'var(--verde-medio)',
                    cursor: 'pointer',
                    fontSize: '0.83rem',
                    fontWeight: 600,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-2">
            Criar Conta de Produtor
          </button>
          <p className="text-center mt-2 text-muted">
            Já tem conta? <Link to="/login" style={{ color: 'var(--verde-medio)', fontWeight: 600 }}>Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
