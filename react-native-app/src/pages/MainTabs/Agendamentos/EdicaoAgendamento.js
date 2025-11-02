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

export default function EdicaoAgendamento({ route, navigation }) {
  const { agendamentoId } = route.params; // Recebe o ID do agendamento
  
  const [pacienteId, setPacienteId] = useState(""); // Mantemos o ID do paciente para a atualização
  const [data, setData] = useState("");
  const [tipoExame, setTipoExame] = useState("");
  const [descricao, setDescricao] = useState(""); // Assumindo que a descrição é um campo que pode ser atualizado
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await api.get(`/agendamentos/${agendamentoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const agendamento = response.data;
        
        // Preenche os estados com os dados do agendamento
        setPacienteId(agendamento.paciente_id.toString()); // O back-end retorna paciente_id
        setData(agendamento.data_consulta); // Assumindo que o campo é data_consulta
        setTipoExame(agendamento.tipo_exame); // Assumindo que o campo é tipo_exame
        // Se houver um campo 'descricao' no seu banco de dados, adicione-o aqui
        // setDescricao(agendamento.descricao || ""); 

      } catch (error) {
        console.error('Erro ao carregar agendamento:', error);
        Alert.alert("Erro", "Não foi possível carregar os dados do agendamento.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamento();
  }, [agendamentoId, navigation]);

  const handleUpdate = async () => {
    if (!pacienteId || !data || !tipoExame) {
      Alert.alert("Erro", "Por favor, preencha os campos obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      await api.put(`/agendamentos/${agendamentoId}`, {
        paciente_id: pacienteId, // O back-end de atualização espera paciente_id
        data_consulta: data,
        tipo_exame: tipoExame,
        // Inclua a descrição se for um campo no seu banco de dados
        // descricao: descricao, 
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Sucesso", "Agendamento atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      Alert.alert("Erro", "Não foi possível atualizar o agendamento.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja deletar este agendamento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Deletar",
          onPress: async () => {
            setSaving(true);
            try {
              const token = await AsyncStorage.getItem('authToken');
              await api.delete(`/agendamentos/${agendamentoId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert("Sucesso", "Agendamento deletado com sucesso!");
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao deletar agendamento:', error);
              Alert.alert("Erro", "Não foi possível deletar o agendamento.");
            } finally {
              setSaving(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={Estilo.loadingContainer}>
        <ActivityIndicator size="large" color="#2480f9" />
        <Text>Carregando Agendamento...</Text>
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
        <Text style={Estilo.headerTitle}>Editar Agendamento</Text>
      </View>

      <ScrollView style={Estilo.content} keyboardShouldPersistTaps="handled">
        <Text style={Estilo.label}>ID do Paciente *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="ID do Paciente"
          value={pacienteId}
          onChangeText={setPacienteId}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>Data da Consulta *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="AAAA-MM-DD"
          value={data}
          onChangeText={setData}
          keyboardType="default"
        />

        <Text style={Estilo.label}>Tipo de Exame *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Ex: Hemograma, Raio-X"
          value={tipoExame}
          onChangeText={setTipoExame}
        />

        <Text style={Estilo.label}>Descrição (Opcional)</Text>
        <TextInput
          style={[Estilo.input, Estilo.textArea]}
          placeholder="Informações adicionais sobre o agendamento"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          disabled={saving}
          style={[Estilo.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleUpdate}
        >
          <Text style={Estilo.saveButtonText}>
            {saving ? "Salvando..." : "Atualizar Agendamento"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={saving}
          style={[Estilo.deleteButton, saving && { opacity: 0.6 }]}
          onPress={handleDelete}
        >
          <Text style={Estilo.deleteButtonText}>
            Deletar Agendamento
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
    backgroundColor: "#dc3545", // Cor vermelha para deletar
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