import { useState, useEffect, createContext, useContext } from 'react';
import { mockColheitas, mockRotas } from '../data/mockData';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // PERSISTÊNCIA DO RANKING: Começa 100% zerado (sem mockTransacoes) para a dinâmica limpa
  const [transacoes, setTransacoes] = useState(() => {
    const salvas = localStorage.getItem('porto_transacoes_dinamica');
    return salvas ? JSON.parse(salvas) : []; // Inicializa como array vazio se não houver compras salvas
  });
  
  const [mercadorias, setMercadorias] = useState([]); // Sincronizado via Firebase
  const [colheitas, setColheitas]     = useState([...mockColheitas]);
  const [rotas, setRotas]             = useState([...mockRotas]);

  // Efeito para salvar as transações no navegador sempre que uma nova compra for feita
  useEffect(() => {
    localStorage.setItem('porto_transacoes_dinamica', JSON.stringify(transacoes));
  }, [transacoes]);

  // ESCUTA EM TEMPO REAL: Monitora a coleção de mercadorias no Firebase (100% LIMPO)
  useEffect(() => {
    const colecaoRef = collection(db, "mercadorias");
    
    const unsubscribe = onSnapshot(colecaoRef, (snapshot) => {
      const produtosDaNuvem = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // MUDANÇA AQUI: Traz RIGOROSAMENTE apenas os desenhos enviados do telemóvel para a nuvem
      setMercadorias([...produtosDaNuvem]);
    });

    return () => unsubscribe();
  }, []);

  // SALVA NA NUVEM: Envia a nova mercadoria direto para o Firebase
  async function adicionarMercadoria(mercadoria) {
    try {
      const colecaoRef = collection(db, "mercadorias");
      await addDoc(colecaoRef, mercadoria);
    } catch (error) {
      console.error("Erro ao salvar produto no Firebase:", error);
    }
  }

  function atualizarStatusTransacao(id, novoStatus) {
    setTransacoes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: novoStatus } : t))
    );
  }

  function adicionarTransacao(transacao) {
    setTransacoes((prev) => [...prev, transacao]);
  }

  function retirarMercadoria(id, quantidade) {
    setMercadorias((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, quantidade: m.quantidade - quantidade, status: m.quantidade - quantidade <= 0 ? 'esgotado' : m.status }
          : m
      )
    );
  }

  function avaliarTransacao(id, avaliacao) {
    setTransacoes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, avaliacao, status: 'entregue' } : t))
    );
  }

  function adicionarColheita(colheita) {
    setColheitas((prev) => [...prev, colheita]);
  }

  function adicionarRota(rota) {
    setRotas((prev) => [...prev, rota]);
  }

  function limparHistoricoDinamica() {
    localStorage.removeItem('porto_transacoes_dinamica');
    setTransacoes([]); // Deixa o pódio totalmente limpo
  }

  return (
    <AppContext.Provider
      value={{
        transacoes,
        mercadorias,
        colheitas,
        rotas,
        atualizarStatusTransacao,
        adicionarTransacao,
        retirarMercadoria,
        adicionarMercadoria,
        avaliarTransacao,
        adicionarColheita,
        adicionarRota,
        limparHistoricoDinamica
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}