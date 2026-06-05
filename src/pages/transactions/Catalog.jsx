import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { portos } from '../../data/mockData';
import { FiShoppingCart } from 'react-icons/fi';
import { MdLocationOn, MdPerson } from 'react-icons/md';

export default function Catalog() {
  const { mercadorias, adicionarTransacao, retirarMercadoria } = useApp();
  const navigate = useNavigate();

  const [busca, setBusca] = useState('');
  const [filtroPorto, setFiltroPorto] = useState('');
  const [carrinho, setCarrinho] = useState([]);

  // Sincroniza a limpeza do carrinho se os produtos sumirem, mas sem resetar telas
  useEffect(() => {
    setCarrinho([]);
    setBusca('');
    setFiltroPorto('');
  }, [mercadorias.length]); // Só dispara se a QUANTIDADE de itens mudar na nuvem

  // Inverte a ordem para os novos (com foto) aparecerem sempre no topo
  const filtrados = [...mercadorias]
    .reverse()
    .filter((m) => {
      if (m.status !== 'disponivel') return false;
      if (busca && !m.produto.toLowerCase().includes(busca.toLowerCase())) return false;
      if (filtroPorto && m.portoRetirada !== filtroPorto) return false;
      return true;
    });

  function toggleProdutoNoCarrinho(produto) {
    if (carrinho.find((item) => item.id === produto.id)) {
      setCarrinho(carrinho.filter((item) => item.id !== produto.id));
    } else {
      if (carrinho.length >= 3) {
        alert("Limite atingido! O barco suporta carregar apenas 3 produtos nesta viagem fluvial.");
        return;
      }
      setCarrinho([...carrinho, produto]);
    }
  }

  function handleFinalizarCompra() {
    if (carrinho.length === 0) {
      alert("Selecione pelo menos 1 produto para encher o porão do seu barco!");
      return;
    }

    // Grava as transações da dinâmica no estado global
    carrinho.forEach((item) => {
      const novaTransacao = {
        id: 't_dinamica_' + Date.now() + Math.random(),
        compradorId: 'comprador_dinamico',
        produtorId: item.produtorId,
        produto: item.produto,
        nomeVendedor: item.nomeVendedor || 'Produtor Local',
        quantidade: 1,
        portoRetirada: item.portoRetirada,
        imagemBase64: item.imagemBase64,
        status: 'aguardando_retirada',
        dataCriacao: new Date().toISOString().split('T')[0],
        totalPago: 0
      };
      
      adicionarTransacao(novaTransacao);
      retirarMercadoria(item.id, 1);
    });

    // Salva no sessionStorage para a tela de logística renderizar o mapa
    sessionStorage.setItem('ultimos_comprados', JSON.stringify(carrinho));
    
    // NAVEGAÇÃO DIRETA E IMEDIATA: Evita travar na tela por interferência do Firebase
    navigate('/logistica/rotas');
  }

  return (
    <div className="page-body">
      <div className="page-header flex-between">
        <div>
          <h1><FiShoppingCart /> Mercado Fluvial (Catálogo)</h1>
          <p>Escolha até 3 desenhos da plateia para carregar na sua embarcação</p>
        </div>
        <div className="badge badge-azul" style={{ fontSize: '1.1rem', padding: '10px 15px' }}>
          Barco: {carrinho.length} / 3 Cargas
        </div>
      </div>

      <div className="card mb-2">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Buscar Produto</label>
            <input className="form-input" placeholder="Ex: Açaí, Farinha..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Filtrar por Porto de Origem</label>
            <select className="form-select" value={filtroPorto} onChange={(e) => setFiltroPorto(e.target.value)}>
              <option value="">Todos os portos</option>
              {portos.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="card text-center">
          <p className="text-muted" style={{ padding: '2rem' }}>Nenhum desenho foi cadastrado ainda. Use o celular para enviar!</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtrados.map((m) => {
            const noCarrinho = carrinho.some((item) => item.id === m.id);
            return (
              <div key={m.id} className="card" style={{ border: noCarrinho ? '3px solid var(--azul-rio)' : '1px solid #ddd', transform: noCarrinho ? 'scale(1.02)' : 'none', transition: 'all 0.2s ease' }}>
                <div style={{ width: '100%', height: '180px', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.imagemBase64 ? (
                    <img src={m.imagemBase64} alt={m.produto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="text-muted">Sem Imagem</span>
                  )}
                </div>
                <div className="card-header" style={{ marginTop: '0.75rem' }}>
                  <span className="card-title" style={{ fontSize: '1.2rem' }}>{m.produto}</span>
                </div>
                <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.5rem 0' }}>
                  <div className="flex-between">
                    <span className="text-muted"><MdPerson /> Criador:</span>
                    <span className="font-bold">{m.nomeVendedor || "Padrão do Sistema"}</span>
                  </div>
                  <div className="flex-between">
                    <span className="text-muted"><MdLocationOn /> Saída de:</span>
                    <span className="font-bold text-verde">{m.portoRetirada}</span>
                  </div>
                </div>
                <button 
                  className={`btn w-full mt-2 ${noCarrinho ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={() => toggleProdutoNoCarrinho(m)}
                >
                  {noCarrinho ? "Remover do Barco" : "Carregar no Barco"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {carrinho.length > 0 && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100 }}>
          <button 
            className="btn btn-primary" 
            style={{ padding: '15px 30px', fontSize: '1.2rem', boxShadow: '0px 4px 10px rgba(0,0,0,0.3)', backgroundColor: 'var(--azul-rio)' }}
            onClick={handleFinalizarCompra}
          >
            Zarpar Barco com {carrinho.length} Carga(s) →
          </button>
        </div>
      )}
    </div>
  );
}