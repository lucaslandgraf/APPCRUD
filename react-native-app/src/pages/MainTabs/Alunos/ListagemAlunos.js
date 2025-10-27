import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, Alert, Platform, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Import do 'api.js' que já tem o interceptor de token
import api from '../../../services/api';

export default function ListagemAlunos({ navigation }) {
    const [alunos, setAlunos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null);

    const fetchAlunos = async () => {
        setError(null);
        if (alunos.length === 0) setIsLoading(true);
        try {
            const response = await api.get('/alunos');

            // 4. No Axios, os dados vêm em 'response.data'
            let data = response.data;

            // O 'if (!response.ok)' não é necessário, o Axios já trata erros no catch automaticamente.

            data.sort((a, b) => a.nome.localeCompare(b.nome));
            setAlunos(data);
        } catch (err) {
            let errorMessage = err.message;
            if (err.response && err.response.data && err.response.data.error) {
                errorMessage = err.response.data.error;
            }
            setError(errorMessage);
            if (!isLoading) { Alert.alert("Erro de Conexão", errorMessage); }
        } finally {
            if (isLoading) setIsLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchAlunos);
        return unsubscribe;
    }, [navigation]);

    const handleGoBack = () => { navigation.goBack(); };
    const handleEdit = (aluno) => { navigation.navigate('EditarAluno', { aluno: aluno }); };

    const handleDelete = (alunoParaExcluir) => {
        const executarExclusao = async () => {
            setIsDeleting(alunoParaExcluir.id);
            setError(null);
            try {
                // O token será anexado aqui automaticamente
                const response = await api.delete(`/alunos/${alunoParaExcluir.id}`);

                // Os dados de sucesso vêm em 'response.data'
                const data = response.data;

                Alert.alert('Sucesso', data.message || 'Aluno excluído com sucesso.');
                setAlunos(alunosAtuais => alunosAtuais.filter(a => a.id !== alunoParaExcluir.id));

            } catch (err) {
                // Tratamento de erro do Axios
                let errorMessage = err.message;
                if (err.response && err.response.data && err.response.data.error) {
                    errorMessage = err.response.data.error;
                }
                console.error('Erro no catch ao excluir aluno:', err);
                setError(errorMessage);
                Alert.alert("Erro ao Excluir", errorMessage);
            } finally {
                setIsDeleting(null);
            }
        };

        const confirmMessage = `Excluir "${alunoParaExcluir.nome}" (ID: ${alunoParaExcluir.id})?`;
        if (Platform.OS === 'web') {
            if (window.confirm(confirmMessage)) {
                executarExclusao();
            }
        } else {
            Alert.alert("Confirmar Exclusão", confirmMessage, [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", onPress: executarExclusao, style: "destructive" }
            ]);
        }
    };

    // Renderização do cabeçalho
    const renderTableHeader = () => (
        <View style={[Estilo.row, Estilo.headerRow]}>
            <Text style={[Estilo.columnHeader, Estilo.colID]}>ID</Text>
            <Text style={[Estilo.columnHeader, Estilo.colNome]}>Nome</Text>
            <Text style={[Estilo.columnHeader, Estilo.colEmail]}>E-mail</Text>
            <Text style={[Estilo.columnHeader, Estilo.colRol]}>Rol</Text>
            <Text style={[Estilo.columnHeader, Estilo.colAcoes]}>Ações</Text>
        </View>
    );

    // Renderização de cada item
    const renderItem = ({ item }) => (
        <View style={Estilo.row}>
            <Text style={[Estilo.cell, Estilo.colID]}>{item.id}</Text>
            <Text style={[Estilo.cell, Estilo.colNome]} numberOfLines={1}>{item.nome}</Text>
            <Text style={[Estilo.cell, Estilo.colEmail]} numberOfLines={1}>{item.email}</Text>
            <View style={[Estilo.cell, Estilo.colRol, Estilo.rolContainer]}>
                <Text style={[Estilo.rolBadge, Estilo[`rol_${item.rol}`] || Estilo.rol_DEFAULT]}>{item.rol}</Text>
            </View>
            <View style={[Estilo.cell, Estilo.colAcoes, Estilo.actionsContainer]}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={Estilo.actionButton} disabled={isDeleting === item.id}>
                    <Feather name="edit" size={16} color={isDeleting === item.id ? '#ccc' : "#4285f4"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={Estilo.actionButton} disabled={isDeleting === item.id}>
                    {isDeleting === item.id ? (<ActivityIndicator size="small" color="#dc3545" />)
                        : (<Feather name="trash-2" size={16} color="#dc3545" />)}
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderContent = () => {
        if (isLoading) { return <ActivityIndicator size="large" color="#4285f4" style={{ marginTop: 50 }} />; }
        if (error && alunos.length === 0) { return <Text style={Estilo.emptyText}>Erro ao carregar: {error}</Text>; }
        return (
            <FlatList
                data={alunos}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderTableHeader}
                contentContainerStyle={Estilo.content}
                ListEmptyComponent={<Text style={Estilo.emptyText}>Nenhum aluno cadastrado.</Text>}
                extraData={isDeleting}
            />
        );
    };

    return (
        <SafeAreaView style={Estilo.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={Estilo.pageHeader}>
                <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
                    <Text style={Estilo.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={Estilo.pageTitle}>Listagem de Alunos</Text>
            </View>
            {renderContent()}
        </SafeAreaView>
    );
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    pageHeader: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef'
    },
    backButton: {
        marginRight: 10,
        paddingRight: 10
    },
    backButtonText: {
        fontSize: 16,
        color: '#4285f4'
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#212529'
    },
    content: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 20
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    headerRow: {
        backgroundColor: '#e9ecef',
        borderBottomWidth: 2,
        borderBottomColor: '#ced4da',
        paddingVertical: 12,
        marginHorizontal: -10,
        paddingHorizontal: 10
    },
    columnHeader: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#343a40',
        textAlign: 'center'
    },
    cell: {
        fontSize: 13,
        color: '#495057',
        paddingHorizontal: 5,
        textAlign: 'center'
    },
    colID: {
        width: 35
    },
    colNome: {
        flex: 1.8,
        textAlign: 'left',
        paddingLeft: 8
    },
    colEmail: {
        flex: 1.8,
        textAlign: 'left'
    },
    colRol: {
        width: 65
    },
    colAcoes: {
        width: 70
    },
    rolContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0
    },
    rolBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff'
    },
    rol_ADM: {
        backgroundColor: '#dc3545'
    },
    rol_DEFAULT: {
        backgroundColor: '#00a6ffff'
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    actionButton: {
        padding: 5
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#6c757d'
    }
});