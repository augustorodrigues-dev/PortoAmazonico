import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FiPackage, FiDollarSign, FiCheck } from 'react-icons/fi';

export default function ConfirmDelivery() {
  const { id } = useParams();
  const { transacoes, atualizarStatusTransacao } = useApp();
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

  function handleConfirmar() {
    atualizarStatusTransacao(id, 'entregue');
    navigate(`/transacoes/${id}/avaliar`);
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1><FiPackage /> Confirmar Entrega no Destino</h1>
        <p>UC12 — Confirme que a mercadoria chegou ao destino final</p>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div className="flex-between"><span className="text-muted">Produto</span><span className="font-bold">{transacao.produto}</span></div>
          <div className="flex-between"><span className="text-muted">Quantidade</span><span>{transacao.quantidade} unid.</span></div>
          <div className="flex-between"><span className="text-muted">Total pago</span><span className="font-bold text-verde">R$ {transacao.totalPago.toFixed(2).replace('.', ',')}</span></div>
          {transacao.freteiro && (
            <div className="flex-between">
              <span className="text-muted">Freteiro</span>
              <span>{transacao.freteiro.nome}</span>
            </div>
          )}
        </div>

        {transacao.freteiro && (
          <div className="alert alert-info mb-2" style={{ fontSize: '0.82rem' }}>
            <FiDollarSign /> Ao confirmar, o pagamento do frete será liberado ao freteiro.
          </div>
        )}

        <button className="btn btn-primary w-full" onClick={handleConfirmar}>
          <FiCheck /> Confirmar Entrega
        </button>
        <button className="btn btn-outline w-full mt-1" onClick={() => navigate('/historico')}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
