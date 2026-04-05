import React, { createContext, useState, useEffect } from 'react';
import api from '../Services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = !!user?.is_admin;
  

  useEffect(() => {
    // Ao carregar a página, verifica se já existe um usuário logado no navegador
    async function loadStorageData() {
      const storageUser = localStorage.getItem('@App:user');
      const storageToken = localStorage.getItem('@App:token');

      if (storageUser && storageToken) {
        // Se existir, já pré-configura o Axios com o Bearer Token
        api.defaults.headers.Authorization = `Bearer ${storageToken}`;

        try {
          const response = await api.get('/api/auth/me');
          const freshUser = response.data;

          setUser(freshUser);
          localStorage.setItem('@App:user,', JSON.stringify(freshUser));
        } catch (err) {
          signOut();
        }
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  // --- FUNÇÃO DE LOGIN ---
  async function signIn(email, password) {
    await api.get('sanctum/csrf-cookie');

    const response = await api.post('/api/auth/login', {
      email,
      password,
    });

    const { access_token, user: userData } = response.data;

    // Salva no navegador para persistir o login ao atualizar a página
    localStorage.setItem('@App:token', access_token);
    localStorage.setItem('@App:user', JSON.stringify(userData));

    // Configura o token para as próximas chamadas de API
    api.defaults.headers.Authorization = `Bearer ${access_token}`;

    setUser(userData);

  }

  // --- FUNÇÃO DE CADASTRO (Sign Up) ---
  async function signUp(name, email, tel, password, password_confirmation, website_link) {
    await api.get('/sanctum/csrf-cookie');

    // 2. Tente enviar o POST
    // Verifique se a URL bate com o que está no routes/api.php
    const response = await api.post('/api/auth/register', {
      name,
      email,
      tel,
      password,
      password_confirmation,
      website_link
    });

    return response.data;
  }

  // --- FUNÇÃO DE LOGOUT ---
  function signOut() {
    localStorage.clear();
    setUser(null);
    delete api.defaults.headers.Authorization;

  }

  return (
    <AuthContext.Provider value={{
      signed: !!user,
      user,
      signIn,
      signUp,
      signOut,
      loading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};