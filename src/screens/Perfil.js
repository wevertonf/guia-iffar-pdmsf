import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, Platform } from 'react-native';
import { Text, TextInput, Button, Avatar, Divider, List, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../config/supabase';
import { useUsuario } from '../contexto/UsuarioContexto';
import Estetica from '../config/Estetica';

export default function Perfil() {
  const { perfil, setPerfil } = useUsuario();
  const [nome, setNome] = useState(perfil?.nome || '');
  const [email] = useState(perfil?.email || '');
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(perfil?.foto_perfil || null);
  const [carregando, setCarregando] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Buscar eventos inscritos do usuário
  useEffect(() => {
    if (!perfil?.id) return;

    const carregarEventos = async () => {
      setCarregando(true);
      try {
        // Busca inscrições do usuário com join na tabela eventos para pegar detalhes
        const { data, error } = await supabase
          .from('inscricoes')
          .select(`
            evento: eventos (
              id, titulo, data, local, foto_url
            )
          `)
          .eq('usuario_id', perfil.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar eventos inscritos:', error);
          Alert.alert('Erro', 'Não foi possível carregar eventos inscritos.');
          setCarregando(false);
          return;
        }

        // Extrai só os eventos da resposta
        const eventosInscritos = data.map(item => item.evento).filter(Boolean);
        setEventos(eventosInscritos);
      } catch (err) {
        console.error(err);
        Alert.alert('Erro', 'Erro inesperado ao carregar eventos.');
      } finally {
        setCarregando(false);
      }
    };

    carregarEventos();
  }, [perfil]);

  // Função para selecionar imagem da galeria ou câmera
  const selecionarImagem = async () => {
    // Peça permissão para acessar a galeria
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }
    }

    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.cancelled) {
      await uploadImagem(resultado.uri);
    }
  };

  // Upload da imagem para o Supabase Storage e atualização do perfil
  const uploadImagem = async (uri) => {
    try {
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();

      const nomeArquivo = `perfil/${perfil.id}-${Date.now()}.jpg`;

      // Faz upload para o bucket "fotos-perfil" (crie no Supabase Storage)
      const { data, error } = await supabase.storage
        .from('fotos-perfil')
        .upload(nomeArquivo, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error('Erro no upload:', error);
        Alert.alert('Erro', 'Falha ao enviar a imagem.');
        setUploading(false);
        return;
      }

      // Obter URL pública da imagem
      const { publicURL, error: urlError } = supabase.storage
        .from('fotos-perfil')
        .getPublicUrl(nomeArquivo);

      if (urlError) {
        console.error('Erro ao obter URL pública:', urlError);
        Alert.alert('Erro', 'Não foi possível obter URL da imagem.');
        setUploading(false);
        return;
      }

      // Atualiza campo foto_perfil na tabela usuarios
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ foto_perfil: publicURL })
        .eq('id', perfil.id);

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        Alert.alert('Erro', 'Não foi possível salvar a foto no perfil.');
        setUploading(false);
        return;
      }

      // Atualiza estado local e contexto
      setFotoPerfilUrl(publicURL);
      setPerfil(prev => ({ ...prev, foto_perfil: publicURL }));

      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro inesperado no upload.');
    } finally {
      setUploading(false);
    }
  };

  // Atualizar nome no perfil
  const salvarPerfil = async () => {
    if (!nome.trim()) {
      Alert.alert('Nome obrigatório', 'Por favor, insira seu nome!');
      return;
    }

    setCarregando(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ nome: nome.trim() })
        .eq('id', perfil.id);

      if (error) {
        console.error('Erro ao atualizar nome:', error);
        Alert.alert('Erro', 'Não foi possível atualizar o nome.');
        setCarregando(false);
        return;
      }

      setPerfil(prev => ({ ...prev, nome: nome.trim() }));
      Alert.alert('Sucesso', 'Nome atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro inesperado ao atualizar nome.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={Estetica.perfil.container} keyboardShouldPersistTaps="handled">
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        {fotoPerfilUrl ? (
          <Avatar.Image size={120} source={{ uri: fotoPerfilUrl }} />
        ) : (
          <Avatar.Text size={120} label={nome ? nome[0].toUpperCase() : 'U'} />
        )}

        <Button mode="text" onPress={selecionarImagem} loading={uploading} disabled={uploading} style={{ marginTop: 10 }}>
          Alterar Foto de Perfil
        </Button>
      </View>

      <View style={Estetica.perfil.form}>
        <TextInput
          label="Nome"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={{ marginBottom: 16 }}
        />
        <TextInput
          label="E-mail"
          value={email}
          mode="outlined"
          disabled
          style={{ marginBottom: 16 }}
        />

        <Button mode="contained" onPress={salvarPerfil} loading={carregando} disabled={carregando}>
          Salvar Alterações
        </Button>
      </View>

      <Divider style={{ marginVertical: 20 }} />

      <View style={{ paddingHorizontal: 16 }}>
        <Text variant="titleMedium" style={{ marginBottom: 10 }}>
          Histórico de Eventos Inscritos
        </Text>

        {carregando && <ActivityIndicator animating size="large" />}

        {!carregando && eventos.length === 0 && (
          <Text>Nenhum evento inscrito até o momento.</Text>
        )}

        {eventos.map(evento => (
          <List.Item
            key={evento.id}
            title={evento.titulo}
            description={`${evento.data ? new Date(evento.data).toLocaleDateString() : ''} - ${evento.local || ''}`}
            left={props =>
              evento.foto_url ? (
                <Avatar.Image size={48} source={{ uri: evento.foto_url }} />
              ) : (
                <Avatar.Text size={48} label={evento.titulo?.[0]?.toUpperCase() || '?'} />
              )
            }
          />
        ))}
      </View>
    </ScrollView>
  );
}