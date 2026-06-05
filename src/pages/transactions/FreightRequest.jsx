import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { mockUsers, mockTaxas } from '../../data/mockData';
import PIXModal from '../../components/PIXModal';
import RatingStars from '../../components/RatingStars';
import {FiAnchor, FiCheck} from 'react-icons/fi';

export default function FreightRequest() {
  const { id } = useParams();
  const { transacoes, adicionarTransacao, rotas } = useApp();
  const navigate = useNavigate();

  const transacao = transacoes.find((t) => t.id === id);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const [pixAberto, setPixAberto] = useState(false);

  if (!transacao) {
    return (
      <div className="page-body">
        <div className="card text-center">
          <p className="text-muted" style={{ padding: '2rem' }}>Transação não encontrada.</p>
        </div>
      </div>
    );
  }

  function calcularFrete(rota) {
    const taxa = rota.precoFrete * (mockTaxas.taxaFrete / 100);
    return { valorFrete: rota.precoFrete, taxa, total: rota.precoFrete + taxa };
  }

  function handleConfirmarFrete() {
    navigate('/historico');
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1><FiAnchor /> Solicitar Frete</h1>
        <p>UC09 — Selecione um freteiro para transportar sua carga</p>
      </div>

      <div className="alert alert-info mb-2">
        Compra: <strong>{transacao.quantidade} {transacao.produto}</strong> — Porto de retirada da mercadoria.
      </div>

      <div className="cards-grid">
        {rotas.filter((r) => r.disponivel).map((rota) => {
          const { valorFrete, taxa, total } = calcularFrete(rota);
          const freteiro = rota.freteiro;
          const selecionado = rotaSelecionada?.id === rota.id;

          return (
            <div key={rota.id} className="card" style={{ border: selecionado ? '2px solid var(--verde-medio)' : '2px solid transparent' }}>
              <div className="card-header">
                <span className="card-title">{rota.origem} → {rota.destino}</span>
                <RatingStars nota={Math.round(freteiro.reputacao)} />
              </div>
              <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div className="flex-between"><span className="text-muted">Freteiro</span><span className="font-bold">{freteiro.nome}</span></div>
                <div className="flex-between"><span className="text-muted">Embarcação</span><span>{freteiro.embarcacao?.nome}</span></div>
                <div className="flex-between"><span className="text-muted">Tempo</span><span>{rota.tempoEstimado}</span></div>
                <div className="flex-between"><span className="text-muted">Saídas</span><span>{rota.diasHorarios}</span></div>
                <div className="flex-between"><span className="text-muted">Cap. livre</span><span>{rota.capacidadeLivre.toLocaleString()} kg</span></div>
                <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                <div className="flex-between"><span>Frete</span><span>R$ {valorFrete.toFixed(2).replace('.', ',')}</span></div>
                <div className="flex-between"><span className="text-muted" style={{ fontSize: '0.8rem' }}>Taxa ({mockTaxas.taxaFrete}%)</span><span className="text-muted" style={{ fontSize: '0.8rem' }}>R$ {taxa.toFixed(2).replace('.', ',')}</span></div>
                <div className="flex-between font-bold"><span>Total frete</span><span style={{ color: 'var(--azul-rio)' }}>R$ {total.toFixed(2).replace('.', ',')}</span></div>
              </div>
              <button
                className={`btn w-full mt-2 ${selecionado ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setRotaSelecionada(rota)}
              >
                {selecionado ? <><FiCheck /> Selecionado</> : 'Selecionar Freteiro'}
              </button>
            </div>
          );
        })}
      </div>

      {rotaSelecionada && (
        <div className="card mt-2" style={{ maxWidth: 400 }}>
          <p style={{ marginBottom: '1rem' }}>
            Confirmar frete com <strong>{rotaSelecionada.freteiro.nome}</strong>?
          </p>
          <button className="btn btn-secondary w-full" onClick={() => setPixAberto(true)}>
            Pagar Frete via PIX
          </button>
        </div>
      )}

      {pixAberto && rotaSelecionada && (
        <PIXModal
          valor={calcularFrete(rotaSelecionada).total}
          descricao={`Frete: ${rotaSelecionada.origem} → ${rotaSelecionada.destino}`}
          onConfirmar={handleConfirmarFrete}
          onFechar={() => setPixAberto(false)}
        />
      )}
    </div>
  );
}
