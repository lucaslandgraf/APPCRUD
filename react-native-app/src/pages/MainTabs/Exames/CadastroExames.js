import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SafeAreaProvider,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

export default function CadastroExames({ navigation }) {
  const [tipoExame, setTipoExame] = useState('');
  const [agendamentoId, setAgendamentoId] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [nomeExame, setNomeExame] = useState('');

  const handleSave = async () => {
    if (!tipoExame || !agendamentoId || !pacienteId || !nomeExame) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const exame = {
      acao: 'cadastrar',
      tipo_exame: tipoExame,
      agendamento_id: agendamentoId,
      paciente_id: pacienteId,
      nome_exame: nomeExame,
    };

    try {
      const response = await fetch('exames/controller/ExamesController.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exame),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar exame');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      Alert.alert('Sucesso', 'Exame cadastrado com sucesso!');
      setTipoExame('');
      setAgendamentoId('');
      setPacienteId('');
      setNomeExame('');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Cadastro de Exame</Text>
      </View>

      <ScrollView style={Estilo.content}>
        <Text style={Estilo.label}>Tipo do Exame</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Ex: dengue, abo, covid"
          value={tipoExame}
          onChangeText={setTipoExame}
          autoCapitalize="none"
        />

        <Text style={Estilo.label}>ID do Agendamento</Text>
        <TextInput
          style={Estilo.input}
          placeholder="ID do agendamento"
          value={agendamentoId}
          onChangeText={setAgendamentoId}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>ID do Paciente</Text>
        <TextInput
          style={Estilo.input}
          placeholder="ID do paciente"
          value={pacienteId}
          onChangeText={setPacienteId}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>Nome do Exame</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Ex: Hemograma Completo"
          value={nomeExame}
          onChangeText={setNomeExame}
        />

        <TouchableOpacity style={Estilo.saveButton} onPress={handleSave}>
          <Text style={Estilo.saveButtonText}>Salvar Exame</Text>
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
    backgroundColor: '#28a745',
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
