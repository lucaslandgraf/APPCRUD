import React, { useState } from 'react';
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

// --- DADOS DE EXEMPLO ---
const dadosAlunos = [
    { id: 1, nome: 'Maria Silva', email: 'maria@email.com', rol: 'ADM' },
    { id: 2, nome: 'João Souza', email: 'joao.souza@corp.com', rol: 'DEFAULT' },
    { id: 3, nome: 'Ana Pereira', email: 'ana.p@uni.edu', rol: 'ADM' },
    { id: 4, nome: 'Pedro Lima', email: 'pedro.lima@dev.com', rol: 'DEFAULT' },
    // Adicione mais dados conforme necessário
];

export default function ListagemAlunos({ navigation }) {
    const [alunos, setAlunos] = useState(dadosAlunos);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleEdit = (aluno) => {
        Alert.alert('Editar', `Editar aluno: ${aluno.nome}`);
    };

    // Componente que define o cabeçalho da tabela
    const renderTableHeader = () => (
        <View style={[Estilo.row, Estilo.headerRow]}>
            <Text style={[Estilo.columnHeader, Estilo.colID]}>ID</Text>
            <Text style={[Estilo.columnHeader, Estilo.colNome]}>Nome</Text>
            <Text style={[Estilo.columnHeader, Estilo.colEmail]}>E-mail</Text>
            <Text style={[Estilo.columnHeader, Estilo.colRol]}>Rol</Text>
            <Text style={[Estilo.columnHeader, Estilo.colAcoes]}>Ações</Text>
        </View>
    );

    // Componente que renderiza cada linha da tabela (com badge de Rol)
    const renderItem = ({ item }) => (
        <View style={Estilo.row}>
            <Text style={[Estilo.cell, Estilo.colID]}>{item.id}</Text>
            <Text style={[Estilo.cell, Estilo.colNome]} numberOfLines={1}>{item.nome}</Text>
            <Text style={[Estilo.cell, Estilo.colEmail]} numberOfLines={1}>{item.email}</Text>
            
            {/* NOVO: Badge de Rol */}
            <View style={[Estilo.cell, Estilo.colRol, Estilo.rolContainer]}>
                <Text style={[Estilo.rolBadge, Estilo[`rol_${item.rol}`]]}>
                    {item.rol}
                </Text>
            </View>
            
            <View style={[Estilo.cell, Estilo.colAcoes, Estilo.actionsContainer]}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={Estilo.actionButton}>
                    <Feather name="edit" size={16} color="#4285f4" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={Estilo.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Cabeçalho da Tela com botão de Voltar */}
            <View style={Estilo.pageHeader}>
                <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
                    <Text style={Estilo.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={Estilo.pageTitle}>Listagem de Alunos</Text>
            </View>

            {/* FlatList que renderiza a Tabela */}
            <FlatList
                data={alunos}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderTableHeader} 
                contentContainerStyle={Estilo.content}
                ListEmptyComponent={<Text style={Estilo.emptyText}>Nenhum aluno encontrado no sistema.</Text>}
            />
        </SafeAreaView>
    );
}

// --- ESTILOS ATUALIZADOS ---
const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    // Estilos do Cabeçalho da TELA
    pageHeader: {
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
        paddingRight: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#4285f4',
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#212529'
    },
    content: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    
    // Estilos da Tabela
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    headerRow: {
        backgroundColor: '#e9ecef', 
        borderBottomWidth: 2,
        borderBottomColor: '#ced4da',
        paddingVertical: 12,
        marginHorizontal: -10, 
        paddingHorizontal: 10,
    },
    columnHeader: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#343a40',
        textAlign: 'center',
    },
    cell: {
        fontSize: 13,
        color: '#495057',
        paddingHorizontal: 5,
        textAlign: 'center',
    },
    
    // Larguras Otimizadas
    colID: {
        width: 35, 
    },
    colNome: {
        flex: 1.8, 
        textAlign: 'left',
        paddingLeft: 8,
    },
    colEmail: {
        flex: 1.8, 
        textAlign: 'left',
    },
    colRol: {
        width: 65, 
    },
    colAcoes: {
        width: 45, 
    },

    // ESTILOS NOVOS DO ROL 
    rolContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0, 
    },
    rolBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
    },
    
    rol_ADM: {
        backgroundColor: '#dc3545', 
    },
    rol_DEFAULT: {
        backgroundColor: '#00a6ffff', 
    },
    
    // Estilos de Ações
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    actionButton: {
        padding: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#6c757d',
    }
});