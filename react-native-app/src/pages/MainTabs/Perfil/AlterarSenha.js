import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

// API_URL Universal (para web e nativo)
const API_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.15.7:3000';

export default function AlterarSenha({ navigation }) {
    const [email, setEmail] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSalvar = async () => {
        if (!email || !senhaAtual || !novaSenha || !confirmarSenha) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            Alert.alert('Atenção', 'A "Nova Senha" e a "Confirmação" não são iguais.');
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/alterar-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senhaAtual, novaSenha }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Sucesso!', data.message);
                navigation.goBack(); // Volta para a tela de Perfil
            } else {
                Alert.alert('Erro', data.error || 'Não foi possível alterar a senha.');
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível se conectar ao servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={Estilo.container}>
            {/* Botão de Voltar */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={Estilo.voltarButton}>
                <Feather name="arrow-left" size={26} color="#333" />
                <Text style={Estilo.voltarTexto}>Voltar para o Perfil</Text>
            </TouchableOpacity>

            <View style={Estilo.box}>
                <Text style={Estilo.texto}>Alterar Senha</Text>

                <View style={Estilo.grupoCampo}>
                    <Text style={Estilo.label}>Seu E-mail</Text>
                    <TextInput style={Estilo.campo} placeholder="Digite seu e-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>

                <View style={Estilo.grupoCampo}>
                    <Text style={Estilo.label}>Senha Atual</Text>
                    <TextInput style={Estilo.campo} placeholder="Digite sua senha ATUAL" value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry />
                </View>

                <View style={Estilo.grupoCampo}>
                    <Text style={Estilo.label}>Nova Senha</Text>
                    <TextInput style={Estilo.campo} placeholder="Digite a NOVA senha" value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />
                </View>

                <View style={Estilo.grupoCampo}>
                    <Text style={Estilo.label}>Confirmar Nova Senha</Text>
                    <TextInput style={Estilo.campo} placeholder="Digite a NOVA senha novamente" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
                </View>

                <TouchableOpacity style={Estilo.botao} onPress={handleSalvar} disabled={isLoading}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        paddingTop: 50
    },
    voltarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15
    },
    voltarTexto: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
        fontWeight: '500'
    },
    box: {
        width: '90%',
        padding: 20,
        backgroundColor: '#FEFEFE',
        borderRadius: 12,
        alignItems: "center",
        alignSelf: 'center'
    },
    texto: {
        fontWeight: 'bold',
        fontSize: 20, color: '#000',
        marginBottom: 20
    },
    grupoCampo: {
        width: "100%",
        marginBottom: 15
    },
    label: {
        fontSize: 13,
        color: "#333",
        marginBottom: 4,
        marginLeft: 5,
        fontWeight: 'bold'
    },
    campo: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        width: "100%",
        borderRadius: 8
    },
    botao: {
        backgroundColor: "#2480F9",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        width: "100%"
    }
});