import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//TELAS
import Home from './src/screens/Home';
import Cursos from './src/screens/Cursos';
import Eventos from './src/screens/Eventos';
import Sobre from './src/screens/Sobre';
import Cadastro from './src/screens/Cadastro';

import DetalheCurso from './src/screens/DetalheCurso';
import DetalheEvento from './src/screens/DetalheEvento';

import NovoEvento from './src/screens/NovoEvento';
import NovoCurso from './src/screens/NovoCurso';

import Login from './src/screens/Login';
import Perfil from './src/screens/Perfil'; // import da nova tela Perfil

//TEMA
import { tema } from './src/config/Tema';

//CONTEXTO
import { UsuarioProvider } from './src/contexto/UsuarioContexto';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* function StackCursos() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Cursos' component={Cursos} options={{ title: 'Cursos disponíveis' }} />
      <Stack.Screen name='DetalheCurso' component={DetalheCurso} options={{ title: 'Detalhes do curso' }} />
    </Stack.Navigator>
  );
} */

export default function App() {
  return (
    <PaperProvider theme={tema}>
      <UsuarioProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: true, tabBarActiveTintColor: tema.colors.primary }}>

            <Tab.Screen name="Home" component={Home} options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" size={size} color={color} />
              )
            }} />
            {/*
            <Tab.Screen name="CursosTab" component={StackCursos} options={{
            tabBarLabel: 'Cursos',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="book-outline" size={size} color={color} />
            )}}/>
            */}
            <Tab.Screen name='Cursos' component={Cursos} options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="book-outline" size={size} color={color} />
              ),
            }} />
            <Tab.Screen name="Eventos" component={Eventos} options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />
              ),
            }} />
            <Tab.Screen name="Sobre" component={Sobre} options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="information-outline" size={size} color={color} />
              ),
            }} />
            <Tab.Screen
              name="Perfil"
              component={Perfil}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen name='DetalheCurso' component={DetalheCurso} options={{
              tabBarButton: () => null, tabBarStyle: { display: 'none' }
            }} />
            <Tab.Screen name="DetalheEvento" component={DetalheEvento} options={{
              tabBarButton: () => null, tabBarStyle: { display: 'none' }
            }} />
            <Tab.Screen name="NovoEvento" component={NovoEvento} options={{
              headerShown: true, title: "Novo Evento",
            }} />
            <Tab.Screen name="NovoCurso" component={NovoCurso} options={{
              headerShown: true, title: "Novo Curso",
            }} />
            <Tab.Screen name="Login" component={Login} options={{ title: 'Login' }} />
            <Tab.Screen name="Cadastro" component={Cadastro} options={{ title: 'Cadastro' }} />

          </Tab.Navigator>
        </NavigationContainer>
      </UsuarioProvider>
    </PaperProvider>
  );
}
