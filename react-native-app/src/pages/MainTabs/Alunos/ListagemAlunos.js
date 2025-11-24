import React, { useState, useEffect, useCallback } from 'react'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar, Alert, Platform, ActivityIndicator,
    TextInput 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; 
import api from '../../../services/api';

export default function ListagemAlunos({ navigation }) {
    
    const [alunos, setAlunos] = useState([]); 
    const [listaFiltrada, setListaFiltrada] = useState([]); // Lista mostrada na tela
    const [termoBusca, setTermoBusca] = useState(''); // Texto da busca

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null);

    const fetchAlunos = async () => {
        setError(null);
        if (alunos.length === 0) setIsLoading(true); 
        
        try {
            const response = await api.get('/alunos');
            let data = response.data;
            data.sort((a, b) => a.nome.localeCompare(b.nome));
            
            setAlunos(data); 
            if (termoBusca === '') {
                setListaFiltrada(data);
            }

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

    // useFocusEffect para recarregar os dados
    useFocusEffect(
        useCallback(() => {
            fetchAlunos();
        }, [])
    );

    // useEffect para filtrar a lista
    // Roda toda vez que o 'termoBusca' ou a lista 'alunos' mudam
    useEffect(() => {
        if (termoBusca === '') {
            setListaFiltrada(alunos);
        } else {
            const filtrados = alunos.filter(aluno =>
                aluno.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
                aluno.email.toLowerCase().includes(termoBusca.toLowerCase())
            );
            setListaFiltrada(filtrados);
        }
    }, [termoBusca, alunos]);

    const handleGoBack = () => { navigation.goBack(); };
    const handleEdit = (aluno) => { navigation.navigate('EditarAluno', { aluno: aluno }); };
    const handleDelete = (alunoParaExcluir) => {
        const executarExclusao = async () => {
            setIsDeleting(alunoParaExcluir.id);
            setError(null);
            try {
                const response = await api.delete(`/alunos/${alunoParaExcluir.id}`);
                const data = response.data;
                Alert.alert('Sucesso', data.message || 'Aluno excluído com sucesso.');
                setAlunos(alunosAtuais => alunosAtuais.filter(a => a.id !== alunoParaExcluir.id));
            } catch (err) {
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

    // Renderização do item como CARD
    const renderItem = ({ item }) => (
        <View style={Estilo.card}>
            {/* Seção 1: Nome e "Tag" do Papel (Rol) */}
            <View style={Estilo.cardHeader}>
                <Text style={Estilo.cardTitle} numberOfLines={1}>{item.nome}</Text>
                <View style={[Estilo.rolBadge, Estilo[`rol_${item.rol}`] || Estilo.rol_DEFAULT]}>
                    <Text style={Estilo.rolBadgeText}>{item.rol}</Text>
                </View>
            </View>

            {/* Seção 2: Informações (Email e ID) */}
            <View style={Estilo.cardBody}>
                <View style={Estilo.infoRow}>
                    <Feather name="mail" size={14} color="#6c757d" style={Estilo.infoIcon} />
                    <Text style={Estilo.infoText} numberOfLines={1}>{item.email}</Text>
                </View>
                <View style={Estilo.infoRow}>
                    <Feather name="hash" size={14} color="#6c757d" style={Estilo.infoIcon} />
                    <Text style={Estilo.infoText}>ID: {item.id}</Text>
                </View>
            </View>

            {/* Seção 3: Botões de Ação */}
            <View style={Estilo.cardFooter}>
                <TouchableOpacity 
                    style={[Estilo.actionButton, Estilo.editButton]} 
                    onPress={() => handleEdit(item)} 
                    disabled={isDeleting === item.id}
                >
                    <Feather name="edit" size={16} color="#0056b3" />
                    <Text style={Estilo.actionButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[Estilo.actionButton, Estilo.deleteButton]} 
                    onPress={() => handleDelete(item)} 
                    disabled={isDeleting === item.id}
                >
                    {isDeleting === item.id ? (
                        <ActivityIndicator size="small" color="#dc3545" />
                    ) : (
                        <>
                            <Feather name="trash-2" size={16} color="#dc3545" />
                            <Text style={[Estilo.actionButtonText, Estilo.deleteButtonText]}>Excluir</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={Estilo.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <View style={Estilo.pageHeader}>
                <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
                    <Text style={Estilo.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={Estilo.pageTitle}>Listagem de Alunos</Text>
            </View>

            {/* Barra de Busca */}
            <View style={Estilo.searchContainer}>
                <Feather name="search" size={20} color="#888" style={Estilo.searchIcon} />
                <TextInput
                    style={Estilo.searchInput}
                    placeholder="Buscar por nome ou e-mail..."
                    placeholderTextColor="#888"
                    value={termoBusca}
                    onChangeText={setTermoBusca}
                />
            </View>

            {/* Conteúdo (Loading, Erro ou a Lista) */}
            {isLoading ? (
                <ActivityIndicator size="large" color="#4285f4" style={{ marginTop: 50 }} />
            ) : error ? (
                <Text style={Estilo.emptyText}>Erro ao carregar: {error}</Text>
            ) : (
                <FlatList
                    data={listaFiltrada} 
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={Estilo.content}
                    ListEmptyComponent={
                        <Text style={Estilo.emptyText}>
                            {alunos.length === 0 ? "Nenhum aluno cadastrado." : "Nenhum aluno encontrado com esse nome/e-mail."}
                        </Text>
                    }
                    extraData={isDeleting} // Para re-renderizar o item durante a exclusão
                />
            )}
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
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 2,
    },
    backButton: {
        marginRight: 10,
        padding: 5, 
    },
    backButtonText: {
        fontSize: 16,
        color: '#4285f4',
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#212529',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50, 
        fontSize: 16,
        color: '#333',
    },
    content: {
        padding: 15, 
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
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
        flex: 1, 
        marginRight: 10,
    },
    rolBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start', 
    },
    rolBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
    },
    rol_ADM: {
        backgroundColor: '#dc3545', 
    },
    rol_DEFAULT: {
        backgroundColor: '#00a6ffff', 
    },
    cardBody: {
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    infoIcon: {
        marginRight: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#495057',
        flex: 1, 
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#f1f1f1',
        paddingTop: 12,
        marginTop: 5,
        gap: 10, 
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
    editButton: {
        backgroundColor: '#e3f2fd', 
    },
    actionButtonText: {
        color: '#0056b3', 
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
    deleteButton: {
         backgroundColor: '#fbe9e7', 
    },
    deleteButtonText: {
        color: '#dc3545', 
    }
});