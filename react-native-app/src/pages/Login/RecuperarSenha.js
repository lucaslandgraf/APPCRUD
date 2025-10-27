import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

const API_URL = 'http://localhost:3000';

export default function RecuperarSenha({ navigation }) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRecuperar = async () => {
        if (!email) {
            Alert.alert('Atenção', 'Por favor, digite seu e-mail.');
            return;
        }
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/recuperar-senha`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }),
            });

            const data = await response.json();

            Alert.alert('Solicitação Enviada', data.message);
            navigation.goBack(); 

        } catch (error) {
            console.error(error);
            Alert.alert('Erro', 'Não foi possível se conectar ao servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={Estilo.container}>
            <View style={Estilo.box}>

                {/* Ícone de E-mail */}
                <View style={Estilo.cadeado}>
                    <Feather name="mail" size={27} color="white" />
                </View>

                <Text style={Estilo.texto}>Recuperar Senha</Text>
                <Text style={Estilo.subtexto}>
                    Digite seu e-mail institucional para enviarmos uma nova senha.
                </Text>

                {/* Campo de e-mail */}
                <View style={Estilo.grupoCampo}>
                    <Text style={Estilo.label}>E-mail Institucional</Text>
                    <TextInput
                        style={Estilo.campo}
                        placeholder="seu.email@instituicao.com"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                {/* Botão de Enviar */}
                <TouchableOpacity 
                    style={Estilo.botao} 
                    onPress={handleRecuperar} 
                    disabled={isLoading}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                        {isLoading ? 'Enviando...' : 'Enviar Nova Senha'}
                    </Text>
                </TouchableOpacity>

                {/* Botão de Voltar */}
                <TouchableOpacity style={{ width: '100%', marginTop: 15 }} onPress={() => navigation.goBack()}>
                    <Text style={Estilo.ForgetPass}>
                        Voltar para o Login
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f9f9f9"
    },
    cadeado: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2480F9',
        borderRadius: 60 / 2,
        margin: 10,
    },
    box: {
        width: 350,
        padding: 20,
        backgroundColor: '#FEFEFE',
        borderRadius: 12,
        alignItems: "center"
    },
    texto: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000'
    },
    subtexto: {
        fontSize: 12,
        margin: 5,
        textAlign: "center"
    },
    grupoCampo: {
        width: "100%",
        alignItems: "center",
        marginBottom: 15,
        marginTop: 10
    },
    label: {
        fontSize: 13,
        color: "#333",
        marginBottom: 4,
        marginLeft: 5,
        alignSelf: "flex-start",
        fontWeight: 'bold',
    },
    campo: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        width: "100%",
        borderRadius: 8,
    },
    ForgetPass: {
        fontWeight: 'bold',
        fontSize: 14,
        color: "#555",
        textDecorationLine: "underline",
        margin: 4,
        alignSelf: 'center',
    },
    botao: {
        backgroundColor: "#2480F9",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        width: "100%",
    }
});