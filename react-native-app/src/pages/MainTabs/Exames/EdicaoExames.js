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

export default function EdicaoExame({ route, navigation }) {
  const { exameId, tipo } = route.params;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [agendamentoId, setAgendamentoId] = useState("");

  const [amostraSangue, setAmostraSangue] = useState("");
  const [dataInicioSintomas, setDataInicioSintomas] = useState("");
  const [amostraDna, setAmostraDna] = useState("");
  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [obsAbo, setObsAbo] = useState("");
  const [tipoTeste, setTipoTeste] = useState("");
  const [statusAmostra, setStatusAmostra] = useState("");
  const [resultado, setResultado] = useState("");
  const [dataInicioSintomasCovid, setDataInicioSintomasCovid] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [obsCovid, setObsCovid] = useState("");
  const [nivelAnticorpos, setNivelAnticorpos] = useState("");

  useEffect(() => {
    async function fetchExame() {
      try {
        const token = await AsyncStorage.getItem('authToken');
        let endpoint = "";
        switch (tipo.toLowerCase()) {
          case "dengue":
            endpoint = `/exames/dengue/${exameId}`; break;
          case "abo":
            endpoint = `/exames/abo/${exameId}`; break;
          case "covid":
            endpoint = `/exames/covid/${exameId}`; break;
          default:
            Alert.alert("Erro", "Tipo de exame inválido");
            navigation.goBack();
            return;
        }
        const response = await api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        const exame = response.data;

        setNome(exame.nome || "");
        setPacienteId(exame.paciente_id.toString());
        setAgendamentoId(exame.agendamento_id.toString());

        if (tipo.toLowerCase() === "dengue") {
          setAmostraSangue(exame.amostra_sangue || "");
          setDataInicioSintomas(exame.data_inicio_sintomas || "");
        } else if (tipo.toLowerCase() === "abo") {
          setAmostraDna(exame.amostra_dna || "");
          setTipoSanguineo(exame.tipo_sanguineo || "");
          setObsAbo(exame.observacoes || "");
        } else if (tipo.toLowerCase() === "covid") {
          setTipoTeste(exame.tipo_teste || "");
          setStatusAmostra(exame.status_amostra || "");
          setResultado(exame.resultado || "");
          setDataInicioSintomasCovid(exame.data_inicio_sintomas || "");
          setSintomas(exame.sintomas || "");
          setObsCovid(exame.observacoes || "");
          setNivelAnticorpos(exame.nivel_anticorpos?.toString() || "");
        }
      } catch (error) {
        console.error("Erro ao carregar exame:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do exame.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }
    fetchExame();
  }, [exameId, tipo]);

  const handleUpdate = async () => {
    if (!nome || !pacienteId || !agendamentoId) {
      Alert.alert("Erro", "Preencha os campos obrigatórios.");
      return;
    }
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("authToken");
      let endpoint = "";
      let payload = {
        nome,
        paciente_id: pacienteId,
        agendamento_id: agendamentoId,
      };

      switch (tipo.toLowerCase()) {
        case "dengue":
          endpoint = `/exames/dengue/${exameId}`;
          payload.amostra_sangue = amostraSangue;
          payload.data_inicio_sintomas = dataInicioSintomas || null;
          break;
        case "abo":
          endpoint = `/exames/abo/${exameId}`;
          payload.amostra_dna = amostraDna;
          payload.tipo_sanguineo = tipoSanguineo;
          payload.observacoes = obsAbo || null;
          break;
        case "covid":
          endpoint = `/exames/covid/${exameId}`;
          payload.tipo_teste = tipoTeste;
          payload.status_amostra = statusAmostra;
          payload.resultado = resultado;
          payload.data_inicio_sintomas = dataInicioSintomasCovid || null;
          payload.sintomas = sintomas || null;
          payload.nivel_anticorpos = nivelAnticorpos || null;
          payload.observacoes = obsCovid || null;
          break;
        default:
          Alert.alert("Erro", "Tipo de exame inválido");
          return;
      }

      await api.put(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Sucesso", "Exame atualizado com sucesso!");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar exame:", error);
      Alert.alert("Erro", "Não foi possível atualizar o exame.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja deletar este exame?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            setSaving(true);
            try {
              const token = await AsyncStorage.getItem("authToken");
              let endpoint = "";
              switch (tipo.toLowerCase()) {
                case "dengue":
                  endpoint = `/exames/dengue/${exameId}`;
                  break;
                case "abo":
                  endpoint = `/exames/abo/${exameId}`;
                  break;
                case "covid":
                  endpoint = `/exames/covid/${exameId}`;
                  break;
                default:
                  Alert.alert("Erro", "Tipo de exame inválido");
                  return;
              }
              await api.delete(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert("Sucesso", "Exame deletado com sucesso!");
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao deletar exame:", error);
              Alert.alert("Erro", "Não foi possível deletar o exame.");
            } finally {
              setSaving(false);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  if (loading) {
    return (
      <View style={Estilo.loadingContainer}>
        <ActivityIndicator size="large" color="#2480f9" />
        <Text>Carregando Exame...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>←</Text>
        </TouchableOpacity>
        <Feather
          style={Estilo.headerIcon}
          name="edit"
          size={27}
          color="rgba(36, 128, 249, 0.8)"
        />
        <Text style={Estilo.headerTitle}>Editar Exame</Text>
      </View>

      <ScrollView style={Estilo.content} keyboardShouldPersistTaps="handled">
        <Text style={Estilo.label}>Nome do Exame *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Nome do exame"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={Estilo.label}>ID do Paciente *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="ID do paciente"
          value={pacienteId}
          onChangeText={setPacienteId}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>ID do Agendamento *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="ID do agendamento"
          value={agendamentoId}
          onChangeText={setAgendamentoId}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>Tipo do Exame *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Tipo do exame"
          value={tipo}
          editable={false}
        />

        {/* Formulários condicionais por tipo */}
        {tipo.toLowerCase() === "dengue" && (
          <>
            <Text style={Estilo.label}>Amostra de Sangue *</Text>
            <TextInput
              style={Estilo.input}
              value={amostraSangue}
              onChangeText={setAmostraSangue}
              multiline
              placeholder="Detalhes da amostra de sangue"
            />
            <Text style={Estilo.label}>Data Início dos Sintomas</Text>
            <TextInput
              style={Estilo.input}
              value={dataInicioSintomas}
              onChangeText={setDataInicioSintomas}
              placeholder="AAAA-MM-DD"
            />
          </>
        )}

        {tipo.toLowerCase() === "abo" && (
          <>
            <Text style={Estilo.label}>Amostra DNA *</Text>
            <TextInput
              style={Estilo.input}
              value={amostraDna}
              onChangeText={setAmostraDna}
              multiline
              placeholder="Detalhes da amostra de DNA"
            />
            <Text style={Estilo.label}>Tipo Sanguíneo *</Text>
            <TextInput
              style={Estilo.input}
              value={tipoSanguineo}
              onChangeText={setTipoSanguineo}
              placeholder="Ex: A+, O-, etc."
            />
            <Text style={Estilo.label}>Observações</Text>
            <TextInput
              style={[Estilo.input, Estilo.textArea]}
              value={obsAbo}
              onChangeText={setObsAbo}
              multiline
              placeholder="Observações adicionais"
            />
          </>
        )}

        {tipo.toLowerCase() === "covid" && (
          <>
            <Text style={Estilo.label}>Tipo de Teste *</Text>
            <TextInput
              style={Estilo.input}
              value={tipoTeste}
              onChangeText={setTipoTeste}
              placeholder="Ex: PCR, Antígeno"
            />
            <Text style={Estilo.label}>Status da Amostra *</Text>
            <TextInput
              style={Estilo.input}
              value={statusAmostra}
              onChangeText={setStatusAmostra}
              placeholder="Ex: Coletada, Enviada, etc."
            />
            <Text style={Estilo.label}>Resultado *</Text>
            <TextInput
              style={Estilo.input}
              value={resultado}
              onChangeText={setResultado}
              placeholder="Positivo, Negativo, etc."
            />
            <Text style={Estilo.label}>Data Início dos Sintomas</Text>
            <TextInput
              style={Estilo.input}
              value={dataInicioSintomasCovid}
              onChangeText={setDataInicioSintomasCovid}
              placeholder="AAAA-MM-DD"
            />
            <Text style={Estilo.label}>Sintomas</Text>
            <TextInput
              style={[Estilo.input, Estilo.textArea]}
              value={sintomas}
              onChangeText={setSintomas}
              multiline
              placeholder="Liste os sintomas"
            />
            <Text style={Estilo.label}>Nível Anticorpos (BAU/mL)</Text>
            <TextInput
              style={Estilo.input}
              value={nivelAnticorpos}
              onChangeText={setNivelAnticorpos}
              placeholder="Ex: 1500.5"
              keyboardType="numeric"
            />
            <Text style={Estilo.label}>Observações</Text>
            <TextInput
              style={[Estilo.input, Estilo.textArea]}
              value={obsCovid}
              onChangeText={setObsCovid}
              multiline
              placeholder="Observações adicionais"
            />
          </>
        )}

        <TouchableOpacity
          disabled={saving}
          style={[Estilo.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleUpdate}
        >
          <Text style={Estilo.saveButtonText}>{saving ? "Salvando..." : "Atualizar Exame"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={saving}
          style={[Estilo.deleteButton, saving && { opacity: 0.6 }]}
          onPress={handleDelete}
        >
          <Text style={Estilo.deleteButtonText}>Deletar Exame</Text>
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
    justifyContent: "center",
    alignItems: "center",
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
