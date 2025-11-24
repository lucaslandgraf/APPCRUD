import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; 

import api from '../../../services/api'; 

export default function CadastroAlunos({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('DEFAULT'); // Valor inicial
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => { navigation.goBack(); };

  const handleSave = async () => {
    // Validações
    if (!nome || !email || !tipoUsuario || !senha || !confirmarSenha) { Alert.alert('Erro', 'Preencha todos os campos.'); return; }
    if (senha !== confirmarSenha) { Alert.alert('Erro', 'As senhas não coincidem.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { Alert.alert('Erro', 'Formato de e-mail inválido.'); return; }

    setIsLoading(true);
    const novoAluno = { nome, email, senha, rol: tipoUsuario };

    try {
        const response = await api.post('/alunos', novoAluno);
        const data = response.data;

        Alert.alert('Sucesso', data.status || 'Aluno cadastrado com sucesso!');
        setNome(''); setEmail(''); setTipoUsuario('DEFAULT'); setSenha(''); setConfirmarSenha('');
        navigation.goBack();

    } catch (error) {
        // Tratamento de erro do Axios
        let errorMessage = error.message;
        if (error.response && error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
        }
        Alert.alert('Erro de Cadastro', errorMessage);
    } finally { 
        setIsLoading(false); 
    }
  };

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Cadastro de Aluno</Text>
      </View>

      <ScrollView style={Estilo.content}>
        {/* Campos Nome e E-mail */}
        <Text style={Estilo.label}>Nome</Text>
        <TextInput style={Estilo.input} placeholder="Nome completo" value={nome} onChangeText={setNome} autoCapitalize="words" />
        <Text style={Estilo.label}>E-mail</Text>
        <TextInput style={Estilo.input} placeholder="exemplo@dominio.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        {/* Picker para Tipo de Usuário */}
        <Text style={Estilo.label}>Tipo de Usuário (Rol)</Text>
        <View style={Estilo.pickerContainer}>
          <Picker
            selectedValue={tipoUsuario}
            onValueChange={(itemValue) => setTipoUsuario(itemValue)}
            style={Estilo.picker}
            mode="dropdown"
          >
            <Picker.Item label="Usuário Padrão" value="DEFAULT" />
            <Picker.Item label="Administrador" value="ADM" />
          </Picker>
        </View>

        {/* Campos Senha e Confirmar Senha */}
        <Text style={Estilo.label}>Senha</Text>
        <TextInput style={Estilo.input} placeholder="Digite a senha" value={senha} onChangeText={setSenha} secureTextEntry />
        <Text style={Estilo.label}>Confirmar Senha</Text>
        <TextInput style={Estilo.input} placeholder="Confirme a senha" value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[Estilo.saveButton, isLoading && Estilo.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={Estilo.saveButtonText}>
            {isLoading ? 'Salvando...' : 'Salvar Aluno'}
          </Text>
        </TouchableOpacity>
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