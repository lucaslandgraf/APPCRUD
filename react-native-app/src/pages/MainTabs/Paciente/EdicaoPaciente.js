import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

export default function EditarPaciente({ navigation, route }) {
  const { paciente } = route.params;

  const [nome, setNome] = useState(paciente.nome);
  const [idade, setIdade] = useState(String(paciente.idade));
  const [cpf, setCpf] = useState(paciente.cpf);

  const handleSave = () => {
    if (!nome.trim() || !idade.trim() || !cpf.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    // Simular salvar dados: aqui pode ser chamada API, contexto, etc.
    console.log('Salvando paciente:', { nome, idade: Number(idade), cpf });
    Alert.alert('Sucesso', 'Paciente atualizado com sucesso!');
    navigation.goBack();
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
          <Text style={Estilo.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerIcon}>✏️</Text>
        <Text style={Estilo.headerTitle}>Editar Paciente</Text>
      </View>

      {/* Content */}
      <View style={Estilo.content}>
        <Text style={Estilo.label}>Nome:</Text>
        <TextInput
          style={Estilo.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome do paciente"
          autoCapitalize="words"
        />

        <Text style={Estilo.label}>Idade:</Text>
        <TextInput
          style={Estilo.input}
          value={idade}
          onChangeText={setIdade}
          placeholder="Digite a idade"
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>CPF:</Text>
        <TextInput
          style={Estilo.input}
          value={cpf}
          onChangeText={setCpf}
          placeholder="Digite o CPF"
          keyboardType="numeric"
        />

        <TouchableOpacity style={Estilo.saveButton} onPress={handleSave}>
          <Text style={Estilo.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header Styles
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
  headerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
  },

  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ced4da',
    color: '#212529',
  },

  saveButton: {
    backgroundColor: '#28a745',
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
