import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View, Platform, Pressable, Image } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
import { useUsuario } from '../contexto/UsuarioContexto';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { supabase } from '../config/supabase';
import Estetica from '../config/Estetica';

import * as DocumentPicker from 'expo-document-picker';

import * as ImagePicker from 'expo-image-picker';

export default function NovoEvento() {
    const { perfil } = useUsuario();
    const navigation = useNavigation();

    const [titulo, setTitulo] = useState('');
    const [dataEvento, setDataEvento] = useState(new Date());
    const [mostrarPicker, setMostrarPicker] = useState(false);
    const [local, setLocal] = useState('');
    const [descricao, setDescricao] = useState('');
    const [inscricao, setInscricao] = useState(true); // boolean

    const [arquivoUrl, setArquivoUrl] = useState(null);
    const [arquivoLocal, setArquivoLocal] = useState(null);

    //parte da foto
    const [fotoEventoUrl, setFotoEventoUrl] = useState(null);
    const [fotoLocal, setFotoLocal] = useState(null);
    const [carregandoFoto, setCarregandoFoto] = useState(false);


    const selecionarArquivo = async () => {
        try {
            const resultado = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
            });

            console.log('Resultado do picker:', resultado);

            // Verifica se existe arquivos
            if (resultado.assets && resultado.assets.length > 0) {
                console.log('Arquivo selecionado');

                // Acessa o primeiro registro
                const { uri, name } = resultado.assets[0];
                setArquivoLocal(uri); // Salva URI local da imagem

                // Converte o URI para blob
                const resposta = await fetch(uri);
                const blob = await resposta.blob();

                // Define o caminho no storage
                const caminho = `eventos/${Date.now()}_${name}`;

                // Faz o upload para o supabase
                const { data, error } = await supabase
                    .storage
                    .from('eventos')
                    .upload(caminho, blob);

                if (error) {
                    Alert.alert('Erro', 'Falha ao enviar o PDF.');
                    console.error('Erro no upload:', error);
                } else {
                    // Obtém a URL pública
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('eventos')
                        .getPublicUrl(caminho);

                    setArquivoUrl(publicUrl);
                    console.log(publicUrl);
                }
            }
        } catch (error) {
            console.error('Erro ao selecionar arquivo:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao selecionar o arquivo.');
        }
    };

    const visualizarPDF = () => {
        if (arquivoUrl) {
            Linking.openURL(arquivoUrl);
        }
    };

    const limparArquivo = () => {
        setArquivoLocal(null);
        setArquivoUrl(null);
    };

    // Funções para seleção e upload da foto
    const tirarFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão da câmera negada...');
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!resultado.canceled) {
            const imagem = resultado.assets[0];
            setFotoLocal(imagem.uri);
            await uploadFoto(imagem.uri);
        }
    };

    const escolherDaGaleria = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão negada...');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
        });

        if (!resultado.canceled) {
            const imagem = resultado.assets[0];
            setFotoLocal(imagem.uri);
            await uploadFoto(imagem.uri);
        }
    };

    const uploadFoto = async (uri) => {
        setCarregandoFoto(true);
        try {
            const resposta = await fetch(uri);
            const blob = await resposta.blob();

            console.log('Blob criado:', blob); // ✅ Ver no console

            const nomeImagem = `foto_${Date.now()}.jpg`;

            const { error } = await supabase.storage
                .from('eventos')
                .upload(nomeImagem, blob);

            if (error) {
                console.log(error);
                Alert.alert('Erro ao enviar imagem');
                console.error(error);
            } else {
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('eventos')
                    .getPublicUrl(nomeImagem);

                console.log(publicUrl);

                setFotoEventoUrl(publicUrl);
            }
        } catch (err) {
            console.error('Erro no envio da imagem:', err);
        }
        finally {
            setCarregandoFoto(false);
        }
    };

    const limparImagem = () => {
        setFotoLocal(null);
        setFotoEventoUrl(null); // também limpa a URL pública
    };

    const selecionarImagem = () => {
        Alert.alert('Adicionar Imagem',
            'Escolha a origem da imagem:',
            [
                { text: 'Câmera', onPress: tirarFoto },
                { text: 'Galeria', onPress: escolherDaGaleria },
                { text: 'Cancelar', style: 'cancel' },
            ]);
    };


    //Fim funções foto

    // Bloqueio para não admin
    if (perfil?.tipo !== 'admin') {
        return (
            <View style={Estetica.novoEvento.bloqueado}>
                <Text variant="titleLarge">⛔ Acesso restrito</Text>
                <Text>Esta funcionalidade é exclusiva para administradores.</Text>
            </View>
        );
    }

    // Enviar para o Supabase
    const salvarEvento = async () => {
        if (!titulo || !local) {
            Alert.alert('Erro', 'Preencha os campos obrigatórios.');
            console.log('Preencha os campos obrigatórios')
            return;
        }

        const dataFormatada = dataEvento.toISOString().split('T')[0]; // "fica 2025-05-21"

        const { error } = await supabase.from('eventos').insert([
            {
                titulo,
                data: dataFormatada,
                local,
                descricao,
                inscricao,
                arquivo_url: arquivoUrl,
                foto_url: fotoEventoUrl
            }
        ]);

        if (error) {
            Alert.alert('Erro ao salvar', error.message);
        } else {
            Alert.alert('Sucesso', 'Evento cadastrado!');
            navigation.navigate('Eventos');
        }
    };

    return (
        <ScrollView contentContainerStyle={Estetica.novoEvento.container}>
            <Text variant="titleLarge" style={Estetica.novoEvento.titulo}>Novo Evento</Text>

            <TextInput label="Título" value={titulo} onChangeText={setTitulo} style={Estetica.novoEvento.input} />

            <TextInput label="Data" value={dataEvento.toLocaleDateString('pt-BR')} onChangeText={setDataEvento} style={Estetica.novoEvento.input} placeholder="Ex: 25/09/2025" />

            <TextInput label="Local" value={local} onChangeText={setLocal} style={Estetica.novoEvento.input} />

            <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} multiline style={Estetica.novoEvento.input} />

            <View style={Estetica.novoEvento.switchContainer}>
                <Text>Inscrição aberta?</Text>
                <Switch value={inscricao} onValueChange={setInscricao} />
            </View>

            <Button mode="outlined" onPress={selecionarArquivo}>
                Selecionar PDF do evento
            </Button>

            {arquivoUrl && <Text>Arquivo enviado com sucesso!</Text>}

            {arquivoUrl && (
                <View style={{ marginTop: 10 }}>
                    <Text>✅ PDF carregado</Text>
                    <Button mode="text" style={{ alignSelf: 'flex-start', marginTop: -10 }} onPress={visualizarPDF}>
                        Visualizar PDF
                    </Button>
                    <Button mode="text" onPress={limparArquivo}>
                        Limpar arquivo
                    </Button>
                </View>
            )}

            {/* Se quiser visualizar o PDF */}
            {/*arquivoUrl && arquivoUrl.endsWith('.pdf') && (
                <Button mode="text" style={{ alignSelf: 'flex-start', marginTop: -10 }} onPress={visualizarPDF}>
                    Visualizar PDF
                </Button>
            )*/}

            {/* Foto */}
            <Button mode="outlined" onPress={selecionarImagem} style={{ marginTop: 20 }}>
                Adicionar Imagem do Evento
            </Button>

            {Platform.OS === 'web' && (
                <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                        const file = event.target.files[0];
                        if (file) {
                            const uri = URL.createObjectURL(file);
                            setFotoLocal(uri);
                            uploadFoto(uri);
                        }
                    }}
                />
            )}

            {fotoLocal && (
                <>
                    <Image
                        source={{ uri: fotoLocal }}
                        style={{ width: 200, height: 200, borderRadius: 10, marginTop: 10 }}
                    />
                    <Button mode="text" onPress={limparImagem} style={{ marginTop: -10 }}>
                        Limpar imagem
                    </Button>
                </>
            )}

            <Button mode="contained" onPress={salvarEvento} style={{ marginTop: 20 }}>Salvar Evento</Button>
        </ScrollView>
    );
}

/* 
MELHORIAS
Exibir uma prévia da imagem no app antes do upload
Carregar múltiplas imagens
Validar tipo de arquivo (só PDFs)
Mostrar miniatura de PDF (usando lib)
Salvar eventos com múltiplos anexos
Se quiser, posso te ajudar a mostrar o PDF direto no app (navegador interno), ou até validar se o arquivo existe antes de gerar a URL .
Mostrar um loader enquanto carrega a imagem
Usar base64 em vez de uri (para enviar direto como string)
Adicionar botão de "retirar foto"
Adicionar um botão customizado no lugar do <input> padrão.
Permitir arrastar e soltar arquivos.
Mostrar miniatura do arquivo antes do upload.
Validar formato e tamanho do arquivo. 
*/