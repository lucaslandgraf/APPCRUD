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
  Platform, 
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { Feather } from "@expo/vector-icons";

export default function EdicaoAgendamento({ route, navigation }) {
  const { agendamentoId } = route.params;
  
  const [pacienteId, setPacienteId] = useState("");
  const [data, setData] = useState(""); 
  const [tipoExame, setTipoExame] = useState("");
  const [observacoes, setObservacoes] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const formatDataVisual = (text) => {
    let t = text.replace(/\D/g, '');
    if (t.length > 2) t = t.replace(/^(\d{2})(\d)/, '$1/$2');
    if (t.length > 5) t = t.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setData(t);
  };

  const converterDataParaBanco = (dataBrasileira) => {
    if (!dataBrasileira || dataBrasileira.length !== 10) return null;
    const parts = dataBrasileira.split('/');
    if (parts.length !== 3) return null;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const converterDataDoBancoParaVisual = (dataSQL) => {
    if (!dataSQL) return "";
    let d = String(dataSQL).substring(0, 10);
    const parts = d.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return d;
  };

  useEffect(() => {
    const fetchAgendamento = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await api.get(`/agendamentos/${agendamentoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const agendamento = response.data;
        
        setPacienteId(agendamento.paciente_id.toString());
        setData(converterDataDoBancoParaVisual(agendamento.data_consulta)); 
        setTipoExame(agendamento.tipo_exame);
        setObservacoes(agendamento.observacoes || "");

      } catch (error) {
        console.error('Erro ao carregar agendamento:', error);
        Alert.alert("Erro", "Não foi possível carregar os dados.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamento();
  }, [agendamentoId, navigation]);

  const handleUpdate = async () => {
    const dataFormatadaSQL = converterDataParaBanco(data);

    if (!pacienteId || !dataFormatadaSQL || !tipoExame) {
      Alert.alert("Erro", "Preencha os campos obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      await api.put(`/agendamentos/${agendamentoId}`, {
        paciente_id: pacienteId,
        data_consulta: dataFormatadaSQL,
        tipo_exame: tipoExame,
        observacoes: observacoes,
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
    const performDelete = async () => {
        setSaving(true);
        try {
          const token = await AsyncStorage.getItem('authToken');
          await api.delete(`/agendamentos/${agendamentoId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (Platform.OS === 'web') {
              alert("Sucesso: Agendamento deletado!");
          } else {
              Alert.alert("Sucesso", "Agendamento deletado!");
          }
          
          navigation.goBack();
        } catch (error) {
          console.error('Erro ao deletar:', error);
          Alert.alert("Erro", "Não foi possível deletar.");
        } finally {
          setSaving(false);
        }
    };

    if (Platform.OS === 'web') {
        if (window.confirm("Tem certeza que deseja deletar este agendamento?")) {
            performDelete();
        }
    } else {
        Alert.alert(
          "Confirmação",
          "Tem certeza que deseja deletar este agendamento?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Deletar",
              onPress: performDelete,
              style: "destructive",
            },
          ],
          { cancelable: false }
        );
    }
  };

  const handleGoBack = () => navigation.goBack();

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
        <Feather style={Estilo.headerIcon} name="edit" size={27} color="rgba(36, 128, 249, 0.8)" />
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
          placeholder="DD/MM/AAAA"
          value={data}
          onChangeText={formatDataVisual}
          keyboardType="numeric"
          maxLength={10}
        />

        <Text style={Estilo.label}>Tipo de Exame *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Ex: Hemograma, Raio-X"
          value={tipoExame}
          onChangeText={setTipoExame}
        />

        <Text style={Estilo.label}>Observações</Text>
        <TextInput
          style={[Estilo.input, Estilo.textArea]}
          placeholder="Informações adicionais sobre o agendamento"
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
    backgroundColor: "#f8f9fa" 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
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
  deleteButton: { 
    backgroundColor: "#dc3545", 
    borderRadius: 12, 
    paddingVertical: 15, 
    alignItems: "center", 
    marginTop: 15 
  },
  deleteButtonText: { 
    color: "#ffffff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
});