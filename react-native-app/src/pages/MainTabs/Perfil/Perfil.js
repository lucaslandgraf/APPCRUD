import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Perfil() {
    return (
        <View style={Estilo.container}>
        
            <View style={Estilo.mainContent}>
                <View style={Estilo.top}>

                    {/* Ícone do Perfil */}
                    <View style={[Estilo.icon, Estilo.profileIcon]}>
                        <Feather name="user" size={27} color="rgba(36, 128, 249, 0.8)" />
                    </View>
                    <View>
                        <Text style={Estilo.topTitle}>NOME SOBRENOME</Text>
                        <Text style={Estilo.topSubtitle}>Administrador do Sistema</Text>
                    </View>
                </View>

                <View style={Estilo.botoes}>


                    {/* Botão de Sair */}
                    <TouchableOpacity style={Estilo.button}>
                        <View style={Estilo.icon}>
                            <Feather name="log-out" size={25} color="rgba(36, 128, 249, 0.8)" />
                        </View>
                        <View>
                            <Text style={Estilo.title}>Sair</Text>
                            <Text style={Estilo.subtitle}>Encerrar sessão no sistema</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={Estilo.footer}>
                <Text style={Estilo.textfooter}>© 2025 Sistema Positivo de Saúde</Text>
                <Text style={Estilo.subtextfooter}>Todos os direitos reservados.</Text>
            </View>
        </View>
    );
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContent: {
        flex: 1, 
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 20,
        marginTop: 20,
        alignSelf: 'flex-start',
    },
    topTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    topSubtitle: {
        fontSize: 14,
    },
    icon: {
        backgroundColor: 'rgba(36, 128, 249, 0.2)',
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    botoes: {
        width: '100%',
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 5,
        marginBottom: 10,
        gap: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
    },
    footer: {
        backgroundColor: '#f0f4f7', 
        padding: 15,
    },
    textfooter: {
        color: '#858585ff',
        fontSize: 15,
        textAlign: 'center',
    },
    subtextfooter: {
        color: '#858585ff',
        fontSize: 12,
        textAlign: 'center',
    },
});