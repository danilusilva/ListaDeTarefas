import { createContext, useContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '../api/tasksApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Recupera sessão salva ao recarregar a página
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    return token ? { token, email } : null;
  });
  const [erro, setErro] = useState('');

  async function login(email, senha) {
    try {
      console.log("Está tentando fazer login")
      const { data } = await loginApi({ email, senha });
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', data.email);
      setUser({ token: data.token, email: data.email });
    } catch (e) {
      console.log('Erro completo:', e);
      console.log('e.response:', e.response);
      console.log('e.message:', e.message);
      setErro(e.response?.data?.erro ?? 'Erro ao autenticar. Verifique os dados.')
    }
  }

  async function register(email, senha) {
    await registerApi({ email, senha });
    await login(email, senha); // já faz login após cadastro
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, erro, setErro }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);