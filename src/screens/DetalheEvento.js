import React, { useEffect, useState } from 'react';
import { ScrollView, View, Platform, Linking } from 'react-native';
import { Badge, Button, Card, Divider, Text, useTheme, Image } from 'react-native-paper';
import Estetica from '../config/Estetica';
import { useNavigation } from '@react-navigation/native';
import { useUsuario } from '../contexto/UsuarioContexto';
import { useInscricoesService } from '../servicos/InscricoesService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useInteracaoService } from '../servicos/InteracaoService';
import { supabase } from '../config/supabase';


export default ({ route }) => {
  const { id, titulo, data, local, inscricao, descricao, vagas_disponiveis: vagasIniciais} = route.params;
  const theme = useTheme();
  const navigation = useNavigation();

  const { perfil } = useUsuario();
  const usuarioId = perfil?.id;

  const { usuarioInscrito, inscreverUsuario, cancelarInscricao } = useInscricoesService();
  const [estaInscrito, setEstaInscrito] = useState(false);

  const [vagasDisponiveis, setVagasDisponiveis] = useState(vagasIniciais ?? 0);

  const { usuarioCurtiu, toggleCurtida, listarCurtidores, buscarComentarios, buscarFotos, isValidImageUrl } = useInteracaoService();
  const [estaCurtido, setEstaCurtido] = useState(false);
  const [curtidas, setCurtidas] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [fotos, setFotos] = useState([]);
  const [curtidores, setCurtidores] = useState([]);

  const [abaAtiva, setAbaAtiva] = useState('curtidas'); // curtidas, comentarios, fotos

  // Verifica se o usuário está inscrito neste evento
  useEffect(() => {
    const verificar = async () => {
      if (usuarioId) {
        const inscrito = await usuarioInscrito(id);
        setEstaInscrito(inscrito);
      }
    };
    verificar();
  }, [usuarioId, id, usuarioInscrito]);

  const atualizarVagas = async (incremento) => {
    // incremento: -1 para inscrever, +1 para cancelar
    const { error } = await supabase
      .from('eventos')
      .update({
        vagas_disponiveis: vagasDisponiveis + incremento
      })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar vagas:', error.message);
      return false;
    }
    // Atualiza estado local
    setVagasDisponiveis(prev => prev + incremento);
    return true;
  };

  // Lida com a inscrição ou cancelamento
  const handleInscricao = async () => {
    if (estaInscrito) {
      const sucesso = await cancelarInscricao(id);
      if (sucesso) {
        await atualizarVagas(1); // incrementa vagas
        setEstaInscrito(false);
      }
    } else {
      if (vagasDisponiveis <= 0) {
        alert('Não há vagas disponíveis para este evento.');
        return;
      }
      if (!perfil?.email) {
        console.error('Email do usuário não disponível');
        return;
      }
      const sucesso = await inscreverUsuario(id, perfil.email);
      if (sucesso) {
        await atualizarVagas(-1); // decrementa vagas
        setEstaInscrito(true);
      }
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      if (!usuarioId) return;

      const jaCurtiu = await usuarioCurtiu(id, usuarioId);
      setEstaCurtido(jaCurtiu);

      const dadosCurtidas = await supabase
        .from('curtidas')
        .select()
        .eq('evento_id', id);

      setCurtidas(dadosCurtidas.data?.length || 0);

      const dadosComentarios = await buscarComentarios(id);
      setComentarios(dadosComentarios);

      const dadosFotos = await buscarFotos(id);
      setFotos(dadosFotos);

      // ✅ Agora sim: chame listarCurtidores e guarde no estado
      const nomes = await listarCurtidores(id); // Isso agora retorna ['João', 'Maria']
      setCurtidores(nomes);
    };

    carregarDados();
  }, [id, usuarioId]);

  const handleCurtir = async () => {
    const sucesso = await toggleCurtida(id, usuarioId);
    if (sucesso) {
      const dadosCurtidas = await supabase.from('curtidas').select().eq('evento_id', id);
      setCurtidas(dadosCurtidas.data?.length || 0);
      setEstaCurtido(!estaCurtido);
    }
  };

  const abrirNoMaps = (endereco) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(endereco)}`,
      android: `geo:0,0?q=${encodeURIComponent(endereco)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`
    });

    Linking.canOpenURL(url).then(suporte => {
      if (suporte) {
        Linking.openURL(url);
      } else {
        // fallback: abre no navegador
        const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
        Linking.openURL(fallbackUrl);
      }
    });
  };

  const corBadge = inscricao ? theme.colors.primary : theme.colors.outline;
  const textoBadge = inscricao ? 'INSCRIÇÕES ABERTAS' : 'INSCRIÇÕES ENCERRADAS';

  return (
    <ScrollView contentContainerStyle={Estetica.detalheEvento.container}>
      <Card mode="outlined">
        <Card.Content>
          <View style={Estetica.detalheEvento.header}>
            <Text variant="titleLarge">{titulo}</Text>
            {/* <Badge style={{ backgroundColor: corBadge }}>{textoBadge}</Badge> */}
            {inscricao && usuarioId && (
              <Button
                mode="contained"
                onPress={handleInscricao}
                style={{
                  marginTop: 16,
                  backgroundColor: estaInscrito ? 'red' : theme.colors.primary,
                }}
              >
                {estaInscrito ? 'Cancelar Inscrição' : 'Inscrever-se'}
              </Button>
            )}
          </View>

          <Divider />

          <Text variant="bodyMedium">📅 Data: {data}</Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}
            onPress={() => abrirNoMaps(local)}
          >
            📍 Local: {local}
          </Text>


          <Divider />

          <Text variant="titleSmall">Descrição:</Text>
          <Text>{descricao}</Text>

          {/* Vagas disponíveis */}
          <Text variant="bodyMedium" style={{ marginTop: 8, fontWeight: 'bold' }}>
            Vagas disponíveis: {vagasDisponiveis}
          </Text>

          {/* Ícones de interação */}
          <View style={Estetica.detalheEvento.acoes}>
            <Button
              mode="text"
              onPress={() => setAbaAtiva('curtidas')}
              icon={() => <Icon name="heart" size={20} color={theme.colors.primary} />}
              compact
              style={Estetica.detalheEvento.acaoItem}
            >
              {curtidas}
            </Button>

            <Button
              mode="text"
              onPress={() => setAbaAtiva('comentarios')}
              icon={() => <Icon name="comment" size={20} color={theme.colors.primary} />}
              compact
              style={Estetica.detalheEvento.acaoItem}
            >
              {comentarios.length}
            </Button>

            <Button
              mode="text"
              onPress={() => setAbaAtiva('fotos')}
              icon={() => <Icon name="image" size={20} color={theme.colors.primary} />}
              compact
              style={Estetica.detalheEvento.acaoItem}
            >
              {fotos.length}
            </Button>
          </View>

          {/* Conteúdo da aba selecionada */}
          <View style={{ marginTop: 20 }}>
            {abaAtiva === 'curtidas' && (
              <>
                <Text variant="titleSmall">Quem curtiram:</Text>
                {curtidores.length > 0 ? (
                  curtidores.map((nome, index) => (
                    <Text key={index}>{nome}</Text>
                  ))
                ) : (
                  <Text>Nenhuma curtida ainda.</Text>
                )}
              </>
            )}

            {abaAtiva === 'comentarios' && (
              <>
                <Text variant="titleSmall">Comentários:</Text>
                {comentarios.map((c, idx) => (
                  <Card key={idx} style={{ marginVertical: 4 }}>
                    <Card.Content>
                      <Text>{c.texto}</Text>
                      <Text style={{ fontSize: 12, color: 'gray' }}>{c.usuarios.nome}</Text>
                    </Card.Content>
                  </Card>
                ))}
                {!comentarios.length && <Text>Nenhum comentário até agora.</Text>}
              </>
            )}

            {abaAtiva === 'fotos' && (
              <>
                <Text variant="titleSmall">Fotos do evento:</Text>
                {fotos.map((foto, index) => {
                  console.log(foto);
                  const urlValida = isValidImageUrl(foto);
                  return (
                    <View key={index} style={{ marginBottom: 16 }}>
                      {urlValida ? (
                        Platform.OS === 'web' ? (
                          <img
                            src={foto}
                            alt="Evento"
                          //style={{ width: '100%', height: 200, borderRadius: 10, marginVertical: 8 }}
                          />
                        ) : (
                          <Image
                            source={{ uri: foto }}
                            //style={{ width: '100%', height: 200, borderRadius: 10, marginVertical: 8 }}
                            resizeMode="cover"
                          />
                        )
                      ) : (
                        <Text style={{ color: 'red' }}>❌ Imagem inválida</Text>
                      )}
                    </View>
                  );
                })}
                {!fotos.length && <Text>Nenhuma foto adicionada.</Text>}
              </>
            )}
          </View>

        </Card.Content>
      </Card>

      <Button mode="outlined" onPress={() => navigation.navigate('Eventos')} style={Estetica.detalheEvento.botaoVoltar}>
        Voltar
      </Button>
    </ScrollView>
  );
};