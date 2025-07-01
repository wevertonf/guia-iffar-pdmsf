import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { supabase } from '../config/supabase';
import { useNavigation } from '@react-navigation/native';
import { useUsuario } from '../contexto/UsuarioContexto';
import Estetica from '../config/Estetica';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  

  const navigation = useNavigation();
  
  const { setUsuario, setPerfil } = useUsuario(); 

  const fazerLogin = async () => {
    setCarregando(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      console.log('Erro no login:', error);

      Alert.alert('Erro', 'Email ou senha inválidos.');
      setCarregando(false);
      return;
    }

    const user = data.user;

    if (user) { 
      // buscar dados complementares da tabela usuarios
      const { data: perfilUsuario, error: erroPerfil } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (erroPerfil) {
        Alert.alert('Erro', 'Não foi possível buscar o perfil do usuário.');
        setCarregando(false);
        return;
      }

      setUsuario(user);

      setPerfil(perfilUsuario);

      Alert.alert('Sucesso', 'Login realizado com sucesso!');

      navigation.navigate('Home');
    }

    setCarregando(false);
  };

  return (
    <View style={Estetica.login.container}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Entrar</Text>

      <TextInput label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={Estetica.login.input}/>

      <TextInput label="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={Estetica.login.input}/>

      <Button mode="contained" onPress={fazerLogin} loading={carregando}>Entrar</Button>

      <Button onPress={() => navigation.navigate('Cadastro')} style={{ marginTop: 8 }}>Ainda não tenho conta</Button>
    </View>
  );
}
