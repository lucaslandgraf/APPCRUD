import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

const API_URL = 'http://192.168.X.X:3000'; // Ajuste para seu backend

export default function EditarPaciente({ navigation, route }) {
  const paciente = route.params?.paciente;

  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paciente) {
      setNome(paciente.nome || '');
      setDataNascimento(paciente.data_nascimento || '');
      setEndereco(paciente.endereco || '');
      setTelefone(paciente.telefone || '');
      setCpf(paciente.CPF || '');
      setObservacoes(paciente.observacoes || '');
    }
  }, [paciente]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!nome || !dataNascimento || !endereco || !telefone || !cpf) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);

    const pacienteData = {
      nome,
      data_nascimento: dataNascimento,
      endereco,
      telefone,
      CPF: cpf,
      observacoes: observacoes || null,
    };

    try {
      const response = await fetch(`${API_URL}/pacientes/${paciente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pacienteData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar paciente.');
      }

      Alert.alert('Sucesso', 'Paciente atualizado!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>{'<-'} Voltar</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Editar Paciente</Text>
      </View>

      <ScrollView style={Estilo.content}>
        <Text style={Estilo.label}>Nome *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        <Text style={Estilo.label}>Data de Nascimento *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="AAAA-MM-DD"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>Endereço *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Endereço completo"
          value={endereco}
          onChangeText={setEndereco}
          autoCapitalize="words"
        />

        <Text style={Estilo.label}>Telefone *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="(XX) XXXXX-XXXX"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Text style={Estilo.label}>CPF *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="000.000.000-00"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>Observações</Text>
        <TextInput
          style={[Estilo.input, { height: 80, textAlignVertical: 'top' }]}
          placeholder="Observações adicionais"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[Estilo.saveButton, isLoading && Estilo.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={Estilo.saveButtonText}>
            {isLoading ? 'Salvando...' : 'Atualizar Paciente'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Estilo = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
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
  headerTitle: { fontSize: 24, fontWeight: '600', color: '#212529' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
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
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonDisabled: { backgroundColor: '#a3d9a5' },
  saveButtonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
});
