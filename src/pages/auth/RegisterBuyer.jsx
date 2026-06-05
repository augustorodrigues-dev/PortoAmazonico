import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheck, FiAnchor } from 'react-icons/fi';

export default function RegisterBuyer() {
  const navigate = useNavigate();
  const [temEmbarcacao, setTemEmbarcacao] = useState(true);
  const [form, setForm] = useState({
    nome: '', cpf: '', telefone: '', pix: '',
    embarcacaoNome: '', embarcacaoTipo: '', embarcacaoCapacidade: '',
  });
  const [sucesso, setSucesso] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
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
          <span className="logo-big"><FiAnchor /></span>
          <h1>Cadastro de Comprador / Freteiro</h1>
          <p>UC02 — Cadastrar Comprador/Freteiro</p>
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
              <label className="form-label">Telefone *</label>
              <input name="telefone" className="form-input" placeholder="(92) 99999-0000" value={form.telefone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Chave PIX *</label>
              <input name="pix" className="form-input" placeholder="CPF, e-mail ou telefone" value={form.pix} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={temEmbarcacao}
                onChange={(e) => setTemEmbarcacao(e.target.checked)}
              />
              Possuo embarcação (serei freteiro também)
            </label>
          </div>

          {temEmbarcacao && (
            <>
              <div className="alert alert-info mb-2">
                <FiAnchor /> Dados da embarcação
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nome da embarcação *</label>
                  <input name="embarcacaoNome" className="form-input" value={form.embarcacaoNome} onChange={handleChange} required={temEmbarcacao} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo *</label>
                  <select name="embarcacaoTipo" className="form-select" value={form.embarcacaoTipo} onChange={handleChange} required={temEmbarcacao}>
                    <option value="">Selecione...</option>
                    <option>Barco de carga</option>
                    <option>Canoa motorizada</option>
                    <option>Balsa</option>
                    <option>Lancha</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Capacidade de carga (kg) *</label>
                <input name="embarcacaoCapacidade" type="number" className="form-input" value={form.embarcacaoCapacidade} onChange={handleChange} required={temEmbarcacao} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-secondary w-full mt-2">
            Criar Conta
          </button>
          <p className="text-center mt-2 text-muted">
            Já tem conta? <Link to="/login" style={{ color: 'var(--verde-medio)', fontWeight: 600 }}>Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
