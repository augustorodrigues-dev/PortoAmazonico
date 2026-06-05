import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/StatusBadge';
import {
  MdAssignment, MdInventory, MdCheckCircle, MdBolt,
  MdShoppingCart, MdDirectionsBoat, MdBarChart, MdEmojiEvents, MdPerson
} from 'react-icons/md';

const iconStyle = { verticalAlign: 'middle', marginRight: '6px' };

export default function Dashboard() {
  const { usuario } = useAuth();
  const { transacoes, mercadorias, colheitas, rotas } = useApp();
  const navigate = useNavigate();

  const minhasTransacoes = transacoes.filter(
    (t) => t.compradorId === usuario?.id || t.produtorId === usuario?.id
  );

  // Lógica do Ranking Completo para a Dinâmica
  const transacoesDinamicas = transacoes.filter(t => t.id.startsWith('t_dinamica_') || t.compradorId === 'comprador_dinamico');
  
  const contagemProdutos = {};
  transacoesDinamicas.forEach(t => {
    if (!contagemProdutos[t.produto]) {
      contagemProdutos[t.produto] = {
        produto: t.produto,
        nomeVendedor: t.nomeVendedor,
        imagemBase64: t.imagemBase64,
        vendas: 0
      };
    }
    contagemProdutos[t.produto].vendas += t.quantidade;
  });

  // ORDENA DO MAIS VENDIDO PARA O MENOS VENDIDO (MOSTRANDO TODOS)
  const rankingOrdenado = Object.values(contagemProdutos)
    .sort((a, b) => b.vendas - a.vendas);

  const notasRecebidas = usuario?.papel === 'produtor'
    ? minhasTransacoes
        .filter((t) => t.produtorId === usuario.id && t.avaliacao?.compradorAoProdutor)
        .map((t) => t.avaliacao.compradorAoProdutor.nota)
    : minhasTransacoes
        .filter((t) => t.compradorId === usuario.id && t.avaliacao?.produtorAoComprador)
        .map((t) => t.avaliacao.produtorAoComprador.nota);

  return (
    <div className="page-body">
      <div className="page-header">
        <h1>Olá, {usuario?.nome.split(' ')[0]}!</h1>
        <p>Bem-vindo ao Painel do Porto Digital Amazônico</p>
      </div>

      {/* EXIBIÇÃO DO RANKING COMPLETO PARA O PERFIL ADMIN */}
      {usuario?.papel === 'admin' && (
        <div className="card mb-2" style={{ border: '2px solid gold', background: '#fffdf5' }}>
          <div className="card-header">
            <span className="card-title" style={{ color: '#b7791f', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem' }}>
              <MdEmojiEvents size={28} /> Painel de Resultados — Todos os Desenhos Vendidos
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {rankingOrdenado.length > 0 ? rankingOrdenado.map((item, index) => {
              // Define cores exclusivas para o pódio tradicional e um padrão para o resto
              let corPodio = '#cbd5e1'; // Prata genérico
              if (index === 0) corPodio = 'gold';
              if (index === 1) corPodio = '#cbd5e1';
              if (index === 2) corPodio = '#cd7f32'; // Bronze
              if (index > 2) corPodio = '#94a3b8'; // Resto dos participantes
              
              return (
                <div key={item.produto} style={{ position: 'relative', background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #fef3c7', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '32px', height: '32px', borderRadius: '50%', background: corPodio, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    {index + 1}º
                  </div>
                  <img src={item.imagemBase64} alt={item.produto} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '2px solid #f1f5f9' }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{item.produto}</h4>
                    <p style={{ margin: '2px 0', fontSize: '0.85rem', color: '#64748b' }}>Criador: <strong>{item.nomeVendedor}</strong></p>
                    <span className="badge badge-verde" style={{ fontSize: '0.85rem', padding: '4px 8px' }}>
                      {item.vendas} barco(s) fretado(s)
                    </span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-muted" style={{ padding: '1rem' }}>Nenhum barco fretado ainda. Inicie a rodada da dinâmica!</p>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid #fef3c7', paddingTop: '1.5rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ padding: '15px 30px', fontSize: '1.2rem', backgroundColor: 'var(--verde-floresta)' }} 
              onClick={() => navigate('/catalogo')}
            >
              <MdShoppingCart style={{ verticalAlign: 'middle', marginRight: '8px' }} /> 
              Iniciar Nova Rodada de Compras →
            </button>
          </div>
        </div>
      )}

      {/* Restante dos painéis originais (Produtor/Comprador/Admin) */}
      {usuario?.papel === 'produtor' && (
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-icon"><MdAssignment /></div>
            <div className="stat-info">
              <h3>{colheitas.filter((c) => c.produtorId === usuario.id).length}</h3>
              <p>Colheitas registradas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><MdInventory /></div>
            <div className="stat-info">
              <h3>{mercadorias.filter((m) => m.produtorId === usuario.id && m.status === 'disponivel').length}</h3>
              <p>Anúncios ativos</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><MdCheckCircle /></div>
            <div className="stat-info">
              <h3>{minhasTransacoes.filter((t) => t.status === 'entregue').length}</h3>
              <p>Vendas concluídas</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title"><MdBolt style={iconStyle} />Ações do Sistema</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-primary w-full" onClick={() => navigate('/catalogo')}>
              <MdShoppingCart style={iconStyle} />Abrir Mercado Fluvial
            </button>
            <button className="btn btn-outline w-full" onClick={() => navigate('/logistica/rotas')}>
              <MdDirectionsBoat style={iconStyle} />Verificar Rotas e Fretes
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <span className="card-title"><MdBarChart style={iconStyle} />Resumo Geral</span>
          </div>
          <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="flex-between"><span className="text-muted">Mercadorias ativas</span><span className="font-bold">{mercadorias.filter((m) => m.status === 'disponivel').length}</span></div>
            <div className="flex-between"><span className="text-muted">Rotas ativas</span><span className="font-bold">{rotas.filter((r) => r.disponivel).length}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}