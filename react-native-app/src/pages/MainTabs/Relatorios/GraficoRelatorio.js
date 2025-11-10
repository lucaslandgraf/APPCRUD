import React, { useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    StatusBar, 
    ActivityIndicator,
    Dimensions, 
    ScrollView,
    Platform, 
    UIManager 
} from 'react-native';
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../services/api';
import { LineChart } from 'react-native-chart-kit';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const screenWidth = Dimensions.get("window").width;

export default function GraficoRelatorio({ navigation }) {
    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState(null); 
    const [model, setModel] = useState(null); 
    const [edaStats, setEdaStats] = useState(null); 
    
    useFocusEffect(
        useCallback(() => {
            const fetchChartData = async () => {
                setIsLoading(true); 
                setError(null);
                setChartData(null);
                setModel(null);
                setEdaStats(null); 

                try {
                    const response = await api.get('/grafico-regressao'); 
                    const { dataPoints, model, aed_stats } = response.data;

                    if (!dataPoints || dataPoints.length === 0) {
                        throw new Error("Nenhum dado de COVID com nível de anticorpos encontrado.");
                    }

                    const labels = dataPoints.map(p => p.x); 
                    const minX = Math.min(...labels);
                    const maxX = Math.max(...labels);
                    
                    const regressionLinePoints = [
                        model.alpha + model.beta * minX,
                        model.alpha + model.beta * maxX 
                    ];
                    
                    setChartData({
                        labels: [minX.toFixed(0), maxX.toFixed(0)], 
                        datasets: [
                            {
                                data: regressionLinePoints, 
                                color: (opacity = 1) => `rgba(36, 128, 249, ${opacity})`,
                                strokeWidth: 3,
                                withDots: true, 
                            }
                        ], 
                        legend: ["Linha de Regressão (Nível Anticorpos IgG)"] 
                    });
                    
                    setModel(model); 
                    setEdaStats(aed_stats); 

                } catch (err) {
                    let errorMessage = err.message;
                    if (err.response && err.response.data && err.response.data.error) {
                        errorMessage = err.response.data.error;
                    }
                    setError(errorMessage);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchChartData();
        }, [])
    );

    const handleGoBack = () => {
        navigation.goBack();
    };

    const StatsRow = ({ label, valorIdade, valorAnticorpos }) => (
        <View style={Estilo.statsRow}>
            <Text style={Estilo.statsLabel}>{label}</Text>
            <Text style={Estilo.statsValue}>{valorIdade.toFixed(2)}</Text>
            <Text style={Estilo.statsValue}>{valorAnticorpos.toFixed(2)}</Text>
        </View>
    );

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#2480F9" style={{ marginTop: 50 }} />;
        }
        
        if (error) {
            return <Text style={Estilo.errorText}>Erro ao carregar dados: {error}</Text>;
        }

        if (chartData && model && edaStats) { 
            return (
                <View style={Estilo.content}>
                    <Text style={Estilo.chartTitle}>Regressão: Idade vs. Nível de Anticorpos</Text>
                    
                    <LineChart
                        data={chartData}
                        width={screenWidth - 30} 
                        height={300}
                        yAxisLabel=""
                        yAxisSuffix="" 
                        xAxisLabel=" (Idade)"
                        chartConfig={{
                            backgroundColor: "#FFF",
                            backgroundGradientFrom: "#FFF",
                            backgroundGradientTo: "#FFF",
                            decimalPlaces: 0, 
                            color: (opacity = 1) => `rgba(36, 128, 249, ${opacity})`, 
                            labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: { r: "5", strokeWidth: "2", stroke: "#2480F9" } 
                        }}
                        style={Estilo.grafico}
                        withInnerLines={true}
                        withOuterLines={true}
                        withShadow={false}
                    />

                    <View style={Estilo.statsBox}>
                        <Text style={Estilo.statsTitle}>Resultados do Modelo (Regressão)</Text>
                        <Text style={Estilo.statsText}>
                            <Text style={Estilo.statsLabel}>Equação:</Text> Y = {model.alpha.toFixed(2)} + {model.beta.toFixed(2)} * X
                        </Text>
                        <Text style={Estilo.statsText}>
                            <Text style={Estilo.statsLabel}>R² (Determinação):</Text> {model.R2.toFixed(4)}
                        </Text>
                        <Text style={Estilo.statsInfo}>
                            (Y = Nível de Anticorpos, X = Idade)
                        </Text>
                    </View>
                    <View style={Estilo.statsBox}>
                        <Text style={Estilo.statsTitle}>Análise Exploratória de Dados (AED)</Text>
                        
                        <View style={[Estilo.statsRow, Estilo.statsTableHeader]}>
                            <Text style={Estilo.statsLabel}>Métrica</Text>
                            <Text style={Estilo.statsValue}>Idade (X)</Text>
                            <Text style={Estilo.statsValue}>Anticorpos (Y)</Text>
                        </View>

                        <StatsRow label="Média" valorIdade={edaStats.idade.media} valorAnticorpos={edaStats.nivel_anticorpos.media} />
                        <StatsRow label="Mediana" valorIdade={edaStats.idade.mediana} valorAnticorpos={edaStats.nivel_anticorpos.mediana} />
                        <StatsRow label="Moda" valorIdade={edaStats.idade.moda || 0} valorAnticorpos={edaStats.nivel_anticorpos.moda || 0} />
                        <StatsRow label="Variância" valorIdade={edaStats.idade.variancia} valorAnticorpos={edaStats.nivel_anticorpos.variancia} />
                        <StatsRow label="Desvio Padrão" valorIdade={edaStats.idade.desvio_padrao} valorAnticorpos={edaStats.nivel_anticorpos.desvio_padrao} />
                        <StatsRow label="Amplitude" valorIdade={edaStats.idade.amplitude} valorAnticorpos={edaStats.nivel_anticorpos.amplitude} />
                    </View>
                </View>
            );
        }
        return <Text style={Estilo.emptyText}>Carregando dados...</Text>;
    };

    return (
        <SafeAreaView style={Estilo.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            
            <View style={Estilo.header}>
                <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
                    <Text style={Estilo.backButtonText}>← Voltar </Text>
                </TouchableOpacity>
                <Text style={Estilo.headerTitle}>Gráficos e Estatísticas</Text>
            </View>
            
            <ScrollView>
                {renderContent()}
            </ScrollView>
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
        fontSize: 20, 
        fontWeight: '600',
        color: '#212529',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 15,
    },
    grafico: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#dc3545',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#6c757d',
    },
    statsBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: '#e9ecef',
        elevation: 2,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2480F9',
        textAlign: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    statsText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    statsInfo: {
        fontSize: 12,
        color: '#6c757d',
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
    statsTableHeader: {
        backgroundColor: '#f8f9fa', 
        paddingVertical: 8,
        paddingHorizontal: 6,
        borderBottomWidth: 2,
        borderBottomColor: '#dee2e6',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f1f1',
    },
    statsLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#212529',
        flex: 1.5, 
        textAlign: 'left', 
    },
    statsValue: {
        fontSize: 14,
        color: '#495057', 
        fontWeight: 'bold', 
        flex: 1, 
        textAlign: 'right', 
    }
});