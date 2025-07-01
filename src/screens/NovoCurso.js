import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useUsuario } from '../contexto/UsuarioContexto';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import Estetica from '../config/Estetica';

import * as DocumentPicker from 'expo-document-picker';

export default function NovoCurso() {
    const { perfil } = useUsuario();
    const navigation = useNavigation();

    const [nome, setNome] = useState('');
    const [modalidade, setModalidade] = useState('');
    const [nivel, setNivel] = useState('');
    const [turno, setTurno] = useState('');
    const [unidade, setUnidade] = useState('');
    const [duracao, setDuracao] = useState('');
    const [descricao, setDescricao] = useState('');
    const [arquivoUrl, setArquivoUrl] = useState(null);
    const [arquivoLocal, setArquivoLocal] = useState(null);

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
                const caminho = `cursos/${Date.now()}_${name}`;

                // Faz o upload para o supabase
                const { data, error } = await supabase
                    .storage
                    .from('cursos')
                    .upload(caminho, blob);

                if (error) {
                    Alert.alert('Erro', 'Falha ao enviar o PDF.');
                    console.error('Erro no upload:', error);
                } else {
                    // Obtém a URL pública
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('cursos')
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

    const salvarCurso = async () => {
        if (!nome || !modalidade || !nivel || !turno) {
            Alert.alert('Campos obrigatórios', 'Preencha todos os campos principais.');
            console.log('Preencha todos os campos principais');
            return;
        }

        const { error } = await supabase.from('cursos').insert([{ nome, modalidade, nivel, turno, unidade, duracao, descricao }]);

        if (error) {
            Alert.alert('Erro ao salvar', error.message);
        } else {
            Alert.alert('Sucesso', 'Curso cadastrado!');
            navigation.navigate('Cursos');
        }
    };


    if (perfil?.tipo !== 'admin') {
        return (
            <View style={Estetica.novoCurso.bloqueado}>
                <Text variant="titleLarge">⛔ Acesso restrito</Text>
                <Text>Esta funcionalidade é exclusiva para administradores.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={Estetica.novoCurso.container}>
            <Text variant="titleLarge" style={Estetica.novoCurso.titulo}>Novo Curso</Text>

            <TextInput label="Nome" value={nome} onChangeText={setNome} style={Estetica.novoCurso.input} />
            <TextInput label="Modalidade" value={modalidade} onChangeText={setModalidade} style={Estetica.novoCurso.input} />
            <TextInput label="Nível" value={nivel} onChangeText={setNivel} style={Estetica.novoCurso.input} />
            <TextInput label="Turno" value={turno} onChangeText={setTurno} style={Estetica.novoCurso.input} />
            <TextInput label="Unidade" value={unidade} onChangeText={setUnidade} style={Estetica.novoCurso.input} />
            <TextInput label="Duração" value={duracao} onChangeText={setDuracao} style={Estetica.novoCurso.input} />
            <TextInput label="Descrição" value={descricao} onChangeText={setDescricao} multiline style={Estetica.novoCurso.input} />

            <Button mode="outlined" onPress={selecionarArquivo}>Selecionar PDF do curso</Button>

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
            {/* arquivoUrl && arquivoUrl.endsWith('.pdf') && (
                <Button mode="text" style={{ alignSelf: 'flex-start', marginTop: -10 }} onPress={visualizarPDF}>
                    Visualizar PDF
                </Button>
            ) */}

            <Button mode="contained" onPress={salvarCurso} style={{ marginTop: 20 }}>
                Salvar Curso
            </Button>
        </ScrollView>
    );
}
