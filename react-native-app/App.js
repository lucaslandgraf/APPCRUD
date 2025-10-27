import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import Login from './src/pages/Login/Login';
import RecuperarSenha from './src/pages/Login/RecuperarSenha';
import Home from './src/pages/MainTabs/Home/Home';
import Funcionalidades from './src/pages/MainTabs/Funcionalidades/Funcionalidades';
import Perfil from './src/pages/MainTabs/Perfil/Perfil';
import AlterarSenha from './src/pages/MainTabs/Perfil/AlterarSenha';
import Paciente from './src/pages/MainTabs/Paciente/Paciente';
import Exames from './src/pages/MainTabs/Exames/Exame';
import Alunos from './src/pages/MainTabs/Alunos/Alunos';
import ListagemAlunos from './src/pages/MainTabs/Alunos/ListagemAlunos';
import CadastroAlunos from './src/pages/MainTabs/Alunos/CadastroAlunos';
import EditarAluno from './src/pages/MainTabs/Alunos/EditarAluno'; 
import Agendamentos from './src/pages/MainTabs/Agendamentos/Agendamentos';
import CadastroAgendamento from './src/pages/MainTabs/Agendamentos/CadastroAgendamento';
import ListagemAgendamentos from './src/pages/MainTabs/Agendamentos/ListagemAgendamentos';
import Relatorios from './src/pages/MainTabs/Relatorios/Relatorios';
import RelatorioPaciente from './src/pages/MainTabs/Relatorios/RelatorioPaciente';
import GraficoRelatorio from './src/pages/MainTabs/Relatorios/GraficoRelatorio';
import CadastroPacientes from './src/pages/MainTabs/Paciente/CadastroPaciente';
import ListaPacientes from './src/pages/MainTabs/Paciente/ListagemPacientes';
import CadastroExames from './src/pages/MainTabs/Exames/CadastroExames';
import ListagemExames from './src/pages/MainTabs/Exames/ListagemExames';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator({ route }) {
    const usuarioLogado = route.params?.usuario;
    console.log('(App.js) Dados do usuário recebidos no TabNavigator:', usuarioLogado);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2480F9",
                tabBarInactiveTintColor: "#888",
                tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
                tabBarStyle: { height: 90, paddingTop: 5, paddingBottom: 10 },
                tabBarLabelPosition: "below-icon",
                tabBarSafeAreaInsets: { bottom: 10 }
            }}
        >
            <Tab.Screen
                name="Início"
                component={Home}
                options={{ tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color}/>, unmountOnBlur: true }}
            />
            <Tab.Screen
                name="Funcionalidades"
                component={Funcionalidades}
                options={{ tabBarIcon: ({ color }) => <Feather name="heart" size={22} color={color} />, unmountOnBlur: true }}
            />
            <Tab.Screen
                name="Perfil"
                options={{ tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} /> }}
            >
                {(props) => <Perfil {...props} usuario={usuarioLogado} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
                <Stack.Screen name="AlterarSenha" component={AlterarSenha}/>
                <Stack.Screen name="MainTabs" component={TabNavigator} />
                <Stack.Screen name="Alunos" component={Alunos} />
                <Stack.Screen name="ListagemAlunos" component={ListagemAlunos} />
                <Stack.Screen name="CadastroAlunos" component={CadastroAlunos} />
                <Stack.Screen name="EditarAluno" component={EditarAluno}/>
                <Stack.Screen name="Pacientes" component={Paciente}/>
                <Stack.Screen name="CadastroPacientes" component={CadastroPacientes}/>
                <Stack.Screen name="ListagemPacientes" component={ListaPacientes}/>
                <Stack.Screen name="Exames" component={Exames}/>
                <Stack.Screen name="CadastroExames" component={CadastroExames}/>
                <Stack.Screen name="ListagemExames" component={ListagemExames}/>
                <Stack.Screen name="Agendamentos" component={Agendamentos}/>
                <Stack.Screen name="CadastroAgendamento" component={CadastroAgendamento}/>
                <Stack.Screen name="ListagemAgendamentos" component={ListagemAgendamentos}/>
                <Stack.Screen name="Relatorios" component={Relatorios}/>
                <Stack.Screen name="RelatorioPaciente" component={RelatorioPaciente}/>
                <Stack.Screen name="GraficoRelatorio" component={GraficoRelatorio}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
}
