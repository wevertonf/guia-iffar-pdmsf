import React from 'react';
import { Badge, Card, Text, useTheme, Button } from 'react-native-paper';
import Estetica from '../config/Estetica';
import { View } from 'react-native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Componente que exibe um evento em formato de card
export default ({ titulo, data, local, inscricao, onPress, estaInscrito, eventoId, curtidas,
  comentarios, fotos }) => {
  const theme = useTheme();

  // Formata a data para dd/MM/yyyy
  const dataFormatada = format(new Date(data), 'dd/MM/yyyy');

  // Define cor e texto do badge de acordo com status das inscrições
  const corBadge = inscricao ? theme.colors.primary : theme.colors.secondary;
  const textoBadge = inscricao ? 'Inscrições abertas' : 'Inscrições encerradas';
  const corBadgeInscUser = estaInscrito ? theme.colors.primary : theme.colors.secondary;
  const textoBadgeInscrUser = estaInscrito ? 'INSCRITO' : 'NÃO INSCRITO';

  return (
    <Card style={Estetica.eventoCard.card} mode="outlined" onPress={onPress}>
      <Card.Content>
        <View style={Estetica.eventoCard.header}>
          <Text variant="titleMedium">{titulo}</Text>
          <Badge style={[Estetica.eventoCard.badge, { backgroundColor: corBadge }]}>
            {textoBadge}
          </Badge>
        </View>

        <Text variant="bodyMedium">📅 Data: {dataFormatada}</Text>
        <Text variant="bodyMedium">📍 Local: {local}</Text>

        {/* Ícones de interação */}
        <View style={Estetica.eventoCard.acoes}>
          <View style={Estetica.eventoCard.acaoItem}>
            <Icon name="heart" size={16} color={theme.colors.primary} />
            <Text>{curtidas || 0}</Text>
          </View>

          <View style={Estetica.eventoCard.acaoItem}>
            <Icon name="comment" size={16} color={theme.colors.primary} />
            <Text>{comentarios || 0}</Text>
          </View>

          <View style={Estetica.eventoCard.acaoItem}>
            <Icon name="camera" size={16} color={theme.colors.primary} />
            <Text>{fotos || 0}</Text>
          </View>
        </View>

        {inscricao && (
          <Badge style={[Estetica.eventoCard.badge, { backgroundColor: corBadgeInscUser }]}>
            {textoBadgeInscrUser}
          </Badge>
        )}

      </Card.Content>
    </Card>
  );
};