import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    SafeAreaProvider, 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    StatusBar, 
    Image, // 1. Componente Image importado
} from 'react-native';

const GraficoExemplo = require('../../../images/grafico-exemplo.png');


export default function GraficoRelatorio({ navigation }) {
    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={Estilo.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            
            {/* Header */}
            <View style={Estilo.header}>
                <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
                    <Text style={Estilo.backButtonText}>← Voltar </Text>
                </TouchableOpacity>
                <Text style={Estilo.headerTitle}>Gráficos e Estatísticas</Text>
            </View>
            
            {/* conteúdo dos gráficos */}
            <View style={Estilo.content}>
                {/* 3. Imagem adicionada */}
                <Text style={Estilo.chartTitle}>Visualização de Dados (Exemplo)</Text>
                <Image 
                    source={GraficoExemplo} 
                    style={Estilo.graficoImage} 
                    resizeMode="contain"
                />
            </View>
        </SafeAreaView>
    );
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    
    header: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        marginRight: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#4285f4',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#212529',
    },

    content: {
        flex: 1,
        justifyContent: 'flex-start', // Alterado para manter o conteúdo no topo
        alignItems: 'center',
        padding: 20,
    },
    
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 15,
    },

    // Estilo para a imagem do gráfico
    graficoImage: {
        width: '100%', // Largura total da área de conteúdo
        height: 300,  // Altura fixa para visualização
        backgroundColor: '#fff', // Fundo branco para simular o gráfico
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
});