import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import { MdHistory, MdStar } from 'react-icons/md';

const statusLabel = {
  aguardando_retirada: 'Aguard. Retirada',
  em_transito: 'Em Trânsito',
  entregue: 'Entregue',
  cancelada: 'Cancelada',
};

export default function TransactionHistory() {
  const { usuario } = useAuth();
  const { transacoes } = useApp();
  const navigate = useNavigate();

  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');

  const minhasTransacoes = transacoes.filter(
    (t) => t.compradorId === usuario?.id || t.produtorId === usuario?.id
  );

  const filtradas = minhasTransacoes.filter((t) => {
    if (filtroStatus && t.status !== filtroStatus) return false;
    if (filtroPeriodo) {
      const [ano, mes] = filtroPeriodo.split('-');
      if (!t.dataCriacao.startsWith(`${ano}-${mes}`)) return false;
    }
    return true;
  });

  function getPapel(t) {
    if (t.compradorId === usuario?.id) return 'Comprador';
    return 'Produtor';
  }

  function getOutraParte(t) {
    if (t.compradorId === usuario?.id) {
      return mockUsers.find((u) => u.id === t.produtorId)?.nome ?? '—';
    }
    return mockUsers.find((u) => u.id === t.compradorId)?.nome ?? '—';
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1><MdHistory style={{ verticalAlign: 'middle', marginRight: 8 }} />Histórico de Transações</h1>
        <p>UC15 — Consulte todas as suas operações na plataforma</p>
      </div>

      {/* Filtros */}
      <div className="card mb-2">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
              <option value="">Todos</option>
              <option value="aguardando_retirada">Aguardando Retirada</option>
              <option value="em_transito">Em Trânsito</option>
              <option value="entregue">Entregue</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Período (mês/ano)</label>
            <input type="month" className="form-input" value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)} />
          </div>
        </div>
      </div>

      {filtradas.length === 0 ? (
        <div className="card text-center">
          <p className="text-muted" style={{ padding: '2rem' }}>Nenhuma transação encontrada.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Produto</th>
                  <th>Qtd.</th>
                  <th>Papel</th>
                  <th>Contraparte</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((t) => (
                  <tr key={t.id}>
                    <td>{t.dataCriacao}</td>
                    <td className="font-bold">{t.produto}</td>
                    <td>{t.quantidade}</td>
                    <td><span className={`badge ${getPapel(t) === 'Comprador' ? 'badge-azul' : 'badge-verde'}`}>{getPapel(t)}</span></td>
                    <td>{getOutraParte(t)}</td>
                    <td className="font-bold" style={{ color: 'var(--verde-floresta)' }}>
                      R$ {t.totalPago.toFixed(2).replace('.', ',')}
                    </td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-sm btn-outline" onClick={() => navigate(`/transacoes/${t.id}/rastrear`)}>
                          Rastrear
                        </button>
                        {t.status === 'aguardando_retirada' && getPapel(t) === 'Comprador' && (
                          <button className="btn btn-sm btn-primary" onClick={() => navigate(`/transacoes/${t.id}/retirada`)}>
                            Retirar
                          </button>
                        )}
                        {t.status === 'em_transito' && getPapel(t) === 'Comprador' && (
                          <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/transacoes/${t.id}/entrega`)}>
                            Entregar
                          </button>
                        )}
                        {t.status === 'entregue' && !t.avaliacao && (
                          <button className="btn btn-sm btn-outline" onClick={() => navigate(`/transacoes/${t.id}/avaliar`)}>
                            <MdStar style={{ verticalAlign: 'middle', marginRight: 4 }} />Avaliar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
