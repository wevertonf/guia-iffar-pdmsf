import React from "react";
import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Estetica from "../config/Estetica";

export default ({ nome, modalidade, nivel, duracao, turno, onPress }) => {
    return (
        <Card style={Estetica.cursoCard.card} mode="outlined" onPress={onPress}>
            <Card.Content>
                <Text style={Estetica.cursoCard.nivel}>{nivel}</Text>

                <Text variant="titleMedium" style={Estetica.cursoCard.nome}>{nome}</Text>

                <View style={Estetica.cursoCard.info}>
                    <MaterialCommunityIcons name="clock-outline" size={16} />
                    <Text style={Estetica.cursoCard.infoText}>{duracao}</Text>
                </View>

                <View style={Estetica.cursoCard.info}>
                    <MaterialCommunityIcons name="weather-night" size={16} />
                    <Text style={Estetica.cursoCard.infoText}>{turno}</Text>
                </View>

                <View style={Estetica.cursoCard.info}>
                    <MaterialCommunityIcons name="account-group-outline" size={16} />
                    <Text style={Estetica.cursoCard.infoText}>{modalidade}</Text>
                </View>

            </Card.Content>

        </Card>
    );

}