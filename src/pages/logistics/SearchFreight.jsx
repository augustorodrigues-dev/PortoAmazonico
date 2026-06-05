import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { portos } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { MdDirectionsBoat, MdSearch, MdAnchor, MdArrowForward } from 'react-icons/md';

export default function SearchFreight() {
  const { rotas } = useApp();
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({ origem: '', destino: '', capacidade: '' });
  const [cargaDinamica, setCargaDinamica] = useState([]);

  useEffect(() => {
    const salvos = sessionStorage.getItem('ultimos_comprados');
    if (salvos) {
      setCargaDinamica(JSON.parse(salvos));
    }
  }, []);

  function handleFiltro(e) {
    const { name, value } = e.target;
    setFiltros((f) => ({ ...f, [name]: value }));
  }

  const rotasFiltradas = rotas.filter((r) => {
    if (filtros.origem && r.origem !== filtros.origem) return false;
    if (filtros.destino && r.destino !== filtros.destino) return false;
    if (filtros.capacidade && r.capacidadeLivre < Number(filtros.capacidade)) return false;
    return true;
  });

  const portosColeta = [...new Set(cargaDinamica.map(item => item.portoRetirada))];

  return (
    <div className="page-body">
      <div className="page-header">
        <h1><MdDirectionsBoat style={{ verticalAlign: 'middle', marginRight: 8 }} />Logística Fluvial e Rotas</h1>
        <p>Acompanhe o planejamento e escoamento das cargas pelos rios da região</p>
      </div>

      {cargaDinamica.length > 0 && (
        <div className="card mb-2" style={{ border: '2px solid var(--azul-rio)', backgroundColor: '#f0f7ff' }}>
          <div className="card-header" style={{ borderBottom: '1px solid #bae6fd' }}>
            <span className="card-title text-azul" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdAnchor /> Plano de Navegação Fluvial Ativo
            </span>
          </div>

          <div style={{ padding: '0.5rem 0' }}>
            <p style={{ marginBottom: '1rem' }}>
              Seu barco de carga foi fretado para coletar os produtos da dinâmica. Confira o itinerário planejado pelos rios:
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div style={{ textAlign: 'center', background: 'var(--azul-rio)', color: '#fff', padding: '8px 12px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                🚢 Partida
              </div>
              
              {portosColeta.map((porto, index) => (
                <div key={porto} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MdArrowForward size={20} className="text-azul" />
                  <div style={{ background: '#f8fafc', border: '1px solid var(--verde-floresta)', padding: '8px 12px', borderRadius: '4px', fontSize: '0.9rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--verde-floresta)', fontWeight: 'bold' }}>COLETA {index + 1}</div>
                    <strong>{porto}</strong>
                  </div>
                </div>
              ))}

              <MdArrowForward size={20} className="text-azul" />
              <div style={{ textAlign: 'center', background: 'var(--verde-floresta)', color: '#fff', padding: '8px 12px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                📍 Porto de Manaus (Destino Final)
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Manifesto de Carga do Porão:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              {cargaDinamica.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <img src={item.imagemBase64} alt={item.produto} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.produto}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>De: {item.nomeVendedor}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÃO SEQUENCIAL FINAL: VOLTA PARA O RANKING E RENOVA A RODADA */}
            <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #bae6fd', paddingTop: '1.5rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: 'var(--azul-rio)' }} 
                onClick={() => {
                  sessionStorage.removeItem('ultimos_comprados');
                  navigate('/dashboard');
                }}
              >
                ⚓ Finalizar Viagem e Atualizar Ranking Final
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros de Rotas Tradicionais do Sistema */}
      <div className="card mb-2">
        <div className="card-header">
          <span className="card-title"><MdSearch style={{ verticalAlign: 'middle', marginRight: 6 }} />Consultar Outras Rotas Regulares</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Origem</label>
            <select name="origem" className="form-select" value={filtros.origem} onChange={handleFiltro}>
              <option value="">Todos</option>
              {portos.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Destino</label>
            <select name="destino" className="form-select" value={filtros.destino} onChange={handleFiltro}>
              <option value="">Todos</option>
              {portos.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Capacidade mínima (kg)</label>
            <input name="capacidade" type="number" className="form-input" value={filtros.capacidade} onChange={handleFiltro} placeholder="Ex: 1000" />
          </div>
        </div>
      </div>

      {rotasFiltradas.length === 0 ? (
        <div className="card text-center">
          <p className="text-muted" style={{ padding: '2rem' }}>Nenhuma rota regular encontrada.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {rotasFiltradas.map((rota) => (
            <div key={rota.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-header">
                <span className="card-title">{rota.origem} → {rota.destino}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', flex: 1 }}>
                <div className="flex-between"><span className="text-muted">Freteiro</span><span className="font-bold">{rota.freteiro?.nome ?? '—'}</span></div>
                <div className="flex-between"><span className="text-muted">Tempo estimado</span><span>{rota.tempoEstimado || '—'}</span></div>
                <div className="flex-between"><span className="text-muted">Cap. livre</span><span className="font-bold text-verde">{rota.capacidadeLivre?.toLocaleString()} kg</span></div>
                <div className="flex-between">
                  <span className="text-muted">Preço do frete</span>
                  <span className="font-bold" style={{ color: 'var(--azul-rio)' }}>R$ {Number(rota.precoFrete).toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}