import React, { useState } from "react";
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
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { Feather } from "@expo/vector-icons";

export default function CadastroPacientes({ navigation }) {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState(''); 
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);

  const formatCpf = (text) => {
    let cpf = text.replace(/\D/g, '');
    if (cpf.length > 3) cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    if (cpf.length > 7) cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    if (cpf.length > 11) cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(cpf);
  };

  const formatDataVisual = (text) => {
    let textoLimpo = text.replace(/\D/g, '');
    if (textoLimpo.length > 2) textoLimpo = textoLimpo.replace(/^(\d{2})(\d)/, '$1/$2');
    if (textoLimpo.length > 5) textoLimpo = textoLimpo.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDataNascimento(textoLimpo);
  };

  const converterDataParaBanco = (dataBrasileira) => {
    if (!dataBrasileira || dataBrasileira.length !== 10) return null;
    const parts = dataBrasileira.split('/');
    if (parts.length !== 3) return null;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    // Converte data para salvar no MySQL
    const dataNascimentoSQL = converterDataParaBanco(dataNascimento);

    if (!nome || !dataNascimentoSQL || !endereco || !telefone || !cpfLimpo) {
      Alert.alert('Erro', 'Preencha todos os campos e verifique a data (DD/MM/AAAA).');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');

      await api.post('/pacientes', {
        nome,
        data_nascimento: dataNascimentoSQL, // Envia AAAA-MM-DD
        endereco,
        telefone,
        cpf: cpfLimpo,
        observacoes: observacoes || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Sucesso', 'Paciente cadastrado com sucesso!');
      
      // Limpa formulário
      setNome('');
      setDataNascimento('');
      setEndereco('');
      setTelefone('');
      setCpf('');
      setObservacoes('');
      
      navigation.goBack();

    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o paciente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>←</Text>
        </TouchableOpacity>
        <Feather style={Estilo.headerIcon} name="user-plus" size={27} color="rgba(36, 128, 249, 0.8)" />
        <Text style={Estilo.headerTitle}>Cadastro de Paciente</Text>
      </View>

      <ScrollView style={Estilo.content} keyboardShouldPersistTaps="handled">
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
          placeholder="DD/MM/AAAA" 
          value={dataNascimento}
          onChangeText={formatDataVisual} 
          keyboardType="numeric"
          maxLength={10}
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
          onChangeText={formatCpf}
          keyboardType="numeric"
          maxLength={14}
        />

        <Text style={Estilo.label}>Observações</Text>
        <TextInput
          style={[Estilo.input, Estilo.textArea]}
          placeholder="Observações adicionais"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          disabled={loading}
          style={[Estilo.saveButton, loading && { opacity: 0.6 }]}
          onPress={handleSave}
        >
          <Text style={Estilo.saveButtonText}>
            {loading ? "Salvando..." : "Salvar Paciente"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Estilo = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  header: { 
    backgroundColor: "#ffffff", 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingVertical: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: "#e9ecef" 
  },
  backButton: { 
    marginRight: 10 
  },
  backButtonText: { 
    fontSize: 16, 
    color: "#4285f4" 
  },
  headerIcon: { 
    marginRight: 12 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: "600", 
    color: "#212529" 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingVertical: 20 
  },
  label: { 
    fontSize: 16, 
    color: "#212529", 
    marginBottom: 8 
  },
  input: { 
    backgroundColor: "#ffffff", 
    borderWidth: 1, 
    borderColor: "#ced4da", 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    marginBottom: 16, 
    fontSize: 16, 
    color: "#495057" 
  },
  textArea: { 
    height: 100, 
    textAlignVertical: "top" 
  },
  saveButton: { 
    backgroundColor: "#2480f9", 
    borderRadius: 12, 
    paddingVertical: 15, 
    alignItems: "center", 
    marginTop: 10 
  },
  saveButtonText: { 
    color: "#ffffff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
});