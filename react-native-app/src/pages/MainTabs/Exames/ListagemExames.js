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
import { Octicons } from "@expo/vector-icons"; 

const dadosFicticios = [
    { id: 1, nome: 'Hemograma Completo', tipoExame: 'Sangue', pacienteNome: 'Maria Silva', dataConsulta: '2025-10-10' },
    { id: 2, nome: 'Covid', tipoExame: 'Covid-19', pacienteNome: 'João Souza', dataConsulta: '2025-10-12' },
    { id: 3, nome: 'Dengue', tipoExame: 'Dengue', pacienteNome: 'Ana Pereira', dataConsulta: '2025-10-15' },
];

export default function ListagemExames({ navigation }) {
    const [exames, setExames] = useState(dadosFicticios);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleEdit = (exame) => {
        console.log('Editar Exame:', exame.id);
        Alert.alert("Editar", `Abrir tela de edição para o exame: ${exame.nome}`);
    };

    const handleDelete = (exame) => {
        Alert.alert(
            "Confirmar exclusão",
            `Tem certeza que deseja excluir o exame "${exame.nome}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => {
                        // Lógica de exclusão real (API, estado, etc.)
                        console.log('Excluir Exame:', exame.id);
                        setExames(prevExames => prevExames.filter(item => item.id !== exame.id));
                        Alert.alert("Sucesso", `Exame "${exame.nome}" excluído.`);
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={Estilo.exameCard}>
            <View style={Estilo.exameCardContent}>
                <Text style={Estilo.exameCardTitle}>{item.nome} ({item.tipoExame})</Text>
                <Text style={Estilo.exameCardSubtitle}>Paciente: {item.pacienteNome}</Text>
                <Text style={Estilo.exameCardDetails}>Consulta: {item.dataConsulta}</Text>
            </View>
            
            <View style={Estilo.actionsContainer}>
                <TouchableOpacity
                    style={Estilo.actionButton}
                    onPress={() => handleEdit(item)}
                >
                    <Octicons name="pencil" size={20} color="#2480f9" /> 
                </TouchableOpacity>

                <TouchableOpacity
                    style={[Estilo.actionButton, { marginLeft: 10 }]}
                    onPress={() => handleDelete(item)}
                >
                    <Octicons name="trash" size={20} color="#dc3545" /> 
                </TouchableOpacity>
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

                <Text style={Estilo.headerTitle}>Listagem de Exames</Text>
            </View>

            <FlatList
                data={exames}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={Estilo.content}
                ListEmptyComponent={<Text>Nenhum exame encontrado.</Text>}
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
        backgroundColor: '#fff',
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
    headerTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#212529',
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    exameCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 4,
        borderLeftColor: '#007bff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    exameCardContent: {
        flex: 1,
    },
    exameCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212529',
        marginBottom: 4,
    },
    exameCardSubtitle: {
        fontSize: 13,
        color: '#6c757d',
    },
    exameCardDetails: {
        fontSize: 12,
        color: '#495057',
    },
    actionsContainer: { 
        flexDirection: "row",
        marginLeft: 16, 
    },
    actionButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: "#e9f1ff", 
        justifyContent: "center",
        alignItems: "center",
    },
});