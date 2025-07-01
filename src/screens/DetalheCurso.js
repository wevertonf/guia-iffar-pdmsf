import React from "react";
import { Button, ScrollView } from "react-native";
import Estetica from "../config/Estetica";
import { Card, Divider, Text} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default ( {route} ) => {
    const {nome, modalidade, nivel, unidade, duracao, turno, descricao,} = route.params;

    const navigation = useNavigation();

    return(
        <ScrollView style={Estetica.detalheCurso.container}>
            <Card mode="outlined" style={Estetica.detalheCurso.card}>
                <Card.Content>
                    <Text variant="titleLarge">{nome}</Text>
                    <Divider style={Estetica.detalheCurso.divisor} />

                    <Text variant="bodyMedium">📚 Modalidade: {modalidade}</Text>
                    <Text variant="bodyMedium">🎓 Nível: {nivel}</Text>
                    <Text variant="bodyMedium">📍 Unidade: {unidade}</Text>
                    <Text variant="bodyMedium">⏱️ Duração: {duracao}</Text>
                    <Text variant="bodyMedium" >🕓Turno: {turno}</Text>

                    <Divider style={Estetica.detalheCurso.divisor} />

                    <Text variant="titleSmall" style={Estetica.detalheCurso.subtitulo}>Descrição:</Text>
                    <Text style={Estetica.detalheCurso.descricao}>{descricao}</Text>    

                </Card.Content>

            </Card>

            <Button onPress={() => navigation.goBack()} style={Estetica.detalheCurso.botaoVoltar} title="Voltar"/>

        </ScrollView>
    );

}