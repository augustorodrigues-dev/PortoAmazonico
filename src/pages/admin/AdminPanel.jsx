import { useState } from 'react';
import { mockTotens, mockTaxas, mockDisputas, mockUsers, mockTransacoes } from '../../data/mockData';
import StatusBadge from '../../components/StatusBadge';
import { FiDollarSign, FiSettings, FiCheck, FiPlay, FiPause, FiRefreshCw } from 'react-icons/fi';
import { MdDesktopMac, MdGavel } from 'react-icons/md';

export default function AdminPanel() {
  const [aba, setAba] = useState('totens');
  const [totens, setTotens] = useState(mockTotens);
  const [taxaProduto, setTaxaProduto] = useState(mockTaxas.taxaProduto);
  const [taxaFrete, setTaxaFrete] = useState(mockTaxas.taxaFrete);
  const [taxasSalvas, setTaxasSalvas] = useState(false);
  const [disputas, setDisputas] = useState(mockDisputas);
  const [resolucaoTexto, setResolucaoTexto] = useState('');
  const [disputaSelecionada, setDisputaSelecionada] = useState(null);

  function toggleTotem(id) {
    setTotens((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'online' ? 'offline' : 'online', ultimaAtividade: new Date().toLocaleString('pt-BR') }
          : t
      )
    );
  }

  function salvarTaxas(e) {
    e.preventDefault();
    setTaxasSalvas(true);
    setTimeout(() => setTaxasSalvas(false), 3000);
  }

  function resolverDisputa(id) {
    if (!resolucaoTexto.trim()) return;
    setDisputas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'resolvida', resolucao: resolucaoTexto } : d))
    );
    setDisputaSelecionada(null);
    setResolucaoTexto('');
  }

  function getTransacao(id) {
    return mockTransacoes.find((t) => t.id === id);
  }

  function getUsuario(id) {
    return mockUsers.find((u) => u.id === id);
  }

  const abas = [
    { key: 'totens', label: <><MdDesktopMac /> Totens Digitais</> },
    { key: 'taxas', label: <><FiDollarSign /> Taxas</> },
    { key: 'disputas', label: <><MdGavel /> Disputas</> },
  ];

  return (
    <div className="page-body">
      <div className="page-header">
        <h1><FiSettings /> Painel de Administração</h1>
        <p>UC17, UC18, UC19 — Gerencie totens, taxas e disputas</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--verde-suave)', paddingBottom: '0' }}>
        {abas.map((a) => (
          <button
            key={a.key}
            onClick={() => setAba(a.key)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: aba === a.key ? 'var(--verde-floresta)' : 'transparent',
              color: aba === a.key ? 'white' : 'var(--cinza-texto)',
              borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
              fontWeight: aba === a.key ? 700 : 400,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* ── ABA: TOTENS ── */}
      {aba === 'totens' && (
        <div>
          <div className="stat-cards mb-2">
            <div className="stat-card">
              <div className="stat-icon"><FiCheck /></div>
              <div className="stat-info">
                <h3>{totens.filter((t) => t.status === 'online').length}</h3>
                <p>Totens online</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><FiPause /></div>
              <div className="stat-info">
                <h3>{totens.filter((t) => t.status === 'offline').length}</h3>
                <p>Totens offline</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Porto</th>
                    <th>Status</th>
                    <th>Última Atividade</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {totens.map((t) => (
                    <tr key={t.id}>
                      <td className="font-bold">{t.porto}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td>{t.ultimaAtividade}</td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            className={`btn btn-sm ${t.status === 'online' ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => toggleTotem(t.id)}
                          >
                            {t.status === 'online' ? <><FiPause /> Desativar</> : <><FiPlay /> Ativar</>}
                          </button>
                          <button className="btn btn-sm btn-outline"><FiRefreshCw /> Reiniciar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ABA: TAXAS ── */}
      {aba === 'taxas' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-header">
            <span className="card-title">Configurar Taxas da Plataforma</span>
          </div>

          {taxasSalvas && (
            <div className="alert alert-success mb-2">
              <FiCheck /> Taxas atualizadas! Aplicadas nas próximas transações.
            </div>
          )}

          <form onSubmit={salvarTaxas}>
            <div className="form-group">
              <label className="form-label">Taxa sobre vendas de produtos (%)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                max="100"
                step="0.1"
                value={taxaProduto}
                onChange={(e) => setTaxaProduto(Number(e.target.value))}
              />
              <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Atual: {taxaProduto}% — cobrado sobre o valor do produto na compra
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Taxa sobre fretes (%)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                max="100"
                step="0.1"
                value={taxaFrete}
                onChange={(e) => setTaxaFrete(Number(e.target.value))}
              />
              <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                Atual: {taxaFrete}% — cobrado sobre o valor do frete contratado
              </p>
            </div>

            <div style={{ background: 'var(--areia)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1rem', fontSize: '0.88rem' }}>
              <strong>Exemplo de cobrança:</strong><br />
              Produto de R$ 500,00 → Taxa: R$ {(500 * taxaProduto / 100).toFixed(2).replace('.', ',')}<br />
              Frete de R$ 150,00 → Taxa: R$ {(150 * taxaFrete / 100).toFixed(2).replace('.', ',')}
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Salvar Taxas
            </button>
          </form>
        </div>
      )}

      {/* ── ABA: DISPUTAS ── */}
      {aba === 'disputas' && (
        <div>
          {disputas.length === 0 ? (
            <div className="card text-center">
              <p className="text-muted" style={{ padding: '2rem' }}>Nenhuma disputa registrada.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {disputas.map((d) => {
                const transacao = getTransacao(d.transacaoId);
                const abertaPor = getUsuario(d.abertaPor);
                return (
                  <div key={d.id} className="card">
                    <div className="card-header">
                      <span className="card-title">
                        Disputa #{d.id} — {transacao?.produto}
                      </span>
                      <StatusBadge status={d.status} />
                    </div>
                    <div style={{ fontSize: '0.88rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div className="flex-between">
                        <span className="text-muted">Aberta por</span>
                        <span className="font-bold">{abertaPor?.nome}</span>
                      </div>
                      <div className="flex-between">
                        <span className="text-muted">Data</span>
                        <span>{d.dataCriacao}</span>
                      </div>
                      <div className="flex-between">
                        <span className="text-muted">Transação</span>
                        <span>#{d.transacaoId}</span>
                      </div>
                    </div>

                    <div className="alert alert-warning mb-2">
                      <strong>Relato:</strong> {d.descricao}
                    </div>

                    {d.status === 'resolvida' ? (
                      <div className="alert alert-success">
                        <strong>Resolução:</strong> {d.resolucao}
                      </div>
                    ) : (
                      <>
                        {disputaSelecionada === d.id ? (
                          <div>
                            <div className="form-group">
                              <label className="form-label">Resolução</label>
                              <textarea
                                className="form-textarea"
                                value={resolucaoTexto}
                                onChange={(e) => setResolucaoTexto(e.target.value)}
                                placeholder="Descreva a resolução (reembolso, penalidade, arquivamento...)"
                              />
                            </div>
                            <div className="flex gap-1">
                              <button className="btn btn-primary" onClick={() => resolverDisputa(d.id)}>
                                Confirmar Resolução
                              </button>
                              <button className="btn btn-outline" onClick={() => setDisputaSelecionada(null)}>
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button className="btn btn-secondary" onClick={() => setDisputaSelecionada(d.id)}>
                            <MdGavel /> Mediar Disputa
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
