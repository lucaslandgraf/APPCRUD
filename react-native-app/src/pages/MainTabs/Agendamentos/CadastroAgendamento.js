import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function CadastroAgendamento({ navigation }) {
  const [paciente, setPaciente] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSave = () => {
    if (!paciente || !data || !hora) {
      Alert.alert("Erro", "Por favor, preencha os campos obrigatórios.");
      return;
    }

    Alert.alert("Sucesso", "Agendamento cadastrado com sucesso!");
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
        <Feather
          style={Estilo.headerIcon}
          name="calendar"
          size={27}
          color="rgba(36, 128, 249, 0.8)"
        />
        <Text style={Estilo.headerTitle}>Novo Agendamento</Text>
      </View>

      {/* Form */}
      <ScrollView style={Estilo.content} keyboardShouldPersistTaps="handled">
        <Text style={Estilo.label}>Paciente *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Nome do paciente"
          value={paciente}
          onChangeText={setPaciente}
        />

        <Text style={Estilo.label}>Data *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="DD/MM/AAAA"
          value={data}
          onChangeText={setData}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>Hora *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="HH:MM"
          value={hora}
          onChangeText={setHora}
          keyboardType="numeric"
        />

        <Text style={Estilo.label}>Descrição</Text>
        <TextInput
          style={[Estilo.input, Estilo.textArea]}
          placeholder="Informações adicionais"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={Estilo.saveButton} onPress={handleSave}>
          <Text style={Estilo.saveButtonText}>Salvar Agendamento</Text>
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
