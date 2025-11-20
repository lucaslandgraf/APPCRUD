import React, { useState, useCallback, useEffect } from 'react';
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
                try {
                    const response = await api.get('/grafico-regressao'); 
                    const { dataPoints, model, aed_stats } = response.data;

                    if (!dataPoints || dataPoints.length < 2) {
                        throw new Error("Dados insuficientes para o gráfico.");
                    }
                    
                    dataPoints.sort((a, b) => a.x - b.x);

                    const scatterData = dataPoints.map(p => p.y);
                    const regressionLineData = dataPoints.map(p => model.alpha + model.beta * p.x);
                    const numLabelsToShow = 6;
                    const freq = Math.max(1, Math.floor(dataPoints.length / (numLabelsToShow - 1)));
                    
                    const scatterLabels = dataPoints.map((p, index) => {
                        if (index === 0) return p.x.toFixed(0);
                        if (index === dataPoints.length - 1) {
                            return `${p.x.toFixed(0)} `; 
                        }
                        if (index % freq === 0 && (dataPoints.length - index) > (freq / 2)) {
                            return p.x.toFixed(0);
                        }
                        return "";
                    });
                    
                    setChartData({
                        labels: scatterLabels, // Estes são os labels do Eixo X
                        datasets: [
                            { 
                                data: scatterData,
                                color: (opacity = 1) => `rgba(108, 117, 125, 0.2)`, 
                                strokeWidth: 0, 
                                withDots: true,
                            },
                            { 
                                data: regressionLineData,
                                color: (opacity = 1) => `rgba(36, 128, 249, ${opacity})`, 
                                strokeWidth: 3,
                                withDots: false, 
                            }
                        ], 
                        legend: ["Dados Reais", "Linha de Regressão"] 
                    });
                    
                    setModel(model); 
                    setEdaStats(aed_stats); 

                } catch (err) {
                    let errorMessage = "Erro ao buscar dados.";
                    if (err.response && err.response.data && err.response.data.error) {
                        errorMessage = err.response.data.error;
                    } else if (err.message) {
                        errorMessage = err.message;
                    }
                    setError(errorMessage);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchChartData();
        }, [])
    );

    const handleGoBack = () => navigation.goBack();
    
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
            const isSignificant = model.p_value < 0.05;

            return (
                <View style={Estilo.content}>
                    
                    <Text style={Estilo.chartTitle}>Regressão: Idade vs. Nível de Anticorpos</Text>
                    

                    <View style={Estilo.chartContainer}>
                        <Text style={Estilo.chartSubtitle}>Eixo Y: Nível Anticorpos (BAU/mL)</Text>
                        <LineChart
                            data={chartData}
                            width={screenWidth - 25}
                            height={300}
                            withShadow={false}
                            yAxisLabel=" " 
                            xAxisLabel=" "
                            withHorizontalLabels={true} // Garante que os labels X sejam mostrados
                            withVerticalLabels={true}   // Garante que os labels Y sejam mostrados
                        
                            chartConfig={{
                                backgroundColor: "#FFF",
                                backgroundGradientFrom: "#FFF",
                                backgroundGradientTo: "#FFF",
                                decimalPlaces: 0, 
                                color: (opacity = 1) => `rgba(220, 220, 220, ${opacity})`, 
                                labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
                                style: { borderRadius: 16 },
                                propsForDots: { r: "1.5", strokeWidth: "0", stroke: "#6c757d" },
                                paddingLeft: "15", 
                                paddingRight: 15, 
                            }}
                            style={Estilo.grafico}
                            fromZero={true}
                        />
                    </View>
                    
                    <Text style={Estilo.xAxisLabelStyle}>Eixo X: Idade (Anos)</Text>

                    <View style={Estilo.statsBox}>
                        <Text style={Estilo.statsTitle}>Resultados do Modelo (Regressão)</Text>
                        <Text style={Estilo.statsText}>
                            <Text style={Estilo.statsLabel}>Equação:</Text> Y = {model.alpha.toFixed(2)} + {model.beta.toFixed(2)} * X
                        </Text>
                        <Text style={Estilo.statsText}>
                            <Text style={Estilo.statsLabel}>R² (Determinação):</Text> {model.R2.toFixed(4)}
                        </Text>
                        <Text style={Estilo.statsText}>
                            <Text style={Estilo.statsLabel}>P-value (Idade):</Text> {model.p_value.toFixed(6)}
                        </Text>
                        <Text style={[Estilo.statsInfo, { color: isSignificant ? '#28a745' : '#dc3545', fontWeight: 'bold' }]}>
                            {isSignificant
                                ? "P-value < 0.05: A idade é um preditor estatisticamente significativo."
                                : "P-value >= 0.05: A idade NÃO é um preditor estatisticamente significativo."
                            }
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
        paddingBottom: 40,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#212529',
        textAlign: 'center'
    },
    chartSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 5,
        marginTop: 10,
    },
    chartContainer: {
        width: screenWidth - 30,
        height: 350, 
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        backgroundColor: '#FFF', 
  
    },
    grafico: {
        borderRadius: 16,

    },
    xAxisLabelStyle: {
        fontSize: 14,
        color: '#6c757d',
        fontStyle: 'italic',
        marginTop: 10,
        textAlign: 'center'
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#dc3545',
        paddingHorizontal: 20,
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
        textAlign: 'left', 
        marginTop: 5,
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