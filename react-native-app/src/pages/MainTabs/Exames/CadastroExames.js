import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/api";
import { Feather } from "@expo/vector-icons";

export default function CadastroExameDinamico({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosPaciente, setAgendamentosPaciente] = useState([]);

  const [loadingDados, setLoadingDados] = useState(true);

  const [searchPaciente, setSearchPaciente] = useState("");
  const [filteredPacientes, setFilteredPacientes] = useState([]);

  const [pacienteDropdownOpen, setPacienteDropdownOpen] = useState(false);

  const [selectedPacienteId, setSelectedPacienteId] = useState(null);
  const [selectedAgendamentoId, setSelectedAgendamentoId] = useState(null);

  const [tipoExame, setTipoExame] = useState("");
  const [nome, setNome] = useState("");

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDados() {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const [pacientesRes, agendamentosRes] = await Promise.all([
          api.get("/pacientes", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/agendamentos", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setPacientes(pacientesRes.data);
        setFilteredPacientes(pacientesRes.data);
        setAgendamentos(agendamentosRes.data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar pacientes e agendamentos.");
      } finally {
        setLoadingDados(false);
      }
    }
    fetchDados();
  }, []);

  useEffect(() => {
    const filtered = pacientes.filter((p) =>
      p.nome.toLowerCase().includes(searchPaciente.toLowerCase())
    );
    setFilteredPacientes(filtered);
  }, [searchPaciente, pacientes]);

  useEffect(() => {
    if (selectedPacienteId) {
      const filtrados = agendamentos.filter((a) => a.paciente_id === selectedPacienteId);
      setAgendamentosPaciente(filtrados);
      setSelectedAgendamentoId(null);
      setTipoExame("");
      limparCamposEspecificos();
    } else {
      setAgendamentosPaciente([]);
      setSelectedAgendamentoId(null);
      setTipoExame("");
      limparCamposEspecificos();
    }
  }, [selectedPacienteId, agendamentos]);

  useEffect(() => {
    if (selectedAgendamentoId) {
      const agendamento = agendamentosPaciente.find((a) => a.id === selectedAgendamentoId);
      if (agendamento) {
        setTipoExame(agendamento.tipo_exame);
        limparCamposEspecificos();
      } else {
        setTipoExame("");
        limparCamposEspecificos();
      }
    } else {
      setTipoExame("");
      limparCamposEspecificos();
    }
  }, [selectedAgendamentoId, agendamentosPaciente]);

  const limparCamposEspecificos = () => {
    setAmostraSangue("");
    setDataInicioSintomas("");
    setAmostraDna("");
    setTipoSanguineo("");
    setObsAbo("");
    setTipoTeste("");
    setStatusAmostra("");
    setResultado("");
    setDataInicioSintomasCovid("");
    setSintomas("");
    setObsCovid("");
  };

  const handleGoBack = () => navigation.goBack();

  const validarCampos = () => {
  console.log("Validando campos...");
  if (!selectedPacienteId) {
    Alert.alert("Erro", "Selecione um paciente.");
    return console.log("Falhou 1");
  }
  if (!selectedAgendamentoId) {
    Alert.alert("Erro", "Selecione um agendamento.");
    return console.log("Falhou 2");
  }
  if (!tipoExame) {
    Alert.alert("Erro", "Selecione o tipo de exame.");
    return console.log("Falhou 23");
  }
  if (!nome) {
    Alert.alert("Erro", "Informe o nome do exame.");
    return console.log("Falhou 4");
  }
  if (tipoExame === "dengue" && !amostraSangue) {
    Alert.alert("Erro", "Informe a amostra de sangue para dengue.");
    return console.log("Falhou");
  }
  if (tipoExame === "abo" && (!amostraDna || !tipoSanguineo)) {
    Alert.alert("Erro", "Preencha amostra de DNA e tipo sanguíneo para ABO.");
    return console.log("Falhou");
  }
  if (tipoExame === "covid" && (!tipoTeste || !statusAmostra || !resultado)) {
    Alert.alert("Erro", "Preencha tipo de teste, status da amostra e resultado para Covid.");
    return console.log("Falhou");
  }
  return true;
};


  const handleSave = async () => {
  console.log("handleSave iniciado");
  if (!validarCampos()) {
    console.log("Validação falhou");
    return;
  }
  setLoading(true);
  try {
    console.log("Enviando dados para backend", { selectedPacienteId, selectedAgendamentoId, tipoExame, nome });
    const token = await AsyncStorage.getItem("authToken");
    let endpoint = "";
    let payload = {
      agendamento_id: selectedAgendamentoId,
      paciente_id: selectedPacienteId,
      nome,
    };
    switch (tipoExame) {
      case "dengue":
        endpoint = "/exames/dengue";
        payload.amostra_sangue = amostraSangue;
        payload.data_inicio_sintomas = dataInicioSintomas || null;
        break;
      case "abo":
        endpoint = "/exames/abo";
        payload.amostra_dna = amostraDna;
        payload.tipo_sanguineo = tipoSanguineo;
        payload.observacoes = obsAbo || null;
        break;
      case "covid":
        endpoint = "/exames/covid";
        payload.tipo_teste = tipoTeste;
        payload.status_amostra = statusAmostra;
        payload.resultado = resultado;
        payload.data_inicio_sintomas = dataInicioSintomasCovid || null;
        payload.sintomas = sintomas || null;
        payload.nivel_anticorpos = nivelAnticorpos || null;
        payload.observacoes = obsCovid || null;
        break;
      default:
        throw new Error("Tipo de exame inválido");
    }
    console.log("Payload montado:", payload);
    await api.post(endpoint, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Requisição concluída com sucesso");
    Alert.alert("Sucesso", "Exame cadastrado com sucesso!");
    navigation.goBack();
  } catch (error) {
    console.error("Erro ao cadastrar exame:", error.response || error);
    Alert.alert("Erro", "Falha ao cadastrar exame. Tente novamente.");
  } finally {
    setLoading(false);
  }
};


  if (loadingDados) {
    return (
      <SafeAreaView style={Estilo.container}>
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Feather name="arrow-left" size={24} color="#4285f4" />
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Cadastro de Exames</Text>
      </View>

      <ScrollView style={Estilo.content} keyboardShouldPersistTaps="handled">
        {/* Seletor colapsável paciente */}
        <TouchableOpacity
          style={Estilo.collapsibleHeader}
          onPress={() => setPacienteDropdownOpen(!pacienteDropdownOpen)}
        >
          <Text style={Estilo.collapsibleHeaderText}>
            {selectedPacienteId
              ? pacientes.find(p => p.id === selectedPacienteId)?.nome
              : "Selecione o paciente"}
          </Text>
          <Feather name={pacienteDropdownOpen ? "chevron-up" : "chevron-down"} size={20} />
        </TouchableOpacity>

        {pacienteDropdownOpen && (
          <>
            <TextInput
              style={Estilo.input}
              placeholder="Filtrar pacientes pelo nome"
              value={searchPaciente}
              onChangeText={setSearchPaciente}
            />
            <View style={Estilo.dropdownContainer}>
              {filteredPacientes.length === 0 ? (
                <Text style={Estilo.noItemsText}>Nenhum paciente encontrado.</Text>
              ) : (
                filteredPacientes.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      Estilo.dropdownItem,
                      selectedPacienteId === p.id && Estilo.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedPacienteId(p.id);
                      setPacienteDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        Estilo.dropdownText,
                        selectedPacienteId === p.id && Estilo.dropdownTextSelected,
                      ]}
                    >
                      {p.nome}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}

        <Text style={Estilo.label}>Agendamento *</Text>
        <View style={Estilo.dropdownContainer}>
          {agendamentosPaciente.length === 0 ? (
            <Text style={Estilo.noItemsText}>Nenhum agendamento para este paciente</Text>
          ) : (
            agendamentosPaciente.map(a => (
              <TouchableOpacity
                key={a.id}
                style={[
                  Estilo.dropdownItem,
                  selectedAgendamentoId === a.id && Estilo.dropdownItemSelected,
                ]}
                onPress={() => setSelectedAgendamentoId(a.id)}
              >
                <Text
                  style={[
                    Estilo.dropdownText,
                    selectedAgendamentoId === a.id && Estilo.dropdownTextSelected,
                  ]}
                >
                  {a.tipo_exame} - {a.data_consulta}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <Text style={Estilo.label}>Tipo de Exame *</Text>
        <TextInput
          style={Estilo.input}
          value={tipoExame}
          editable={false}
          placeholder="Tipo automaticamente preenchido"
        />

        {tipoExame === "dengue" && (
  <>
    <Text style={Estilo.label}>Nome do Exame *</Text>
    <TextInput
      style={Estilo.input}
      placeholder="Nome do exame"
      value={nome}
      onChangeText={setNome}
      autoCapitalize="words"
      multiline={false}
    />
    <Text style={Estilo.label}>Amostra de Sangue *</Text>
    <TextInput
      style={Estilo.input}
      placeholder="Detalhes da amostra"
      value={amostraSangue}
      onChangeText={setAmostraSangue}
      multiline
    />
    <Text style={Estilo.label}>Data Início dos Sintomas</Text>
    <TextInput
      style={Estilo.input}
      placeholder="AAAA-MM-DD"
      value={dataInicioSintomas}
      onChangeText={setDataInicioSintomas}
    />
  </>
)}

{tipoExame === "abo" && (
  <>
    <Text style={Estilo.label}>Nome do Exame *</Text>
    <TextInput
      style={Estilo.input}
      placeholder="Nome do exame"
      value={nome}
      onChangeText={setNome}
      autoCapitalize="words"
      multiline={false}
    />
    <Text style={Estilo.label}>Amostra DNA *</Text>
    <TextInput
      style={Estilo.input}
      placeholder="Detalhes da amostra de DNA"
      value={amostraDna}
      onChangeText={setAmostraDna}
      multiline
    />
    <Text style={Estilo.label}>Tipo Sanguíneo *</Text>
    <TextInput
      style={Estilo.input}
      placeholder="Ex: A+, O-, etc."
      value={tipoSanguineo}
      onChangeText={setTipoSanguineo}
    />
    <Text style={Estilo.label}>Observações</Text>
    <TextInput
      style={[Estilo.input, Estilo.textArea]}
      placeholder="Observações adicionais"
      value={obsAbo}
      onChangeText={setObsAbo}
      multiline
      numberOfLines={4}
    />
  </>
)}

{tipoExame === "covid" && (
  <>
    <Text style={Estilo.label}>Nome do Exame *</Text>
    <TextInput
      style={Estilo.input}
      placeholder="Nome do exame"
      value={nome}
      onChangeText={setNome}
      autoCapitalize="words"
      multiline={false}
    />
    <Text style={Estilo.label}>Tipo de Teste *</Text>
    <TextInput
      style={Estilo.input}
      placeholder="Ex: PCR, Antígeno"
      value={tipoTeste}
      onChangeText={setTipoTeste}
    />
    <Text style={Estilo.label}>Status da Amostra *</Text>
    <TextInput
      style={Estilo.input}
      placeholder="Ex: Coletada, Enviada, etc."
      value={statusAmostra}
      onChangeText={setStatusAmostra}
    />
    <Text style={Estilo.label}>Resultado *</Text>
    <TextInput
      style={Estilo.input}
      placeholder="Positivo, Negativo, etc."
      value={resultado}
      onChangeText={setResultado}
    />
    <Text style={Estilo.label}>Data Início dos Sintomas</Text>
    <TextInput
      style={Estilo.input}
      placeholder="AAAA-MM-DD"
      value={dataInicioSintomasCovid}
      onChangeText={setDataInicioSintomasCovid}
    />
    <Text style={Estilo.label}>Sintomas</Text>
    <TextInput
      style={[Estilo.input, Estilo.textArea]}
      placeholder="Liste os sintomas"
      value={sintomas}
      onChangeText={setSintomas}
      multiline
      numberOfLines={4}
    />
    <Text style={Estilo.label}>Nível Anticorpos (BAU/mL)</Text>
    <TextInput
        style={Estilo.input} 
        placeholder="Ex: 1500.5" 
        value={nivelAnticorpos}
        onChangeText={setNivelAnticorpos}
        keyboardType="numeric"
    />
    <Text style={Estilo.label}>Observações</Text>
    <TextInput
      style={[Estilo.input, Estilo.textArea]}
      placeholder="Observações adicionais"
      value={obsCovid}
      onChangeText={setObsCovid}
      multiline
      numberOfLines={4}
    />
  </>
)}


        <TouchableOpacity
          style={[Estilo.saveButton, loading && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={Estilo.saveButtonText}>{loading ? "Salvando..." : "Salvar Exame"}</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#212529",
  },
  content: {
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
  dropdownContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ced4da",
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemSelected: {
    backgroundColor: "#2480f9",
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownTextSelected: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  noItemsText: {
    padding: 10,
    color: "#868e96",
    fontStyle: "italic",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  collapsibleHeaderText: {
    fontSize: 16,
    color: "#212529",
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
