import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Funcionalidades() {
    return (
        <View style={Estilo.container}>
            <Text style={Estilo.texto}>Tela de Funcionalidades</Text>
        </View>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    texto: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
