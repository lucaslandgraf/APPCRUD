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
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { Feather } from "@expo/vector-icons";

export default function CadastroAgendamento({ navigation }) {
  // Alterado de 'paciente' para 'paciente_cpf' para refletir o novo foco
  const [paciente_cpf, setPacienteCpf] = useState(""); 
  const [data, setData] = useState("");
  const [tipoExame, setTipoExame] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para formatar o CPF (opcional, mas melhora a UX)
  const formatCpf = (text) => {
    // Remove tudo que não é dígito
    let cpf = text.replace(/\D/g, '');
    // Aplica a máscara
    if (cpf.length > 3) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    }
    if (cpf.length > 7) {
      cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    }
    if (cpf.length > 11) {
      cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    setPacienteCpf(cpf);
  };

  const handleSave = async () => {
    // Remove a máscara para enviar apenas os dígitos
    const cpfLimpo = paciente_cpf.replace(/\D/g, '');

    if (!cpfLimpo || !data || !tipoExame) {
      Alert.alert("Erro", "Por favor, preencha os campos obrigatórios (CPF, Data e Tipo de Exame).");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      // Alterado o nome do campo enviado para 'paciente_cpf'
      await api.post('/agendamentos', {
        paciente_cpf: cpfLimpo, // Envia o CPF limpo
        data_consulta: data, // Alterado para 'data_consulta' para corresponder ao back-end
        tipo_exame: tipoExame, // Alterado para 'tipo_exame' para corresponder ao back-end
        descricao, // Mantido, mas não usado no back-end atual (pode ser adicionado se necessário)
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Sucesso", "Agendamento cadastrado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar agendamento:', error);
      // Tratamento de erro específico para CPF não encontrado (status 404)
      if (error.response && error.response.status === 404) {
        Alert.alert("Erro", "Paciente não encontrado para o CPF informado. Verifique o número.");
      } else {
        Alert.alert("Erro", "Não foi possível cadastrar o agendamento. Tente novamente.");
      }
    } finally {
      setLoading(false);
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
          <Text style={Estilo.backButtonText}>←</Text>
        </TouchableOpacity>
        <Feather
          style={Estilo.headerIcon}
          name="calendar"
          size={27}
          color="rgba(36, 128, 249, 0.8)"
        />
        <Text style={Estilo.headerTitle}>Novo Agendamento</Text>
      </View>

      <ScrollView style={Estilo.content} keyboardShouldPersistTaps="handled">
        <Text style={Estilo.label}>CPF do Paciente *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="000.000.000-00"
          value={paciente_cpf}
          onChangeText={formatCpf} // Usa a função de formatação
          keyboardType="numeric"
          maxLength={14} // Limita o tamanho com a máscara
        />

        <Text style={Estilo.label}>Data da Consulta *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="AAAA-MM-DD" // Sugestão de formato para facilitar o parse no back-end
          value={data}
          onChangeText={setData}
          keyboardType="default" // Alterado para default, pois a data pode ter hífens
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
          disabled={loading}
          style={[Estilo.saveButton, loading && { opacity: 0.6 }]}
          onPress={handleSave}
        >
          <Text style={Estilo.saveButtonText}>
            {loading ? "Salvando..." : "Salvar Agendamento"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (mantidos do arquivo original)
const Estilo = StyleSheet.create({
  container: {
    flex: 1,
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
});