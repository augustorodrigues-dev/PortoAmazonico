import { useState } from 'react';
import { FiCreditCard, FiX, FiAlertTriangle, FiCheck } from 'react-icons/fi';

// Gera uma grade 7x7 aleatória preta/branca simulando QR code
function gerarQR() {
  return Array.from({ length: 49 }, () => Math.random() > 0.45);
}

export default function PIXModal({ valor, descricao, onConfirmar, onFechar }) {
  const [pago, setPago] = useState(false);
  const [cells] = useState(gerarQR);

  function handleConfirmar() {
    setPago(true);
    setTimeout(() => {
      onConfirmar();
    }, 1200);
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title"><FiCreditCard /> Pagamento via PIX</span>
          {!pago && (
            <button className="modal-close" onClick={onFechar}>
              <FiX />
            </button>
          )}
        </div>

        {!pago ? (
          <>
            <div className="text-center mb-2">
              <p className="text-muted">{descricao}</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--verde-floresta)', margin: '0.75rem 0' }}>
                R$ {valor.toFixed(2).replace('.', ',')}
              </p>
            </div>

            <div className="text-center mb-2">
              <div className="qr-code-fake">
                {cells.map((filled, i) => (
                  <div
                    key={i}
                    className="qr-cell"
                    style={{ background: filled ? '#111' : '#fff' }}
                  />
                ))}
              </div>
              <p className="text-muted mt-1" style={{ fontSize: '0.78rem' }}>
                Escaneie o QR Code ou use a chave PIX abaixo
              </p>
              <code
                style={{
                  display: 'block',
                  background: 'var(--cinza-suave)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  marginTop: '0.5rem',
                  wordBreak: 'break-all',
                }}
              >
                00020126580014BR.GOV.BCB.PIX0136porto-digital-amazonia@pix.com520400005303986540{valor.toFixed(2)}5802BR5913Porto Digital6008MANAUS62070503***6304FAKE
              </code>
            </div>

            <div className="alert alert-warning mt-2">
              <FiAlertTriangle /> Simulação — clique em "Confirmar Pagamento" para avançar.
            </div>

            <button className="btn btn-primary w-full mt-2" onClick={handleConfirmar}>
              <FiCheck /> Confirmar Pagamento
            </button>
          </>
        ) : (
          <div className="text-center mt-2">
            <div style={{ fontSize: '3rem' }}><FiCheck /></div>
            <p style={{ fontWeight: 700, color: 'var(--verde-floresta)', marginTop: '0.5rem' }}>
              Pagamento confirmado!
            </p>
            <p className="text-muted">Redirecionando...</p>
          </div>
        )}
      </div>
    </div>
  );
}
