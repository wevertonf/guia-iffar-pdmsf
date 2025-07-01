// src/servicos/InteracaoService.js
import { useState } from 'react';
import { supabase } from '../config/supabase';


export const useInteracaoService = () => {
    const [carregando, setCarregando] = useState(false);


    // Busca número de curtidas de um evento
    const buscarCurtidas = async (eventoId) => {
        const { data, error } = await supabase
            .from('curtidas')
            .select('usuario_id')
            .eq('evento_id', eventoId);

        if (error) return 0;
        return data.length;

        /*
        const { count } = await supabase
            .from('curtidas')
            .select('*', { count: true })
            .eq('evento_id', eventoId);

        console.log(count); */ // exibe número total de curtidas
    };

    // Verifica se o usuário já curtiu
    const usuarioCurtiu = async (eventoId, usuarioId) => {
        if (!usuarioId || !eventoId) return false;

        try {
            const { data, error } = await supabase
                .from('curtidas')
                .select('evento_id, usuario_id')
                .eq('evento_id', eventoId)
                .eq('usuario_id', usuarioId)
                .maybeSingle();

            console.log('Buscando curtida:', {
                eventoId,
                usuarioId
            });

            if (error) {
                console.error('Erro ao verificar curtida:', error.message);
                return false;
            }

            return !!data;
        } catch (err) {
            console.error('Erro inesperado ao verificar curtida:', err.message);
            return false;
        }
    };

    // Toggle de curtida
    const toggleCurtida = async (eventoId, usuarioId) => {
        setCarregando(true);
        try {
            const { data, error } = await supabase
                .from('curtidas')
                .select('*')
                .eq('evento_id', eventoId)
                .eq('usuario_id', usuarioId)
                .single();

            if (data) {
                // Descurtir
                await supabase
                    .from('curtidas')
                    .delete()
                    .eq('evento_id', eventoId)
                    .eq('usuario_id', usuarioId);
                return false;
            } else {
                // Curtir
                await supabase
                    .from('curtidas')
                    .insert({ evento_id: eventoId, usuario_id: usuarioId });
                return true;
            }
        } catch (err) {
            console.error('Erro ao interagir:', err);
            return false;
        } finally {
            setCarregando(false);
        }
    };

    // Buscar todos os usuários que curtiram
    const listarCurtidores = async (eventoId) => {
        const { data } = await supabase
            .from('curtidas')
            .select('usuarios(nome)')
            .eq('evento_id', eventoId);

        // Garante que sempre será um array
        return data?.map(item => item.usuarios.nome) || [];
    };
    // Buscar comentários do evento
    const buscarComentarios = async (eventoId) => {
        const { data } = await supabase
            .from('comentarios')
            .select('texto, usuarios(nome)')
            .eq('evento_id', eventoId);

        return data || [];
    };

     
    const isValidImageUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        // Aceita URLs com extensões em qualquer posição
        const regex = /\.(jpg|jpeg|png|webp|gif|bmp|tiff|svg)(\?.*)?$/i;
        return regex.test(url);
    };
 
    const buscarFotos = async (eventoId) => {
        const { data, error } = await supabase
            .from('fotos_evento')
            .select('url')
            .eq('evento_id', eventoId);

        if (error) {
            console.error('Erro ao buscar fotos:', error);
            return [];
        }

        // Filtra URLs válidas
        return data
             .map(item => item.url)
            .filter(isValidImageUrl);
    };

    return {
        buscarCurtidas,
        usuarioCurtiu,
        toggleCurtida,
        listarCurtidores,
        buscarComentarios,
        buscarFotos,
        isValidImageUrl,
        carregando,
    };
};
