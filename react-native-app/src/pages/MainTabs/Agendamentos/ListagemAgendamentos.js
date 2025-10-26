import React, { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SafeAreaProvider,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { Octicons, Feather } from "@expo/vector-icons";

const fakeAgendamentos = [
  {
    id: "1",
    paciente: "João Silva",
    data: "20/10/2025",
    hora: "14:00",
    descricao: "Consulta geral",
  },
  {
    id: "2",
    paciente: "Maria Oliveira",
    data: "21/10/2025",
    hora: "09:30",
    descricao: "Retorno",
  },
  {
    id: "3",
    paciente: "Carlos Souza",
    data: "22/10/2025",
    hora: "16:15",
    descricao: "Exame",
  },
];

export default function ListagemAgendamentos({ navigation }) {
  const [agendamentos, setAgendamentos] = useState(fakeAgendamentos);

  const handleEdit = (id) => {
    navigation.navigate("EditarAgendamento", { agendamentoId: id });
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setAgendamentos((prev) => prev.filter((item) => item.id !== id));
            Alert.alert("Sucesso", "Agendamento excluído.");
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.paciente}>{item.paciente}</Text>
        <Text style={styles.dataHora}>
          {item.data} às {item.hora}
        </Text>
        {item.descricao ? (
          <Text style={styles.descricao}>{item.descricao}</Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item.id)}
        >
          <Octicons name="pencil" size={22} color="#2480f9" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { marginLeft: 10 }]}
          onPress={() => handleDelete(item.id)}
        >
          <Octicons name="trash" size={22} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Feather
          name="calendar"
          size={27}
          color="rgba(36, 128, 249, 0.8)"
          style={styles.icon}
        />
        <Text style={styles.headerTitle}>Agendamentos</Text>
      </View>

      <FlatList
        data={agendamentos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: { marginRight: 10 },
  backButtonText: { fontSize: 16, color: "#4285f4" },
  icon: { marginRight: 12 },
  headerTitle: { fontSize: 24, fontWeight: "600", color: "#212529" },
  list: { paddingHorizontal: 20, paddingVertical: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#2480f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  info: { flex: 1 },
  paciente: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  dataHora: { fontSize: 14, color: "#6c757d" },
  descricao: { fontSize: 14, color: "#6c757d", marginTop: 4 },
  actions: { flexDirection: "row" },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#e9f1ff",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#6c757d",
  },
});
