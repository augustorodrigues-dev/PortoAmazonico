import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const statusOrdem = [
  { key: 'paga',                label: 'Paga — Aguardando Retirada',    desc: 'Pagamento confirmado pela plataforma.' },
  { key: 'aguardando_retirada', label: 'Aguardando Retirada',           desc: 'Produtor notificado. Aguardando coleta no porto de origem.' },
  { key: 'em_transito',         label: 'Em Trânsito',                   desc: 'Mercadoria retirada e em movimento.' },
  { key: 'destino',             label: 'Chegou ao Porto de Destino',    desc: 'Carga chegou ao porto de destino.' },
  { key: 'entregue',            label: 'Entregue',                      desc: 'Entrega confirmada pelo comprador.' },
];

function getOrdemIndex(status) {
  const mapa = {
    aguardando_retirada: 1,
    em_transito: 2,
    destino: 3,
    entregue: 4,
  };
  return mapa[status] ?? 0;
}

export default function TrackCargo() {
  const { id } = useParams();
  const { transacoes } = useApp();
  const navigate = useNavigate();

  const transacao = transacoes.find((t) => t.id === id);

  if (!transacao) {
    return (
      <div className="page-body">
        <div className="card text-center">
          <p className="text-muted" style={{ padding: '2rem' }}>Transação não encontrada.</p>
        </div>
      </div>
    );
  }

  const ordemAtual = getOrdemIndex(transacao.status);

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>📡 Rastrear Carga</h1>
        <p>UC10 — Acompanhe o status da mercadoria em tempo real</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="card-header">
          <span className="card-title">{transacao.produto}</span>
          <span className="text-muted" style={{ fontSize: '0.82rem' }}>{transacao.dataCriacao}</span>
        </div>

        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <div className="flex-between"><span className="text-muted">Quantidade</span><span>{transacao.quantidade} unid.</span></div>
          <div className="flex-between mt-1"><span className="text-muted">Valor pago</span><span className="font-bold text-verde">R$ {transacao.totalPago.toFixed(2).replace('.', ',')}</span></div>
          {transacao.freteiro && (
            <div className="flex-between mt-1"><span className="text-muted">Freteiro</span><span>{transacao.freteiro.nome}</span></div>
          )}
        </div>

        <div className="track-steps">
          {statusOrdem.slice(1).map((step, i) => {
            const stepIndex = i + 1;
            const done = ordemAtual > stepIndex;
            const current = ordemAtual === stepIndex;
            const dotClass = done ? 'done' : current ? 'current' : 'pending';
            return (
              <div key={step.key} className="track-step">
                <div className={`track-dot ${dotClass}`}>
                  {done ? '✓' : current ? '●' : '○'}
                </div>
                <div className="track-info">
                  <h4 style={{ color: done || current ? 'var(--cinza-texto)' : '#aaa' }}>{step.label}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex gap-1">
          {transacao.status === 'aguardando_retirada' && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/transacoes/${id}/retirada`)}>
              Confirmar Retirada
            </button>
          )}
          {transacao.status === 'em_transito' && (
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/transacoes/${id}/entrega`)}>
              Confirmar Entrega
            </button>
          )}
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/historico')}>
            ← Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
