import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FiCheck, FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmPickup() {
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
    atualizarStatusTransacao(id, 'em_transito');
    navigate(`/transacoes/${id}/rastrear`);
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1><FiCheck /> Confirmar Retirada da Mercadoria</h1>
        <p>UC11 — Confirme no totem que você retirou a mercadoria do produtor</p>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="alert alert-info mb-2">
          Ao confirmar, o pagamento será liberado ao produtor.
        </div>

        <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div className="flex-between"><span className="text-muted">Produto</span><span className="font-bold">{transacao.produto}</span></div>
          <div className="flex-between"><span className="text-muted">Quantidade</span><span>{transacao.quantidade} unid.</span></div>
          <div className="flex-between"><span className="text-muted">Valor retido</span><span className="font-bold text-verde">R$ {transacao.valorProduto.toFixed(2).replace('.', ',')}</span></div>
          <div className="flex-between"><span className="text-muted">Status atual</span><span className="badge badge-amarelo">Aguardando Retirada</span></div>
        </div>

        <div className="alert alert-warning mb-2" style={{ fontSize: '0.82rem' }}>
          <FiAlertTriangle /> Ao confirmar, o status muda para "Em Trânsito" e o pagamento é liberado ao produtor.
        </div>

        <button className="btn btn-primary w-full" onClick={handleConfirmar}>
          <FiCheck /> Confirmar Retirada
        </button>
        <button className="btn btn-outline w-full mt-1" onClick={() => navigate('/historico')}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
