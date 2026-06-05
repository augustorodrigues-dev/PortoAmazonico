const statusMap = {
  disponivel:          { label: 'Disponível',            cls: 'badge-verde' },
  esgotado:            { label: 'Esgotado',              cls: 'badge-cinza' },
  aguardando_retirada: { label: 'Aguard. Retirada',      cls: 'badge-amarelo' },
  em_transito:         { label: 'Em Trânsito',           cls: 'badge-azul' },
  entregue:            { label: 'Entregue',              cls: 'badge-verde' },
  paga:                { label: 'Paga',                  cls: 'badge-amarelo' },
  cancelada:           { label: 'Cancelada',             cls: 'badge-vermelho' },
  online:              { label: 'Online',                cls: 'badge-verde' },
  offline:             { label: 'Offline',               cls: 'badge-vermelho' },
  aberta:              { label: 'Aberta',                cls: 'badge-vermelho' },
  resolvida:           { label: 'Resolvida',             cls: 'badge-verde' },
};

export default function StatusBadge({ status }) {
  const info = statusMap[status] ?? { label: status, cls: 'badge-cinza' };
  return <span className={`badge ${info.cls}`}>{info.label}</span>;
}
