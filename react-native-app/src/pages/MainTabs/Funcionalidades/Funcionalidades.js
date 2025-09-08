import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Funcionalidades() {
    return (
        <View style={Estilo.container}>
            <View style={Estilo.top}>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'white'}}>Funcionalidades</Text>
                <Text style={{fontSize: 14, color: 'white'}}>Acesse todas as funcionalidades do sistema de saúde</Text>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={Estilo.button}>
                    <View style={Estilo.icon}>
                        <Feather name="user-plus" size={27} color="rgba(36, 128, 249, 0.8)" />
                    </View>
                    <Text style={Estilo.title}>Pacientes</Text>
                    <Text style={Estilo.subtitle}>Cadastro e gerenciamento de pacientes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={Estilo.button}>
                    <View style={Estilo.icon}>
                        <Feather name="calendar" size={25} color="rgba(36, 128, 249, 0.8)" />
                    </View>
                    <Text style={Estilo.title}>Agendamentos</Text>
                    <Text style={Estilo.subtitle}>Controle de consultas e procedimentos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={Estilo.button}>
                    <View style={Estilo.icon}>
                        <Feather name="file-text" size={25} color="rgba(36, 128, 249, 0.8)" />
                    </View>
                    <Text style={Estilo.title}>Relatórios</Text>
                    <Text style={Estilo.subtitle}>Relatórios e estatísticas do sistema</Text>
                </TouchableOpacity>

                <TouchableOpacity style={Estilo.button}>
                    <View style={Estilo.icon}>
                        <MaterialCommunityIcons name="school-outline" size={25} color="rgba(36, 128, 249, 0.8)" />
                    </View>
                    <Text style={Estilo.title}>Alunos</Text>
                    <Text style={Estilo.subtitle}>Cadastro de novos usuários no sistema</Text>
                </TouchableOpacity>

                <TouchableOpacity style={Estilo.button}>
                    <View style={Estilo.icon}>
                        <Feather name="activity" size={25} color="rgba(36, 128, 249, 0.8)" />
                    </View>
                    <Text style={Estilo.title}>Exames</Text>
                    <Text style={Estilo.subtitle}>Controle e resultados de exames</Text>
                </TouchableOpacity>

                <Text></Text>
            </ScrollView>
        </View>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    top:{
        backgroundColor: '#2480F9',
        marginBottom: 10,
        marginTop: 30,
        borderRadius: 10,
        width: 380,
        padding: 15,
        elevation: 5, 
    },
    title:{
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'center',
    },
    subtitle: {
        fontSize: 14,
    },
    button:{
    backgroundColor: '#ffffffff',
    paddingVertical: 20,
    borderRadius: 5,
    width: 370,
    alignItems: 'center',
    elevation: 5, 
    marginTop: 10,
    },
    icon:{
        backgroundColor: 'rgba(36, 128, 249, 0.2)',
        width: 45, 
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
