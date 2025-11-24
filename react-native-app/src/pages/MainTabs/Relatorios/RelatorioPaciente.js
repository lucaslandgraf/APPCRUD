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
    TextInput,
    ScrollView
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
    const [isPrinting, setIsPrinting] = useState(false);

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
                item.paciente_nome && item.paciente_nome.toLowerCase().includes(termoBusca.toLowerCase())
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

    // FUNÇÃO PARA LIMPAR CARACTERES QUE QUEBRAM O HTML
    const escapeHtml = (text) => {
        if (!text) return "";
        return String(text)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const toggleExpand = (uniqueId) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === uniqueId ? null : uniqueId);
    };

    const gerarHtmlRelatorio = (dados) => {
        const dataEmissao = new Date().toLocaleString('pt-BR');
        let itemsHtml = '';

        dados.forEach(item => {
            const nome = escapeHtml(item.paciente_nome || '-');
            const cpf = escapeHtml(item.paciente_cpf || '-');
            const tipoExame = item.agendamento_tipo_exame ? escapeHtml(item.agendamento_tipo_exame.toUpperCase()) : '-';

            let resultadoDisplay = escapeHtml(item.resultado_final || '-');

            if (item.agendamento_tipo_exame === 'covid' && item.nivel_anticorpos) {
                resultadoDisplay += `<br><span style="font-size: 8px; color: #666;">(Anticorpos: ${item.nivel_anticorpos.toFixed(2)})</span>`;
            }

            itemsHtml += `
                <tr>
                    <td>${item.paciente_id}</td>
                    <td>${nome}</td>
                    <td>${cpf}</td>
                    <td>${formatarData(item.paciente_data_nascimento)}</td>
                    <td>${formatarData(item.agendamento_data_consulta)}</td>
                    <td>${tipoExame}</td>
                    <td>${resultadoDisplay}</td>
                </tr>
            `;
        });

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { font-family: sans-serif; font-size: 9px; color: #333; padding: 15px; }
                    
                    .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #2480F9; padding-bottom: 10px; }
                    .header h1 { color: #2480F9; font-size: 16px; text-transform: uppercase; margin: 0 0 5px 0; }
                    .header p { font-size: 9px; color: #666; margin: 0; }
                    
                    table { width: 100%; border-collapse: collapse; }
                    
                    th, td { 
                        border: 1px solid #ccc; 
                        padding: 5px; 
                        text-align: left; 
                        vertical-align: top; 
                    }
                    
                    th { background-color: #f0f4f8; color: #2480F9; font-weight: bold; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    
                    /* Estilos de largura fixos para ajudar o renderizador */
                    th:nth-child(1) { width: 5%; }
                    th:nth-child(2) { width: 20%; }
                    th:nth-child(3) { width: 13%; }
                    th:nth-child(4) { width: 10%; }
                    th:nth-child(5) { width: 10%; }
                    th:nth-child(6) { width: 12%; }
                    th:nth-child(7) { width: 30%; }

                    .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #999; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>SPS Mobile</h1>
                    <p>Relatório de Pacientes - ${dataEmissao}</p>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th> <th>Nome</th> <th>CPF</th> <th>Nasc.</th> <th>Data</th> <th>Exame</th> <th>Resultado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>

                <div class="footer">
                    <p>SPS Mobile © 2025</p>
                </div>
            </body>
            </html>
        `;
    };

    const handleGerarRelatorio = async (htmlContent) => {
        if (isPrinting) return;
        setIsPrinting(true);

        try {
            if (Platform.OS === 'web') {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(htmlContent);
                    printWindow.document.close();
                    setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
                } else {
                    Alert.alert("Erro", "Habilite pop-ups.");
                }
                setIsPrinting(false);
            } else {
                // 2. CONFIGURAÇÃO ESPECÍFICA PARA MOBILE (Evita travamentos)
                const { uri } = await Print.printToFileAsync({
                    html: htmlContent,
                    base64: false,
                    width: 612, // Tamanho A4
                    height: 792
                });

                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(uri, {
                        dialogTitle: 'Relatório',
                        mimeType: 'application/pdf',
                        UTI: '.pdf',
                    });
                } else {
                    Alert.alert('Erro', 'Compartilhamento não disponível.');
                }
            }
        } catch (error) {
            console.error('Erro PDF:', error);
            Alert.alert('Erro', 'Falha ao criar PDF. Tente com menos dados.');
        } finally {
            setIsPrinting(false);
        }
    };

    const onGerarPdfTodos = () => {
        if (listaFiltrada.length === 0) {
            Alert.alert("Aviso", "Nenhum paciente na lista.");
            return;
        }
        // Se a lista for muito grande, avisa ou limita
        if (listaFiltrada.length > 300) {
            Alert.alert("Aviso", "Muitos registros. O PDF pode demorar alguns segundos.");
        }
        const html = gerarHtmlRelatorio(listaFiltrada);
        handleGerarRelatorio(html);
    };

    const onGerarPdfUnico = (item) => {
        const html = gerarHtmlRelatorio([item]);
        handleGerarRelatorio(html);
    };

    const renderItem = ({ item, index }) => {
        const uniqueId = `${item.paciente_id}-${index}`;
        const isExpanded = expandedId === uniqueId;
        const resultadoDisplay = item.resultado_final || 'Pendente';

        return (
            <TouchableOpacity
                style={Estilo.card}
                onPress={() => toggleExpand(uniqueId)}
                activeOpacity={0.8}
            >
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
                {isExpanded && (
                    <View style={Estilo.cardDetails}>
                        <View style={Estilo.separator} />
                        <Text style={Estilo.cardSubTitle}>Detalhes do Paciente</Text>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>ID Paciente:</Text><Text style={Estilo.infoValor}>{item.paciente_id}</Text></View>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Data Nasc.:</Text><Text style={Estilo.infoValor}>{formatarData(item.paciente_data_nascimento)}</Text></View>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Telefone:</Text><Text style={Estilo.infoValor}>{item.paciente_telefone || '-'}</Text></View>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Endereço:</Text><Text style={Estilo.infoValor} numberOfLines={2}>{item.paciente_endereco || '-'}</Text></View>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Observações:</Text><Text style={Estilo.infoValor} numberOfLines={3}>{item.paciente_observacoes || '-'}</Text></View>

                        <View style={Estilo.separator} />
                        <Text style={Estilo.cardSubTitle}>Último Exame/Agendamento</Text>
                        <View style={Estilo.infoRow}><Text style={Estilo.infoLabel}>Tipo Exame:</Text><Text style={Estilo.infoValor}>{item.agendamento_tipo_exame || 'N/A'}</Text></View>
                        <View style={Estilo.infoRow}>
                            <Text style={Estilo.infoLabel}>Resultado:</Text>
                            <Text style={[Estilo.infoValor, { fontWeight: 'bold', color: '#2480F9' }]}>{resultadoDisplay}</Text>
                        </View>

                        {item.agendamento_tipo_exame === 'covid' && item.nivel_anticorpos && (
                            <View style={Estilo.infoRow}>
                                <Text style={Estilo.infoLabel}>Nível Anticorpos:</Text>
                                <Text style={Estilo.infoValor}>{item.nivel_anticorpos.toFixed(2)} BAU/mL</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={Estilo.pdfButton}
                            onPress={() => onGerarPdfUnico(item)}
                            disabled={isPrinting}
                        >
                            <Feather name="file-text" size={16} color="#FFF" />
                            <Text style={Estilo.pdfButtonText}>
                                {Platform.OS === 'web' ? 'Imprimir Relatório' : 'Gerar PDF'}
                            </Text>
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
                    disabled={isPrinting || isLoading}
                >
                    {isPrinting ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Feather
                            name={Platform.OS === 'web' ? "printer" : "download"}
                            size={20}
                            color="#FFF"
                        />
                    )}
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#2480F9" style={{ flex: 1 }} />
            ) : error ? (
                <Text style={Estilo.emptyText}>Erro ao carregar: {error}</Text>
            ) : (
                <>
                    {Platform.OS !== 'web' && (
                        <FlatList
                            data={listaFiltrada}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={Estilo.listContent}
                            ListEmptyComponent={<Text style={Estilo.emptyText}>Nenhum paciente encontrado.</Text>}
                            extraData={expandedId}
                        />
                    )}

                    {Platform.OS === 'web' && (
                        <ScrollView contentContainerStyle={Estilo.listContent}>
                            {listaFiltrada.length > 0 ? (
                                listaFiltrada.map((item, index) => (
                                    <View key={index} style={{ width: '100%' }}>
                                        {renderItem({ item, index })}
                                    </View>
                                ))
                            ) : (
                                <Text style={Estilo.emptyText}>Nenhum paciente encontrado.</Text>
                            )}
                        </ScrollView>
                    )}
                </>
            )}
        </SafeAreaView>
    );
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    header: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
    },
    backButton: {
        marginRight: 10
    },
    backButtonText: {
        fontSize: 16,
        color: '#4285f4'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#212529'
    },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#f0f4f7',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginRight: 10
    },
    pdfTodosButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#2480F9',
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContent: {
        padding: 20,
        paddingTop: 10
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#6c757d'
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
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        flex: 1
    },
    infoRowResumo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2
    },
    cardDetails: {
        marginTop: 10
    },
    separator: {
        height: 1,
        backgroundColor: '#e9ecef',
        marginVertical: 12
    },
    cardSubTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#495057',
        marginBottom: 8
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    infoLabel: {
        fontSize: 14,
        color: '#6c757d',
        fontWeight: '500'
    },
    infoValor: {
        fontSize: 14,
        color: '#212529',
        fontWeight: '500',
        textAlign: 'right',
        flex: 1,
        marginLeft: 10
    },
    pdfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28a745',
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 15
    },
    pdfButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8
    }
});