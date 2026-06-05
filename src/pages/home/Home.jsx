import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAgriculture, MdInventory, MdRoute, MdSearch, MdLocalShipping, MdGpsFixed, MdCheckCircle, MdStar, MdHistory, MdBarChart, MdSettings, MdCameraAlt } from 'react-icons/md';
import { GiFarmer, GiSailboat } from 'react-icons/gi';
import { FiShoppingCart } from 'react-icons/fi';
import RegisterModal from '../../components/RegisterModal';

export default function Home() {
  const [modalPapel, setModalPapel] = useState(null);
  const navigate = useNavigate();

  return (
    <div style={{ flex: 1, backgroundColor: 'var(--areia)' }}>
      <RegisterModal
        open={modalPapel !== null}
        onClose={() => setModalPapel(null)}
        papel={modalPapel}
      />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, var(--sidebar-bg) 0%, var(--nav-bg) 100%)',
        color: 'var(--branco)',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
      }}>
        <img src="/logo.png" alt="Porto Digital Amazônico" style={{ height: '250px', filter: 'brightness(0) invert(1)' }} />
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Porto Digital Amazônico
        </h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '720px', margin: '0 auto', opacity: 0.92, lineHeight: 1.8 }}>
          Conectando rios, pessoas e oportunidades através da tecnologia.
        </p>

        {/* BOTÕES DE AÇÃO PRINCIPAIS */}
        <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          {/* Botão do Computador (Apresentador) */}
          <button 
            className="btn btn-primary" 
            style={{ 
              padding: '18px 40px', 
              fontSize: '1.4rem', 
              backgroundColor: 'var(--verde-floresta)', 
              color: 'var(--branco)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => window.location.href = '/dashboard'} /* Ajuste para a rota do seu Dashboard se não for /painel */
          >
            Iniciar Dinâmica
          </button>

          {/* NOVO Botão do Celular (Plateia) */}
          <button 
            className="btn btn-primary" 
            style={{ 
              padding: '18px 40px', 
              fontSize: '1.4rem', 
              backgroundColor: 'var(--azul-rio)', 
              color: 'var(--branco)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => window.location.href = '/producao/anunciar'} /* Garanta que esta é a rota do AnnounceGoods.jsx */
          >
            <MdCameraAlt size={24} /> Enviar Desenho (Celular)
          </button>

        </div>
      </div>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '3rem 2rem' }}>

        <GrupoFuncionalidades
          cor="var(--verde-floresta)"
          iconeGrupo={<GiFarmer />}
          titulo="Para Produtores"
          cards={[
            {
              icon: <MdAgriculture />,
              titulo: 'Registrar Colheita',
              descricao: 'Informe suas safras disponíveis com tipo de produto, quantidade estimada e data de disponibilidade, para que compradores saibam o que está chegando.',
            },
            {
              icon: <MdInventory />,
              titulo: 'Anunciar Mercadorias',
              descricao: 'Publique seus produtos no catálogo digital com preço, descrição e quantidade disponível, alcançando compradores em toda a região fluvial.',
            },
          ]}
        />

        <GrupoFuncionalidades
          cor="var(--azul-rio)"
          iconeGrupo={<GiSailboat />}
          titulo="Para Fretistas"
          cards={[
            {
              icon: <MdRoute />,
              titulo: 'Registrar Rota Fluvial',
              descricao: 'Cadastre os trajetos que você percorre regularmente com origem, destino, capacidade de carga e datas disponíveis para que produtores e compradores possam encontrá-lo.',
            },
            {
              icon: <MdSearch />,
              titulo: 'Buscar Solicitações de Frete',
              descricao: 'Visualize pedidos de transporte em aberto e ofereça seus serviços diretamente a produtores e compradores, preenchendo sua capacidade sem desperdício.',
            },
          ]}
        />

        <GrupoFuncionalidades
          cor="var(--terra)"
          iconeGrupo={<FiShoppingCart />}
          titulo="Para Compradores"
          cards={[
            {
              icon: <MdInventory />,
              titulo: 'Catálogo de Produtos',
              descricao: 'Navegue pelos produtos disponíveis diretamente dos produtores ribeirinhos, com preço, origem e quantidade disponível atualizada em tempo real.',
            },
            {
              icon: <MdLocalShipping />,
              titulo: 'Solicitar Frete',
              descricao: 'Contrate um fretista para transportar sua carga entre portos com registro digital completo da operação, garantindo segurança e rastreabilidade.',
            },
          ]}
        />

        <div style={{ marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cinza-texto)', marginBottom: '1.25rem', borderBottom: '2px solid #e5e0d8', paddingBottom: '0.6rem' }}>
            Para todos os usuários
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <FuncCard icon={<MdGpsFixed />} cor="var(--azul-rio)" titulo="Rastrear Carga" descricao="Acompanhe o status da sua mercadoria em tempo real, desde a retirada no porto de origem até a entrega no destino final." />
            <FuncCard icon={<MdCheckCircle />} cor="var(--verde-floresta)" titulo="Confirmar Retirada e Entrega" descricao="Registre digitalmente cada etapa do transporte com confirmação de coleta e entrega, criando um histórico imutável da operação." />
            <FuncCard icon={<MdStar />} cor="var(--terra)" titulo="Avaliar Transações" descricao="Após cada operação, avalie produtores e fretistas com estrelas e comentários, construindo uma rede de reputação e confiança." />
            <FuncCard icon={<MdHistory />} cor="var(--cinza-texto)" titulo="Histórico de Transações" descricao="Acesse o registro completo de todas as suas operações anteriores, com detalhes de valores, datas, produtos e participantes." />
            <FuncCard icon={<MdBarChart />} cor="var(--azul-rio)" titulo="Indicadores" descricao="Visualize métricas de desempenho como volume movimentado, fretes realizados e avaliações recebidas para tomar melhores decisões." />
            <FuncCard icon={<MdSettings />} cor="var(--vermelho-alerta)" titulo="Painel Administrativo" descricao="Gestores têm acesso a um painel completo para monitorar usuários, transações e o funcionamento geral da plataforma." />
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', padding: '0 2rem 1.5rem', color: 'var(--verde-floresta)', fontWeight: 700, fontSize: '1.1rem' }}>
        Como você quer entrar?
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', padding: '0 2rem 4rem' }}>
        <EntradaBox icon={<GiFarmer />} titulo="Sou Produtor" descricao="Cadastre colheitas, anuncie mercadorias e receba pagamentos de forma segura." cor="var(--verde-floresta)" onClick={() => setModalPapel('produtor')} />
        <EntradaBox icon={<GiSailboat />} titulo="Sou Fretista" descricao="Registre suas rotas fluviais e ofereça transporte para cargas de todo o Amazonas." cor="var(--azul-rio)" onClick={() => setModalPapel('fretista')} />
        <EntradaBox icon={<FiShoppingCart />} titulo="Sou Comprador" descricao="Acesse o catálogo de produtos direto da floresta e compre com rastreabilidade." cor="var(--terra)" onClick={() => setModalPapel('comprador')} />
      </div>

      {/* Rodapé de créditos */}
      <div style={{ textAlign: 'center', padding: '2rem 2rem 3rem', borderTop: '1px solid #e5e0d8' }}>
        <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '0.6rem' }}>Líder do projeto · Augusto Pereira Rodrigues</p>
        <p style={{ fontSize: '0.78rem', color: '#bbb', maxWidth: '680px', margin: '0 auto', lineHeight: 1.9 }}>
          Andrey de Matos Gonçalves · Everton Gustavo de Oliveira da Silva · Felipe Vieira Brazão e Silva ·
          Gabriel Leite Serruya de Saboya · Igor Cecim Vilhena · João Vitor Rath ·
          Pedro Paulo de Magalhães Bezerra Filho · Yuri Monteiro Alencar Aguiar
        </p>
      </div>

    </div>
  );
}

function GrupoFuncionalidades({ cor, iconeGrupo, titulo, cards }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '1.6rem', color: cor }}>{iconeGrupo}</div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: cor, borderBottom: `2px solid ${cor}`, paddingBottom: '0.3rem', flex: 1 }}>{titulo}</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        {cards.map(c => <FuncCard key={c.titulo} icon={c.icon} cor={cor} titulo={c.titulo} descricao={c.descricao} />)}
      </div>
    </div>
  );
}

function FuncCard({ icon, cor, titulo, descricao }) {
  return (
    <div style={{ background: 'var(--branco)', borderRadius: 'var(--radius)', boxShadow: 'var(--sombra)', padding: '1.25rem 1.25rem 1.25rem 1rem', borderLeft: `4px solid ${cor}`, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '1.6rem', color: cor, flexShrink: 0, marginTop: '0.1rem' }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.97rem', color: 'var(--cinza-texto)', marginBottom: '0.4rem' }}>{titulo}</div>
        <p style={{ fontSize: '0.87rem', color: '#666', lineHeight: 1.65, margin: 0 }}>{descricao}</p>
      </div>
    </div>
  );
}

function EntradaBox({ icon, titulo, descricao, cor, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: 'var(--branco)', borderRadius: 'var(--radius)', boxShadow: 'var(--sombra)', padding: '2rem 1.75rem', width: '260px', textAlign: 'center', borderTop: `4px solid ${cor}`, cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--sombra)'; }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{icon}</div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: cor, marginBottom: '0.6rem' }}>{titulo}</h3>
      <p style={{ fontSize: '0.92rem', color: '#555', lineHeight: 1.65 }}>{descricao}</p>
    </div>
  );
}