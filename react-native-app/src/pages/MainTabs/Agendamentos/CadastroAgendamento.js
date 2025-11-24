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
  const [paciente_cpf, setPacienteCpf] = useState("");
  const [data, setData] = useState("");
  const [tipoExame, setTipoExame] = useState("");
  const [observacoes, setObservacoes] = useState(""); 
  const [loading, setLoading] = useState(false);

  const [exameDropdownOpen, setExameDropdownOpen] = useState(false);
  const exames = [
    { id: 1, nome: 'dengue' },
    { id: 2, nome: 'covid' },
    { id: 3, nome: 'abo' }
  ];

  const formatCpf = (text) => {
    let cpf = text.replace(/\D/g, '');
    if (cpf.length > 3) cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    if (cpf.length > 7) cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    if (cpf.length > 11) cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setPacienteCpf(cpf);
  };

  const formatDataVisual = (text) => {
    let textoLimpo = text.replace(/\D/g, '');
    if (textoLimpo.length > 2) textoLimpo = textoLimpo.replace(/^(\d{2})(\d)/, '$1/$2');
    if (textoLimpo.length > 5) textoLimpo = textoLimpo.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setData(textoLimpo);
  };

  const converterDataParaBanco = (dataBrasileira) => {
    if (!dataBrasileira || dataBrasileira.length !== 10) return null;
    const parts = dataBrasileira.split('/');
    if (parts.length !== 3) return null;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const handleSave = async () => {
    const cpfLimpo = paciente_cpf.replace(/\D/g, '');
    const dataFormatadaSQL = converterDataParaBanco(data);

    if (!cpfLimpo || !dataFormatadaSQL || !tipoExame) {
      Alert.alert("Erro", "Preencha CPF, Data e Tipo de Exame.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      await api.post('/agendamentos', {
        paciente_cpf: cpfLimpo,
        data_consulta: dataFormatadaSQL,
        tipo_exame: tipoExame,
        observacoes: observacoes, 
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Sucesso", "Agendamento cadastrado!");
      navigation.goBack();
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert("Erro", "Não foi possível cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>←</Text>
        </TouchableOpacity>
        <Feather style={Estilo.headerIcon} name="calendar" size={27} color="rgba(36, 128, 249, 0.8)" />
        <Text style={Estilo.headerTitle}>Novo Agendamento</Text>
      </View>

      <ScrollView style={Estilo.content} keyboardShouldPersistTaps="handled">
        <Text style={Estilo.label}>CPF do Paciente *</Text>
        <TextInput
          style={Estilo.input}
          placeholder="000.000.000-00"
          value={paciente_cpf}
          onChangeText={formatCpf}
          keyboardType="numeric"
          maxLength={14}
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
        <TouchableOpacity
          style={Estilo.dropdownHeader}
          onPress={() => setExameDropdownOpen(!exameDropdownOpen)}
        >
          <Text style={Estilo.dropdownHeaderText}>
            {tipoExame ? tipoExame.toUpperCase() : "Selecione um exame..."}
          </Text>
          <Feather name={exameDropdownOpen ? 'chevron-up' : 'chevron-down'} size={20} />
        </TouchableOpacity>

        {exameDropdownOpen && (
          <View style={Estilo.dropdownList}>
            {exames.map((exame) => (
              <TouchableOpacity
                key={exame.id}
                style={[Estilo.dropdownItem, tipoExame === exame.nome && Estilo.dropdownItemSelected]}
                onPress={() => {
                  setTipoExame(exame.nome);
                  setExameDropdownOpen(false);
                }}
              >
                <Text style={[Estilo.dropdownItemText, tipoExame === exame.nome && Estilo.dropdownItemTextSelected]}>
                  {exame.nome.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={Estilo.label}>Observações (Opcional)</Text>
        <TextInput
          style={[Estilo.input, Estilo.textArea]}
          placeholder="Informações adicionais"
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
            {loading ? "Salvando..." : "Salvar Agendamento"}
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
  dropdownHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#ced4da', 
    borderRadius: 8, 
    backgroundColor: '#ffffff', 
    marginBottom: 8 
  },
  dropdownHeaderText: { 
    fontSize: 16, 
    color: '#212529' 
  },
  dropdownList: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#ced4da', 
    borderRadius: 8, 
    marginBottom: 16 
  },
  dropdownItem: { 
    padding: 12 
  },
  dropdownItemSelected: { 
    backgroundColor: '#2480f9' 
  },
  dropdownItemText: { 
    fontSize: 16, 
    color: '#212529' 
  },
  dropdownItemTextSelected: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});