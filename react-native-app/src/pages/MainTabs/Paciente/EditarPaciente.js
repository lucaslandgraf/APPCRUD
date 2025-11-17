import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { Feather } from "@expo/vector-icons";

export default function EdicaoPaciente({ route, navigation }) {
  const { pacienteId } = route.params; // Recebe o ID do paciente

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await api.get(`/pacientes/${pacienteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const paciente = response.data;
        console.log(response.data);

        setNome(paciente.nome);
        setDataNascimento(paciente.data_nascimento);
        setEndereco(paciente.endereco);
        setTelefone(paciente.telefone);
        setCpf(paciente.cpf);
        setObservacoes(paciente.observacoes || "");
      } catch (error) {
        console.error('Erro ao carregar paciente:', error);
        Alert.alert("Erro", "Não foi possível carregar os dados do paciente.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [pacienteId, navigation]);

  const handleUpdate = async () => {
    if (!nome || !dataNascimento || !cpf) {
      Alert.alert("Erro", "Por favor, preencha os campos obrigatórios (Nome, Data de Nascimento e CPF).");
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      await api.put(`/pacientes/${pacienteId}`, {
        nome,
        data_nascimento: dataNascimento,
        endereco,
        telefone,
        cpf,
        observacoes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Sucesso", "Paciente atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      Alert.alert("Erro", "Não foi possível atualizar o paciente.");
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={Estilo.loadingContainer}>
        <ActivityIndicator size="large" color="#2480f9" />
        <Text>Carregando Paciente...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>←</Text>
        </TouchableOpacity>
        <Feather
          style={Estilo.headerIcon}
          name="edit"
          size={27}
          color="rgba(36, 128, 249, 0.8)"
        />
        <Text style={Estilo.headerTitle}>Editar Paciente</Text>
      </View>

      <ScrollView style={Estilo.content} keyboardShouldPersistTaps="handled">
        <Text style={Estilo.label}>Nome *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={Estilo.label}>Data de Nascimento *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="AAAA-MM-DD"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          keyboardType="default"
        />

        <Text style={Estilo.label}>Endereço</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Endereço completo"
          value={endereco}
          onChangeText={setEndereco}
        />

        <Text style={Estilo.label}>Telefone</Text>
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
          style={[Estilo.input, Estilo.textArea]}
          placeholder="Observações adicionais"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          disabled={saving}
          style={[Estilo.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleUpdate}
        >
          <Text style={Estilo.saveButtonText}>
            {saving ? "Salvando..." : "Atualizar Paciente"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#4285f4",
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#212529",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    color: "#212529",
    marginBottom: 8,
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
    color: "#495057",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#2480f9",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 15,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});
