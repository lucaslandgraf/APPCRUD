import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';

const dadosFicticios = [
  { id: 1, nome: 'Hemograma Completo', tipoExame: 'Sangue', pacienteNome: 'Maria Silva', dataConsulta: '2025-10-10' },
  { id: 2, nome: 'Covid', tipoExame: 'Covid-19', pacienteNome: 'João Souza', dataConsulta: '2025-10-12' },
  { id: 3, nome: 'Dengue', tipoExame: 'Dengue', pacienteNome: 'Ana Pereira', dataConsulta: '2025-10-15' },
];

export default function ListagemExames() {
  const [exames, setExames] = useState(dadosFicticios);

  const renderItem = ({ item }) => (
    <View style={Estilo.exameCard}>
      <View style={Estilo.exameCardContent}>
        <Text style={Estilo.exameCardTitle}>{item.nome} ({item.tipoExame})</Text>
        <Text style={Estilo.exameCardSubtitle}>Paciente: {item.pacienteNome}</Text>
        <Text style={Estilo.exameCardDetails}>Consulta: {item.dataConsulta}</Text>
      </View>
      <Text style={Estilo.editIcon}>✏️</Text>
    </View>
  );

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <Text style={Estilo.headerTitle}>Listagem Geral de Exames</Text>
      </View>

      <FlatList
        data={exames}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={Estilo.content}
        ListEmptyComponent={<Text>Nenhum exame encontrado.</Text>}
      />
    </SafeAreaView>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  exameCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  exameCardContent: {
    flex: 1,
  },
  exameCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  exameCardSubtitle: {
    fontSize: 13,
    color: '#6c757d',
  },
  exameCardDetails: {
    fontSize: 12,
    color: '#495057',
  },
  editIcon: {
    fontSize: 18,
    color: '#4285f4',
    marginLeft: 10,
  },
});
