import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.15.7:3000';

export default function EditarAluno({ navigation, route }) {
    const alunoParaEditar = route.params?.aluno;

    // Estados pré-preenchidos com os dados do aluno
    const [nome, setNome] = useState(alunoParaEditar?.nome || '');
    const [email, setEmail] = useState(alunoParaEditar?.email || '');
    const [tipoUsuario, setTipoUsuario] = useState(alunoParaEditar?.rol || 'DEFAULT');
    const [isLoading, setIsLoading] = useState(false);

    // Se não recebeu dados do aluno, volta pra trás
    useEffect(() => {
        if (!alunoParaEditar) {
            Alert.alert('Erro', 'Dados do aluno não encontrados.');
            navigation.goBack();
        }
    }, [alunoParaEditar, navigation]);

    const handleGoBack = () => { navigation.goBack(); };

    const handleUpdate = async () => {
        if (!nome || !email || !tipoUsuario || !alunoParaEditar?.id) {
            Alert.alert('Erro', 'Dados incompletos.'); return;
        }

        setIsLoading(true);
        const dadosAtualizados = { nome, email, rol: tipoUsuario };

        try {
            const response = await fetch(`${API_URL}/alunos/${alunoParaEditar.id}`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados),
            });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error || 'Erro ao atualizar aluno'); }

            Alert.alert('Sucesso', 'Aluno atualizado com sucesso!');
            navigation.goBack();

        } catch (error) { Alert.alert('Erro ao Atualizar', error.message); }
        finally { setIsLoading(false); }
    };

    if (!alunoParaEditar) return null; 

    return (
        <SafeAreaView style={EstiloEdicao.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            {/* Header */}
            <View style={EstiloEdicao.header}>
                <TouchableOpacity onPress={handleGoBack} style={EstiloEdicao.backButton}>
                    <Text style={EstiloEdicao.backButtonText}>← Voltar</Text>
                </TouchableOpacity>
                <Text style={EstiloEdicao.headerTitle}>Editar Aluno</Text>
            </View>

            <ScrollView style={EstiloEdicao.content}>
                {/* Campos pré-preenchidos */}
                <Text style={EstiloEdicao.label}>Nome</Text>
                <TextInput style={EstiloEdicao.input} value={nome} onChangeText={setNome} autoCapitalize="words" />
                <Text style={EstiloEdicao.label}>E-mail</Text>
                <TextInput style={EstiloEdicao.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                <Text style={EstiloEdicao.label}>Tipo (Rol)</Text>
                <View style={EstiloEdicao.pickerContainer}>
                    <Picker selectedValue={tipoUsuario} onValueChange={(v) => setTipoUsuario(v)} style={EstiloEdicao.picker} mode="dropdown">
                        <Picker.Item label="Usuário Padrão" value="DEFAULT" />
                        <Picker.Item label="Administrador" value="ADM" />
                    </Picker>
                </View>

                <TouchableOpacity style={[EstiloEdicao.saveButton, isLoading && EstiloEdicao.saveButtonDisabled]} onPress={handleUpdate} disabled={isLoading}>
                    <Text style={EstiloEdicao.saveButtonText}>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const EstiloEdicao = StyleSheet.create({
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212529',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
  },
  picker: {
    height: '100%',
    width: '100%',
    color: '#212529',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#a3d9a5'
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
