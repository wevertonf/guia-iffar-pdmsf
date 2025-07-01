
import Estetica from "../config/Estetica";
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';

export default () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigation = useNavigation();

    const cadastrar = async () => {
        if (!email || !senha || !nome) {
            //Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
            return;
        }
        setCarregando(true);

        const { data, error } = await supabase.auth.signUp({
            email, password: senha
        });

        if (error) {
            //Alert.alert('Erro no cadastro', error.message);
            alert('Erro no cadastro', error.message);
            setCarregando(false);
            return;
        }

        //se cadastrou, temos o id do usuario
        const id = data.user?.id;

        //parte 2 do fluxo - cadastrar na nossa tabela personalizada de usuarios

        if (id) {
            const { error: erroUsuario } = await supabase.from('usuarios').insert([
                { id, nome, tipo: 'aluno' }
            ]);

            if (erroUsuario) {
                //Alert.
                alert('Erro ao salvar usuário:', erroUsuario.message);
            } else {
                //Alert.alert('Conta criada com sucesso!', 'Você já pode fazer login.');
                navigation.navigate('Login');
            }

        }
        setCarregando(false);

    }

    return (
        <View style={Estetica.cadastro.container}>
            <Text variant="titleLarge" style={{ marginBottom: 16 }}>Criar Conta</Text>

            <TextInput label="Nome completo" value={nome} style={Estetica.cadastro.input} onChangeText={setNome} />
            <TextInput label="E-mail" value={email} keyboardType="email-address" autoCapitalize="none" style={Estetica.cadastro.input} onChangeText={setEmail} />
            <TextInput label="Senha" value={senha} secureTextEntry style={Estetica.cadastro.input} onChangeText={setSenha} />

            <Button mode="contained" onPress={cadastrar} loading={carregando}>Cadastrar</Button>
            <Button onPress={() => navigation.navigate('Login')} style={{ marginTop: 8 }}>Já tenho conta</Button>

        </View>

    );
}
/* 
onChangeText: Uma função que é chamada sempre que o texto do campo muda. Aqui, ela atualiza o estado correspondente usando as funções setNome, setEmail ou setSenha.
keyboardType: Define o tipo de teclado a ser exibido (por exemplo, email-address para o campo de email).
autoCapitalize: Desativa a capitalização automática para o campo de email.
secureTextEntry: Para o campo de senha, isso oculta o texto digitado, exibindo pontos ou asteriscos.
*/