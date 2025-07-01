import React, {useEffect, useState} from 'react';
import { Image, View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Estetica from '../config/Estetica';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsuario } from '../contexto/UsuarioContexto';
import { supabase } from '../config/supabase';

export default ({ navigation }) => {
    const { usuario, perfil, setUsuario, setPerfil, logout } = useUsuario();
    const [carregando, setCarregando] = useState(false);

    const sair = async () => {
        await logout();
        navigation.navigate('Login'); // redireciona manualmente para login
    };

    return (
        <LinearGradient colors={['#DFF5EB', '#FFFFFF']} style={Estetica.home.container}>
            <View style={Estetica.home.centered}>
                <Text>Olá, {perfil?.nome || 'Visitante'}!</Text>

                <Image source={require('../../assets/iffar.png')} style={Estetica.home.logo}></Image>

                <Text style={Estetica.home.titulo}>Guia Acadêmico - IFFar Panambi</Text>

                <Button mode="contained" style={Estetica.home.botao} onPress={() => navigation.navigate('Cursos')}>Ver cursos</Button>
                <Button mode="contained" style={Estetica.home.botao} onPress={() => navigation.navigate('Eventos')}>Ver eventos</Button>
                <Button mode="outlined" style={Estetica.home.botao} onPress={() => navigation.navigate('Sobre')}>Sobre o app</Button>

            </View>
        </LinearGradient>
    );
}