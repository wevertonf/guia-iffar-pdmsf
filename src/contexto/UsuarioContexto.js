import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

// Cria o contexto para gerenciar dados do usuário autenticado
const UsuarioContexto = createContext();

// Provedor do contexto para disponibilizar os dados do usuário aos componentes filhos
export const UsuarioProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); // Dados do auth.users (Supabase Auth)
  const [perfil, setPerfil] = useState(null);   // Dados da tabela usuarios + email do auth.users
  const [carregando, setCarregando] = useState(true);

  // Busca o usuário logado e seu perfil ao carregar o componente
  useEffect(() => {
    async function buscarUsuario() {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (user) {
        setUsuario(user);

        // Busca dados da tabela usuarios
        const { data: perfilData, error: perfilError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .single();

        if (perfilData) {
          // Combina perfil da tabela usuarios + email do auth.users
          setPerfil({
            ...perfilData,
            email: user.email,  // adiciona o email aqui
          });
        } else {
          // Caso não tenha dados na tabela usuarios, usa só o email
          setPerfil({
            id: user.id,
            email: user.email,
          });
        }
      } else {
        setPerfil(null);
        setUsuario(null);
      }

      setCarregando(false);
    }

    buscarUsuario();
  }, []);

  // Função para deslogar o usuário
  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    setPerfil(null);
  };

  return (
    <UsuarioContexto.Provider value={{ usuario, setUsuario, perfil, setPerfil, carregando, logout }}>
      {children}
    </UsuarioContexto.Provider>
  );
};

// Hook personalizado para usar o contexto facilmente
export const useUsuario = () => useContext(UsuarioContexto);