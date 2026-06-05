import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { produtos } from '../../data/mockData';
import { MdAssignmentTurnedIn, MdHistory, MdCheckCircle, MdWarningAmber } from 'react-icons/md';

export default function RegisterHarvest() {
  const { usuario } = useAuth();
  const { colheitas, adicionarColheita } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    produto: '', volume: '', unidade: 'kg', dataColheita: '', observacoes: '',
  });
  const historico = colheitas.filter((c) => c.produtorId === usuario?.id);
  const [sucesso, setSucesso] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    adicionarColheita({
      id: 'c' + Date.now(),
      produtorId: usuario.id,
      produto: form.produto,
      volume: Number(form.volume),
      unidade: form.unidade,
      dataColheita: form.dataColheita,
      observacoes: form.observacoes,
      historico: [],
    });
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
    setForm({ produto: '', volume: '', unidade: 'kg', dataColheita: '', observacoes: '' });
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1><MdAssignmentTurnedIn style={{ verticalAlign: 'middle', marginRight: 8 }} />Registrar Colheita / Produção</h1>
        <p>UC04 — Substitui cadernos manuscritos com registro digital permanente</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Formulário */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Nova Colheita</span>
          </div>

          {sucesso && (
            <div className="alert alert-success mb-2">
              <MdCheckCircle style={{ verticalAlign: 'middle', marginRight: 6 }} />Colheita registrada com sucesso! Registro permanente criado.
            </div>
          )}

          <div className="alert alert-warning mb-2" style={{ fontSize: '0.82rem' }}>
            <MdWarningAmber style={{ verticalAlign: 'middle', marginRight: 6 }} />Dados não podem ser deletados — apenas corrigidos com auditoria.
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Cultura / Produto *</label>
              <select name="produto" className="form-select" value={form.produto} onChange={handleChange} required>
                <option value="">Selecione o produto...</option>
                {produtos.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Volume colhido *</label>
                <input name="volume" type="number" className="form-input" value={form.volume} onChange={handleChange} required min="0.1" step="0.1" />
              </div>
              <div className="form-group">
                <label className="form-label">Unidade *</label>
                <select name="unidade" className="form-select" value={form.unidade} onChange={handleChange}>
                  <option value="kg">kg</option>
                  <option value="toneladas">toneladas</option>
                  <option value="caixas">caixas</option>
                  <option value="sacas">sacas</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Data da colheita *</label>
              <input name="dataColheita" type="date" className="form-input" value={form.dataColheita} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="form-label">Observações (qualidade, clima...)</label>
              <textarea name="observacoes" className="form-textarea" value={form.observacoes} onChange={handleChange} placeholder="Ex: frutos maduros, chuvas normais..." />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Registrar Colheita
            </button>
          </form>
        </div>

        {/* Histórico */}
        <div className="card">
          <div className="card-header">
            <span className="card-title"><MdHistory style={{ verticalAlign: 'middle', marginRight: 6 }} />Histórico de Colheitas</span>
          </div>
          {historico.length === 0 ? (
            <p className="text-muted text-center mt-2">Nenhuma colheita registrada ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {historico.map((c) => (
                <div key={c.id} style={{ background: 'var(--areia)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                  <div className="flex-between">
                    <span className="font-bold text-verde">{c.produto}</span>
                    <span className="text-muted">{c.dataColheita}</span>
                  </div>
                  <p style={{ marginTop: '0.25rem', fontSize: '0.9rem' }}>
                    {c.volume} {c.unidade}
                  </p>
                  {c.observacoes && <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>{c.observacoes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
