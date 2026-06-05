import { createContext, useContext, useState } from 'react';
import { mockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // A mágica da apresentação: O estado inicial força o usuário a ser o ADMIN
  const [usuario, setUsuario] = useState(() => {
    try {
      const salvo = localStorage.getItem('porto_usuario');
      // Busca o Admin na sua lista de usuários
      const adminPadrao = mockUsers.find(u => u.papel === 'admin');
      
      // Se tiver alguém salvo, usa. Se não, entra direto como Admin
      return salvo ? JSON.parse(salvo) : adminPadrao;
    } catch {
      return mockUsers.find(u => u.papel === 'admin');
    }
  });

  function login(cpf, papel) {
    const encontrado = mockUsers.find(
      (u) => u.cpf === cpf && u.papel === papel
    );
    if (encontrado) {
      setUsuario(encontrado);
      localStorage.setItem('porto_usuario', JSON.stringify(encontrado));
      return true;
    }
    return false;
  }

  function loginFromApi(usuarioApi) {
    setUsuario(usuarioApi);
    localStorage.setItem('porto_usuario', JSON.stringify(usuarioApi));
  }

  function logout() {
    // Na dinâmica, se você clicar em sair, ele limpa, mas ao atualizar a página volta a ser Admin
    setUsuario(null);
    localStorage.removeItem('porto_usuario');
  }

  return (
    <AuthContext.Provider value={{ usuario, login, loginFromApi, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}