import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';

// Hook personalizado para lidar com operações de inscrições
export const useInscricoesService = () => {
  const { perfil } = useUsuario();         // Pega o perfil do usuário autenticado
  const usuarioId = perfil?.id;            // ID do usuário logado

  // Verifica se o usuário está inscrito no evento
  const usuarioInscrito = async (eventoId) => {
    if (!usuarioId) return false;

    const { data } = await supabase
      .from('inscricoes')
      .select('*')
      .eq('usuario_id', usuarioId)
      .eq('evento_id', eventoId)
      .maybeSingle();

    return !!data;
  };

  // Inscreve o usuário no evento
  const sendInscricaoEmail = async (usuarioId, eventoId, email) => {
  try {
    // Obtém o usuário autenticado corretamente (versão atual do SDK)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('Usuário não autenticado para enviar email');
      return false;
    }

    // Monta o conteúdo do email (HTML simples como exemplo)
    const subject = `Confirmação de Inscrição no Evento ${eventoId}`;
    const html = `
      <h1>Olá!</h1>
      <p>Você foi inscrito com sucesso no evento de ID <strong>${eventoId}</strong>.</p>
      <p>Obrigado por participar!</p>
    `;

    // Chama a Edge Function para enviar o email
    const response = await fetch('https://iqhqgxifwofaaxzwhdoj.supabase.co/functions/v1/send-inscricao-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: email,
        subject,
        html
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao enviar email via Edge Function:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('Email enviado com sucesso:', data);

    return true;
  } catch (error) {
    console.error('Erro ao enviar email de inscrição:', error.message);
    return false;
  }
};

// Função para inscrever o usuário em um evento
const inscreverUsuario = async (eventoId, email) => {
  try {
    // Obtém o usuário autenticado
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('Usuário não autenticado para inscrição');
      return false;
    }

    // Insere a inscrição na tabela
    const { error } = await supabase
      .from('inscricoes')
      .insert({ usuario_id: user.id, evento_id: eventoId, status: 'INSCRITO' });

    if (error) {
      console.error('Erro ao inserir inscrição:', error.message);
      return false;
    }

    // Envia email de confirmação
    await sendInscricaoEmail(user.id, eventoId, email);

    return true;
  } catch (error) {
    console.error('Erro na inscrição:', error.message);
    return false;
  }
};

  // Cancela a inscrição do usuário no evento
  const cancelarInscricao = async (eventoId) => {
    if (!usuarioId) return false;

    const { error } = await supabase
      .from('inscricoes')
      .delete()
      .eq('usuario_id', usuarioId)
      .eq('evento_id', eventoId);

    return !error;
  };

  return { usuarioInscrito, inscreverUsuario, cancelarInscricao };
};