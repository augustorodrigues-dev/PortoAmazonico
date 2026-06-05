import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { portos } from '../../data/mockData';
import { MdCameraAlt, MdCheckCircle, MdPerson, MdInventory, MdDirectionsBoat, MdFullscreen, MdFullscreenExit, MdErrorOutline } from 'react-icons/md';

export default function AnnounceGoods() {
  const { adicionarMercadoria } = useApp();

  const [nomePessoa, setNomePessoa] = useState(localStorage.getItem('dinamica_nome') || '');
  const [nomeProduto, setNomeProduto] = useState(localStorage.getItem('dinamica_produto') || '');
  const [portoOrigem, setPortoOrigem] = useState(localStorage.getItem('dinamica_porto') || '');
  
  const [fotoPreview, setFotoPreview] = useState(null);
  const [sucesso, setSucesso] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(''); // <-- Nova variável para erro visual
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wantsFullscreen, setWantsFullscreen] = useState(false);

  useEffect(() => {
    localStorage.setItem('dinamica_nome', nomePessoa);
    localStorage.setItem('dinamica_produto', nomeProduto);
    localStorage.setItem('dinamica_porto', portoOrigem);
  }, [nomePessoa, nomeProduto, portoOrigem]);

  useEffect(() => {
    const handleFocus = () => {
      if (wantsFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(() => console.log("Aguardando toque para retomar tela cheia"));
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [wantsFullscreen]);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
          setWantsFullscreen(true);
        })
        .catch((err) => console.log(`Erro ao ativar tela cheia: ${err.message}`));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setWantsFullscreen(false);
    }
  }

  function handleAutoResume() {
    if (wantsFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    }
  }

  function handleFotoChange(e) {
    const file = e.target.files[0];
    if (file) {
      handleAutoResume();
      setMensagemErro(''); // Limpa o erro se a pessoa tirar a foto

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setFotoPreview(dataUrl);
        };
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagemErro('');

    if (!fotoPreview) {
      // Substituímos o alert() nativo por uma mensagem na tela para não quebrar o Fullscreen
      setMensagemErro("Por favor, tire a foto do desenho do produto antes de lançar!");
      return;
    }

    setEnviando(true);

    const novaMercadoria = {
      produtorId: 'u_dinamico',
      nomeVendedor: nomePessoa.trim(),
      produto: nomeProduto.trim(),
      imagemBase64: fotoPreview,
      portoRetirada: portoOrigem,
      quantidade: 1,
      pesoEstimado: 1,
      unidade: 'unidade',
      precoPorUnidade: 0,
      status: 'disponivel',
      dataCriacao: new Date().toISOString()
    };

    try {
      await adicionarMercadoria(novaMercadoria);
      setSucesso(true);

      setTimeout(() => {
        setSucesso(false);
        setFotoPreview(null);
        setEnviando(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setMensagemErro("Erro ao conectar com o banco de dados. Tente novamente.");
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="page-body" onClick={handleAutoResume} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--areia)' }}>
        <div className="card text-center" style={{ maxWidth: 400, width: '90%', padding: '2rem', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', color: 'var(--verde-floresta)' }}><MdCheckCircle /></div>
          <h2 className="text-verde mt-2">Produto Embarcado!</h2>
          <p className="text-muted mt-1">Sua carga foi enviada para a malha fluvial do sistema.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="page-body" 
      onClick={handleAutoResume} 
      style={{ 
        height: '100vh', 
        overflowY: 'auto', 
        WebkitOverflowScrolling: 'touch',
        padding: '1rem 1rem 120px 1rem',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      
      <button 
        type="button"
        onClick={toggleFullscreen}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '8px 12px',
          backgroundColor: isFullscreen ? 'var(--vermelho-alerta)' : 'var(--azul-rio)',
          color: '#fff',
          border: 'none',
          borderRadius: '20px',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 10
        }}
      >
        {isFullscreen ? (
          <><MdFullscreenExit size={16} /> Sair do Modo App</>
        ) : (
          <><MdFullscreen size={16} /> Ativar Modo App</>
        )}
      </button>

      <div className="page-header text-center" style={{ margin: '1.5rem 0 1rem' }}>
        <h1><MdInventory style={{ verticalAlign: 'middle', marginRight: 8 }} />Cadastro da Dinâmica</h1>
        <p style={{ fontSize: '0.9rem', margin: '4px 0 0' }}>Desenhe seu produto, tire foto com o celular e envie para os rios da Amazônia</p>
      </div>

      <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label"><MdPerson style={{ verticalAlign: 'middle' }}/> Nome do Produtor / Vendedor</label>
            <input 
              type="text" 
              className="form-input" 
              value={nomePessoa} 
              onChange={(e) => setNomePessoa(e.target.value)} 
              placeholder="Ex: Maria de Abaetetuba"
              required 
              disabled={enviando}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><MdInventory style={{ verticalAlign: 'middle' }}/> Nome do Produto (Desenho)</label>
            <input 
              type="text" 
              className="form-input" 
              value={nomeProduto} 
              onChange={(e) => setNomeProduto(e.target.value)} 
              placeholder="Ex: Paneiro de Açaí"
              required 
              disabled={enviando}
            />
          </div>

          <div className="form-group">
            <label className="form-label"><MdDirectionsBoat style={{ verticalAlign: 'middle' }}/> Porto de Origem da Carga</label>
            <select 
              className="form-select" 
              value={portoOrigem} 
              onChange={(e) => setPortoOrigem(e.target.value)} 
              required
              disabled={enviando}
            >
              <option value="">De qual porto sai essa mercadoria?</option>
              {portos.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="form-group text-center" style={{ margin: '1.5rem 0' }}>
            <label 
              htmlFor="fotoUpload" 
              className="btn" 
              style={{ 
                display: 'block', 
                backgroundColor: 'var(--areia)', 
                color: 'var(--cinza-texto)', 
                cursor: enviando ? 'not-allowed' : 'pointer', 
                padding: '1.2rem',
                border: mensagemErro && !fotoPreview ? '2px dashed var(--vermelho-alerta)' : '2px dashed #ccc',
                borderRadius: '6px'
              }}
            >
              <MdCameraAlt size={28} style={{ display: 'block', margin: '0 auto 6px', color: mensagemErro && !fotoPreview ? 'var(--vermelho-alerta)' : 'inherit' }} />
              {fotoPreview ? "Trocar Foto do Desenho" : "Abrir Câmera do Celular"}
            </label>
            
            <input 
              id="fotoUpload" 
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleFotoChange} 
              style={{ display: 'none' }} 
              disabled={enviando}
            />
            
            {fotoPreview && (
              <div style={{ marginTop: '1rem' }}>
                <img 
                  src={fotoPreview} 
                  alt="Preview do Desenho" 
                  style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', border: '3px solid var(--verde-floresta)' }} 
                />
              </div>
            )}
          </div>

          {/* Exibe a mensagem de erro visual ao invés do alert nativo */}
          {mensagemErro && (
            <div style={{ color: 'var(--vermelho-alerta)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <MdErrorOutline size={18} /> {mensagemErro}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            style={{ fontSize: '1.1rem', padding: '14px', marginTop: '0.5rem' }}
            disabled={enviando}
          >
            {enviando ? "Enviando para a Nuvem..." : "Lançar Produto na Malha Fluvial"}
          </button>
        </form>
      </div>
    </div>
  );
}