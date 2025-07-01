import React from "react";
import { View, Linking } from 'react-native';
import Estetica from "../config/Estetica";
import { Text, Button } from "react-native-paper";

export default () => {
    return (
        <View style={Estetica.sobre.container}>
            <Text style={Estetica.sobre.titulo}>Sobre o app</Text>
            <Text>Este aplicativo é um projeto acadêmico do curso de Sistemas para Internet – Campus Panambi.</Text>
            <Button
                style={Estetica.sobre.botao} mode="contained"
                onPress={() => Linking.openURL('https://iffarroupilha.edu.br/panambi')}>Site do Campus
            </Button>

        </View>
    );
}