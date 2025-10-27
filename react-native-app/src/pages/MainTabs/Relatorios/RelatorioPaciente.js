import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    SafeAreaProvider,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    StatusBar,
    Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const DADOS_EXAMES_RELATORIO = [
    {
        id: 1,
        nome: 'Lucas Silva',
        cpf: '123.456.789-00',
        tipoExame: 'Hemograma Completo',
        dataExame: '2024-05-10',
        resultado: 'Negativo',
        observacao: 'Nenhuma alteração significativa.',
    },
    {
        id: 2,
        nome: 'Ana Souza',
        cpf: '987.654.321-00',
        tipoExame: 'Glicemia',
        dataExame: '2024-05-15',
        resultado: 'Positivado',
        observacao: 'Requer acompanhamento médico.',
    },
    {
        id: 3,
        nome: 'Pedro Martins',
        cpf: '444.333.222-11',
        tipoExame: 'Colesterol Total',
        dataExame: '2024-05-01',
        resultado: 'Em Andamento',
        observacao: 'Aguardando liberação.',
    },
    {
        id: 4,
        nome: 'Juliana Costa',
        cpf: '111.222.333-44',
        tipoExame: 'Urina Tipo I',
        dataExame: '2024-05-05',
        resultado: 'Negativo',
        observacao: 'OK.',
    },
];

export default function RelatorioPaciente({ navigation }) {

    const handleGoBack = () => {
        navigation.goBack();
    };
    
    const handleEdit = (item) => {
        navigation.navigate('ListagemPacientes'); 
    };

    const handleDelete = (item) => {
        Alert.alert('Excluir', `Deseja realmente excluir o exame do paciente ${item.nome}?`);
    };

    const renderTableHeader = () => (
        <View style={[Estilo.row, Estilo.headerRow]}>
            <Text style={[Estilo.columnHeader, Estilo.colID]}>ID</Text>
            <Text style={[Estilo.columnHeader, Estilo.colNome]}>Paciente</Text>
            <Text style={[Estilo.columnHeader, Estilo.colTipo]}>Tipo Exame</Text>
            <Text style={[Estilo.columnHeader, Estilo.colDataExame]}>Data Exame</Text>
            <Text style={[Estilo.columnHeader, Estilo.colResultado]}>Resultado</Text>
            <Text style={[Estilo.columnHeader, Estilo.colAcoes]}>Ações</Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={Estilo.itemCard}> 
            <View style={Estilo.row}> 
                <Text style={[Estilo.cell, Estilo.colID]}>{item.id}</Text>
                <Text style={[Estilo.cell, Estilo.colNome]} numberOfLines={1}>{item.nome}</Text>
                <Text style={[Estilo.cell, Estilo.colTipo]} numberOfLines={1}>{item.tipoExame}</Text>
                
                <Text style={[Estilo.cell, Estilo.colDataExame]}>
                    {item.dataExame.split('-').reverse().join('/')} 
                </Text>
                
                <View style={[Estilo.cell, Estilo.colResultado, Estilo.resContainer]}>
                    <Text style={[Estilo.resBadge, Estilo[`res_${item.resultado.replace(/\s/g, '')}`]]} numberOfLines={1}>
                        {item.resultado}
                    </Text>
                </View>

                <View style={[Estilo.cell, Estilo.colAcoes, Estilo.actionsContainer]}>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={Estilo.actionButton}>
                        <Feather name="edit" size={16} color="#4285f4" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} style={Estilo.actionButton}>
                        <Feather name="trash-2" size={16} color="#dc3545" /> 
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={Estilo.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <View style={Estilo.header}>
                <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
                    <Text style={Estilo.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={Estilo.headerTitle}>Relatório de Pacientes</Text>
            </View>

            <FlatList
                data={DADOS_EXAMES_RELATORIO}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderTableHeader}
                contentContainerStyle={Estilo.listContent}
                ListEmptyComponent={<Text style={Estilo.emptyText}>Nenhum dado de exame disponível.</Text>}
                showsVerticalScrollIndicator={false}
            />
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

    listContent: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 20,
    },
    
    itemCard: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2, 
    },

    row: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
    },

    headerRow: {
        backgroundColor: '#e9ecef', 
        borderBottomWidth: 2,
        borderBottomColor: '#ced4da',
        paddingVertical: 12,
        marginHorizontal: -15, 
        paddingHorizontal: 15,
        marginBottom: 5,
        zIndex: 1, 
    },
    columnHeader: {
        fontWeight: 'bold',
        fontSize: 12, 
        color: '#343a40',
        textAlign: 'center',
    },
    cell: {
        fontSize: 11, 
        color: '#495057',
        paddingHorizontal: 3,
        textAlign: 'center',
        justifyContent: 'center', 
    },
    
    colID: {
        width: 30, 
    },
    colNome: {
        flex: 1.5,
        textAlign: 'left',
        paddingLeft: 5,
    },
    colTipo: {
        flex: 1.5,
    },
    colDataExame: { 
        width: 70,
    },
    colResultado: {
        width: 80, 
    },
    colAcoes: {
        width: 60, 
        paddingHorizontal: 2,
    },

    resContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
    },
    resBadge: {
        paddingHorizontal: 4,
        paddingVertical: 3,
        borderRadius: 12,
        fontSize: 9, 
        fontWeight: 'bold',
        color: '#fff',
    },
    res_Positivado: {
        backgroundColor: '#dc3545', 
    },
    res_Negativo: {
        backgroundColor: '#28a745', 
    },
    res_EmAndamento: {
        backgroundColor: '#ffc107', 
        color: '#343a40', 
    },

    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    actionButton: {
        padding: 3,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#6c757d',
    }
});