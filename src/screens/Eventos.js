import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import Estetica from '../config/Estetica';
import EventoCard from '../componentes/EventoCard';
import { supabase } from '../config/supabase';
import { useInscricoesService } from '../servicos/InscricoesService';
import { useUsuario } from '../contexto/UsuarioContexto';

export default ({ navigation }) => {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const { perfil } = useUsuario();
  const usuarioId = perfil?.id;

  const { usuarioInscrito } = useInscricoesService();

  const [statusInscricoes, setStatusInscricoes] = useState({});

  // Busca eventos do Supabase
  useEffect(() => {
    async function carregarEventos() {
      const { data, error } = await supabase.from('eventos').select(`
      *,
      curtidas:curtidas(count),
      comentarios:comentarios(count),
      fotos:fotos_evento(count)
    `);
      if (error) {
        console.error('Erro ao carregar eventos:', error);
        setErro('Falha ao carregar eventos.');
      } else {
        setEventos(data);
      }
      setCarregando(false);
    }

    carregarEventos();
  }, []);

  // Verifica se o usuário está inscrito em cada evento
  useEffect(() => {
    async function verificarInscricoes() {
      if (!usuarioId || !eventos.length) return;

      const novosStatus = {};
      for (const evento of eventos) {
        const inscrito = await usuarioInscrito(evento.id);
        novosStatus[evento.id] = inscrito;
      }
      setStatusInscricoes(novosStatus);
    }

    verificarInscricoes();
  }, [usuarioId, eventos, usuarioInscrito]);

  return (
    <ScrollView contentContainerStyle={Estetica.container}>
      <Text variant="titleLarge" style={Estetica.titulo}>Eventos Acadêmicos</Text>

      {carregando && <ActivityIndicator animating />}

      {erro && <Text style={{ color: 'red' }}>{erro}</Text>}

      {!carregando && !eventos.length && <Text>Nenhum evento encontrado.</Text>}

      {eventos.map((evento) => (
        <EventoCard
          key={evento.id}
          {...evento}
          onPress={() => navigation.navigate('DetalheEvento', evento)}
          curtidas={evento.curtidas?.[0]?.count || 0}
          comentarios={evento.comentarios?.[0]?.count || 0}
          fotos={evento.fotos?.[0]?.count || 0}
          estaInscrito={statusInscricoes[evento.id]}
        />
      ))}
    </ScrollView>
  );
};