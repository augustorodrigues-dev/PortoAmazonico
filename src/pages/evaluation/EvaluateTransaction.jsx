import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../data/mockData';
import RatingStars from '../../components/RatingStars';
import { FiStar } from 'react-icons/fi';

export default function EvaluateTransaction() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const { transacoes, avaliarTransacao } = useApp();
  const navigate = useNavigate();

  const transacao = transacoes.find((t) => t.id === id);
  const [notaProdutor, setNotaProdutor] = useState(0);
  const [comentarioProdutor, setComentarioProdutor] = useState('');
  const [notaComprador, setNotaComprador] = useState(0);
  const [comentarioComprador, setComentarioComprador] = useState('');
  const [notaFreteiro, setNotaFreteiro] = useState(0);
  const [comentarioFreteiro, setComentarioFreteiro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  if (!transacao) {
    return (
      <div className="page-body">
        <div className="card text-center">
          <p className="text-muted" style={{ padding: '2rem' }}>Transação não encontrada.</p>
        </div>
      </div>
    );
  }

  if (transacao.status !== 'entregue') {
    return (
      <div className="page-body">
        <div className="alert alert-warning">
          A avaliação só está disponível após a confirmação de entrega.
        </div>
      </div>
    );
  }

  const produtor = mockUsers.find((u) => u.id === transacao.produtorId);
  const comprador = mockUsers.find((u) => u.id === transacao.compradorId);

  function handleSubmit(e) {
    e.preventDefault();
    const avaliacao = {
      compradorAoProdutor: { nota: notaProdutor, comentario: comentarioProdutor },
      produtorAoComprador: { nota: notaComprador, comentario: comentarioComprador },
      ...(transacao.freteiro ? { aoFreteiro: { nota: notaFreteiro, comentario: comentarioFreteiro } } : {}),
    };
    avaliarTransacao(id, avaliacao);
    setSucesso(true);
    setTimeout(() => navigate('/historico'), 2500);
  }

  if (sucesso) {
    return (
      <div className="page-body">
        <div className="card text-center" style={{ maxWidth: 400, margin: '3rem auto' }}>
          <div style={{ fontSize: '3rem' }}><FiStar /></div>
          <h2 className="text-verde mt-2">Avaliação enviada!</h2>
          <p className="text-muted mt-1">Obrigado por contribuir com a reputação da comunidade.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      <div className="page-header">
        <h1><FiStar /> Avaliar Transação</h1>
        <p>UC13 — Avalie os participantes e contribua com o sistema de reputação</p>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        <div className="alert alert-success mb-2">
          Transação <strong>#{transacao.id}</strong> — {transacao.produto}, {transacao.quantidade} unid. — concluída com sucesso.
        </div>

        <form onSubmit={handleSubmit}>
          {/* Avaliação do produtor */}
          {usuario.id !== transacao.produtorId && (
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' }}>
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--verde-floresta)' }}>
                Avalie o Produtor: {produtor?.nome}
              </h3>
              <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '0.5rem' }}>Qualidade, pontualidade, conformidade da mercadoria</p>
              <RatingStars nota={notaProdutor} onSelect={setNotaProdutor} />
              <textarea
                className="form-textarea mt-1"
                placeholder="Comentário opcional..."
                value={comentarioProdutor}
                onChange={(e) => setComentarioProdutor(e.target.value)}
                style={{ minHeight: 60, marginTop: '0.5rem' }}
              />
            </div>
          )}

          {/* Avaliação do comprador */}
          {usuario.id !== transacao.compradorId && (
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: transacao.freteiro ? '1px solid #eee' : 'none' }}>
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--verde-floresta)' }}>
                Avalie o Comprador: {comprador?.nome}
              </h3>
              <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '0.5rem' }}>Pagamento, comunicação</p>
              <RatingStars nota={notaComprador} onSelect={setNotaComprador} />
              <textarea
                className="form-textarea mt-1"
                placeholder="Comentário opcional..."
                value={comentarioComprador}
                onChange={(e) => setComentarioComprador(e.target.value)}
                style={{ minHeight: 60, marginTop: '0.5rem' }}
              />
            </div>
          )}

          {/* Avaliação do freteiro */}
          {transacao.freteiro && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem', color: 'var(--azul-rio)' }}>
                Avalie o Freteiro: {transacao.freteiro.nome}
              </h3>
              <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '0.5rem' }}>Cuidado com a carga, pontualidade</p>
              <RatingStars nota={notaFreteiro} onSelect={setNotaFreteiro} />
              <textarea
                className="form-textarea mt-1"
                placeholder="Comentário opcional..."
                value={comentarioFreteiro}
                onChange={(e) => setComentarioFreteiro(e.target.value)}
                style={{ minHeight: 60, marginTop: '0.5rem' }}
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Enviar Avaliações
          </button>
        </form>
      </div>
    </div>
  );
}
