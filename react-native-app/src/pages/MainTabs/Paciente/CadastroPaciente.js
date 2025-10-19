import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

export default function CadastroPaciente({ navigation }) {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // **IMPORTANTE**: Substitua esta URL pela URL real do seu backend PHP
  const API_URL = 'http://localhost'; // Exemplo: http://seu-servidor.com

  const handleSave = async () => {
    if (!nome || !dataNascimento || !cpf || !telefone || !email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const paciente = {
      nome,
      dataNascimento,
      cpf,
      telefone,
      email,
    };

    try {
      const response = await fetch(`${API_URL}/cadastrarPaciente.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paciente),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert('Sucesso', result.message || 'Paciente cadastrado com sucesso!');
        // Limpar formulário
        setNome('');
        setDataNascimento('');
        setCpf('');
        setTelefone('');
        setEmail('');
        navigation.goBack(); // Volta para a tela anterior (Pacientes)
      } else {
        Alert.alert('Erro', result.message || 'Erro ao cadastrar paciente.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Verifique sua conexão ou a URL da API.');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Cadastro de Paciente</Text>
      </View>
      
      {/* Content */}
      <ScrollView style={Estilo.content}>
        <Text style={Estilo.label}>Nome Completo</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Digite o nome completo"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={Estilo.label}>Data de Nascimento</Text>
        <TextInput
          style={Estilo.input}
          placeholder="DD/MM/AAAA"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>CPF</Text>
        <TextInput
          style={Estilo.input}
          placeholder="XXX.XXX.XXX-XX"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>Telefone</Text>
        <TextInput
          style={Estilo.input}
          placeholder="(XX) XXXXX-XXXX"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Text style={Estilo.label}>Email</Text>
        <TextInput
          style={Estilo.input}
          placeholder="email@exemplo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={Estilo.saveButton} onPress={handleSave}>
          <Text style={Estilo.saveButtonText}>Salvar Paciente</Text>
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
  saveButton: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});