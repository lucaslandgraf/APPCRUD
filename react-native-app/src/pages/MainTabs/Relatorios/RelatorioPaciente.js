import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    StatusBar,
    Alert,
    ActivityIndicator,
    LayoutAnimation, 
    UIManager, 
    Platform,
    TextInput 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../services/api';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RelatorioPaciente({ navigation }) {
    const [relatorioData, setRelatorioData] = useState([]); 
    const [listaFiltrada, setListaFiltrada] = useState([]); 
    const [termoBusca, setTermoBusca] = useState(''); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [isPdfLoading, setIsPdfLoading] = useState(false);

    const fetchRelatorio = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/relatorios');
            setRelatorioData(response.data); 
            setListaFiltrada(response.data); 
        } catch (err) {
            let errorMessage = "Erro desconhecido";
            if (err.response && err.response.data && err.response.data.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            Alert.alert("Erro ao Carregar Relatório", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    useFocusEffect(useCallback(() => { fetchRelatorio(); }, []));
    useEffect(() => {
        if (termoBusca === '') {
            setListaFiltrada(relatorioData);
        } else {
            const filtrados = relatorioData.filter(item =>
                item.paciente_nome.toLowerCase().includes(termoBusca.toLowerCase())
            );
            setListaFiltrada(filtrados);
        }
    }, [termoBusca, relatorioData]);
    const handleGoBack = () => { navigation.goBack(); };
    const formatarData = (data) => {
        if (!data) return '-';
        try {
            const dataObj = new Date(data);
            return dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        } catch (e) { return data; }
    };
    const toggleExpand = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    // FUNÇÃO DE GERAR HTML 
    const gerarHtmlRelatorio = (dados) => {
        let itemsHtml = '';
        dados.forEach(item => {
            itemsHtml += `
                <tr>
                    <td>${item.paciente_id}</td>
                    <td>${item.paciente_nome || '-'}</td>
                    <td>${item.paciente_cpf || '-'}</td>
                    <td>${formatarData(item.paciente_data_nascimento)}</td>
                    <td>${item.paciente_telefone || '-'}</td>
                    <td>${item.paciente_endereco || '-'}</td>
                    <td>${item.agendamento_id || 'N/A'}</td>
                    <td>${formatarData(item.agendamento_data_consulta)}</td>
                    <td>${item.agendamento_tipo_exame || 'N/A'}</td>
                </tr>
            `;
        });
        return `
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 10px; color: #333; }
                    h1 { text-align: center; color: #2480F9; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; word-wrap: break-word; }
                    th { background-color: #f2f2f2; font-size: 11px; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                </style>
            </head>
            <body>
                <h1>Relatório de Pacientes</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Nascimento</th>
                            <th>Telefone</th>
                            <th>Endereço</th>
                            <th>Últ. Agend. ID</th>
                            <th>Últ. Consulta</th>
                            <th>Últ. Exame</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
            </body>
            </html>
        `;
    };

    // Função de PDF/Share
    const handleGerarPdf = async (htmlContent, fileName) => {
        if (isPdfLoading) return;
        setIsPdfLoading(true);
        try {
            // Converte HTML para PDF usando 'expo-print'
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                base64: false // O 'expo-sharing' prefere a URI do arquivo
            });

            // Verifica se o compartilhamento é possível
            if (!(await Sharing.isAvailableAsync())) {
                Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo.');
                setIsPdfLoading(false);
                return;
            }
            
            // Compartilha o arquivo PDF usando 'expo-sharing'
            await Sharing.shareAsync(uri, {
                dialogTitle: 'Compartilhar Relatório',
                mimeType: 'application/pdf',
                UTI: '.pdf',
            });

        } catch (error) {
            console.error('Erro ao gerar ou compartilhar PDF:', error);
            Alert.alert('Erro', 'Não foi possível gerar o PDF. ' + error.message);
        } finally {
            setIsPdfLoading(false);
        }
    };

    const onGerarPdfTodos = () => {
        if (listaFiltrada.length === 0) {
            Alert.alert("Aviso", "Nenhum paciente na lista para gerar PDF.");
            return;
        }
        const html = gerarHtmlRelatorio(listaFiltrada);
        handleGerarPdf(html, "relatorio_geral_pacientes.pdf");
    };
    const onGerarPdfUnico = (item) => {
        const html = gerarHtmlRelatorio([item]);
        handleGerarPdf(html, `relatorio_${item.paciente_cpf || item.paciente_id}.pdf`);
    };

    const renderItem = ({ item }) => {
        const isExpanded = expandedId === item.paciente_id;
        return (
            <TouchableOpacity 
                style={Estilo.card} 
                onPress={() => toggleExpand(item.paciente_id)}
                activeOpacity={0.8}
            >
                {/* Parte Visível (Resumo) */}
                <View style={Estilo.cardHeader}>
                    <Text style={Estilo.cardTitle}>{item.paciente_nome || 'Paciente sem nome'}</Text>
                    <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#6c757d" />
                </View>
                <View style={Estilo.infoRowResumo}>
                    <Text style={Estilo.infoLabel}>CPF:</Text>
                    <Text style={Estilo.infoValor}>{item.paciente_cpf || '-'}</Text>
                </View>
                <View style={Estilo.infoRowResumo}>
                    <Text style={Estilo.infoLabel}>Última Consulta:</Text>
                    <Text style={Estilo.infoValor}>{formatarData(item.agendamento_data_consulta)}</Text>
                </View>

                {/* Parte Expansível (Detalhes) */}
                {isExpanded && (
                    <View style={Estilo.cardDetails}>
                        <View style={Estilo.separator} />
                        <Text style={Estilo.cardSubTitle}>Detalhes do Paciente</Text>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Data Nasc.:</Text><Text style={Estilo.infoValor}>{formatarData(item.paciente_data_nascimento)}</Text></View>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Telefone:</Text><Text style={Estilo.infoValor}>{item.paciente_telefone || '-'}</Text></View>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Endereço:</Text><Text style={Estilo.infoValor} numberOfLines={2}>{item.paciente_endereco || '-'}</Text></View>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Observações:</Text><Text style={Estilo.infoValor} numberOfLines={3}>{item.paciente_observacoes || '-'}</Text></View>
                        <View style={Estilo.separator} />
                        <Text style={Estilo.cardSubTitle}>Último Agendamento</Text>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Agend. ID:</Text><Text style={Estilo.infoValor}>{item.agendamento_id || 'N/A'}</Text></View>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Tipo Exame:</Text><Text style={Estilo.infoValor}>{item.agendamento_tipo_exame || 'N/A'}</Text></View>
                        
                        {/* Botão de PDF Individual */}
                        <TouchableOpacity 
                            style={Estilo.pdfButton}
                            onPress={() => onGerarPdfUnico(item)}
                            disabled={isPdfLoading}
                        >
                            <Feather name="file-text" size={16} color="#FFF" />
                            <Text style={Estilo.pdfButtonText}>Gerar PDF do Paciente</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={Estilo.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={Estilo.header}>
                <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
                    <Text style={Estilo.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={Estilo.headerTitle}>Relatório de Pacientes</Text>
            </View>

            {/* Barra de Busca + Botão PDF Todos */}
            <View style={Estilo.toolbar}>
                <TextInput
                    style={Estilo.searchInput}
                    placeholder="Buscar paciente por nome..."
                    placeholderTextColor="#888"
                    value={termoBusca}
                    onChangeText={setTermoBusca}
                />
                <TouchableOpacity 
                    style={Estilo.pdfTodosButton} 
                    onPress={onGerarPdfTodos}
                    disabled={isPdfLoading || isLoading}
                >
                    {isPdfLoading ? 
                        <ActivityIndicator size="small" color="#FFF" /> : 
                        <Feather name="download" size={20} color="#FFF" />
                    }
                </TouchableOpacity>
            </View>

            {/* Lista ou Loading */}
            {isLoading ? (
                <ActivityIndicator size="large" color="#2480F9" style={{ flex: 1 }} />
            ) : error ? (
                <Text style={Estilo.emptyText}>Erro ao carregar: {error}</Text>
            ) : (
                <FlatList
                    data={listaFiltrada} 
                    renderItem={renderItem}
                    keyExtractor={item => item.paciente_id.toString()}
                    contentContainerStyle={Estilo.listContent}
                    ListEmptyComponent={
                        <Text style={Estilo.emptyText}>
                            {relatorioData.length === 0 
                                ? "Nenhum paciente encontrado." 
                                : "Nenhum paciente encontrado com esse nome."}
                        </Text>
                    }
                    extraData={expandedId} 
                />
            )}
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
    backButton: { marginRight: 10 },
    backButtonText: { fontSize: 16, color: '#4285f4' },
    headerTitle: { fontSize: 20, fontWeight: '600', color: '#212529' },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    searchInput: {
        flex: 1, 
        height: 40,
        backgroundColor: '#f0f4f7',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginRight: 10,
    },
    pdfTodosButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#2480F9', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingTop: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#6c757d',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        flex: 1, 
    },
    infoRowResumo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    cardDetails: {
        marginTop: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 12,
    },
    cardSubTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#495057',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500',
    },
    infoValor: {
        fontSize: 14,
        color: '#212529',
        fontWeight: '500',
        textAlign: 'right',
        flex: 1, 
        marginLeft: 10,
    },
    pdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28a745', 
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 15,
    },
    pdfButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});