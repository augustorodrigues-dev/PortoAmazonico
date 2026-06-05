import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { portos } from '../../data/mockData';
import { FiInfo } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';

export default function RegisterRoute() {
  const { usuario } = useAuth();
  const { adicionarRota } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    origem: '', destino: '', paradas: '', tempoEstimado: '',
    frequencia: 'Semanal', diasHorarios: '', capacidadeLivre: '', precoFrete: '',
  });
  const [sucesso, setSucesso] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    adicionarRota({
      id: 'r' + Date.now(),
      freteiro: usuario,
      origem: form.origem,
      destino: form.destino,
      paradas: form.paradas ? form.paradas.split(',').map((s) => s.trim()) : [],
      tempoEstimado: form.tempoEstimado,
      frequencia: form.frequencia,
      diasHorarios: form.diasHorarios,
      capacidadeLivre: Number(form.capacidadeLivre),
      precoFrete: Number(form.precoFrete),
      disponivel: true,
    });
    setSucesso(true);
    setTimeout(() => navigate('/logistica/rotas'), 2000);
  }

  if (sucesso) {
    return (
      <div className="page-body">
        <div className="card text-center" style={{ maxWidth: 400, margin: '3rem auto' }}>
          <div style={{ fontSize: '3rem' }}><MdLocationOn /></div>
          <h2 className="text-verde mt-2">Rota cadastrada!</h2>
          <p className="text-muted mt-1">Sua rota está visível para outros usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1><MdLocationOn /> Cadastrar Nova Rota</h1>
        <p>UC06 — Registre as rotas fluviais que você costuma percorrer</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Porto de origem *</label>
              <select name="origem" className="form-select" value={form.origem} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {portos.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Porto de destino *</label>
              <select name="destino" className="form-select" value={form.destino} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {portos.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Paradas intermediárias</label>
            <input name="paradas" className="form-input" value={form.paradas} onChange={handleChange} placeholder="Ex: Porto Itacoatiara, Porto Coari (separe por vírgula)" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tempo estimado de percurso *</label>
              <input name="tempoEstimado" className="form-input" value={form.tempoEstimado} onChange={handleChange} required placeholder="Ex: 8h, 2 dias" />
            </div>
            <div className="form-group">
              <label className="form-label">Frequência *</label>
              <select name="frequencia" className="form-select" value={form.frequencia} onChange={handleChange}>
                <option>Diária</option>
                <option>Semanal</option>
                <option>Quinzenal</option>
                <option>Mensal</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Dias/horários habituais de saída *</label>
            <input name="diasHorarios" className="form-input" value={form.diasHorarios} onChange={handleChange} required placeholder="Ex: Terças e Sextas às 06:00" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Capacidade livre (kg) *</label>
              <input name="capacidadeLivre" type="number" className="form-input" value={form.capacidadeLivre} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label className="form-label">Preço do frete (R$) *</label>
              <input name="precoFrete" type="number" className="form-input" value={form.precoFrete} onChange={handleChange} required min="0" step="0.01" />
            </div>
          </div>

          <div className="alert alert-info mt-1 mb-2" style={{ fontSize: '0.82rem' }}>
            <FiInfo /> Rotas podem ser marcadas como indisponíveis sazonalmente (cheia/seca) após o cadastro.
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Cadastrar Rota
          </button>
        </form>
      </div>
    </div>
  );
}
