import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';

const mockPacientes = [
  { id: '1', nome: 'João Silva', idade: 34, cpf: '123.456.789-00' },
  { id: '2', nome: 'Maria Oliveira', idade: 28, cpf: '987.654.321-00' },
  { id: '3', nome: 'Carlos Pereira', idade: 45, cpf: '111.222.333-44' },
];

export default function ListaPacientes({ navigation }) {
  const handleAddPatient = () => {
    navigation.navigate('CadastroPacientes');
  };

  const handleEditPatient = (paciente) => {
    console.log('Editar Paciente:', paciente);
    // Navegar para tela de edição passando paciente como parâmetro
    navigation.navigate('EditarPaciente', { paciente });
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
        <Text style={Estilo.headerIcon}>👥</Text>
        <Text style={Estilo.headerTitle}>Pacientes</Text>
      </View>

      {/* Description */}
      <Text style={Estilo.description}>
        Gerenciar cadastro de pacientes, histórico médico e informações pessoais.
      </Text>

      {/* Add Patient Card */}
      <TouchableOpacity style={Estilo.addCard} onPress={handleAddPatient}>
        <View style={Estilo.addIconContainer}>
          <Text style={Estilo.addIcon}>+</Text>
        </View>
        <View style={Estilo.cardText}>
          <Text style={Estilo.cardTitle}>Adicionar Paciente</Text>
          <Text style={Estilo.cardSubtitle}>Cadastrar novo paciente no sistema</Text>
        </View>
      </TouchableOpacity>

      <ScrollView style={Estilo.content}>
        {mockPacientes.map((paciente) => (
          <TouchableOpacity
            key={paciente.id}
            style={Estilo.patientCard}
            onPress={() => handleEditPatient(paciente)}
          >
            <View style={Estilo.patientInfo}>
              <Text style={Estilo.patientName}>{paciente.nome}</Text>
              <Text style={Estilo.patientDetails}>
                Idade: {paciente.idade} anos
              </Text>
              <Text style={Estilo.patientDetails}>CPF: {paciente.cpf}</Text>
            </View>
            <Text style={Estilo.editIcon}>✏️</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Header Styles
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4285f4',
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
  },

  // Description
  description: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 24,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },

  // Add Card Styles (copiado do modelo)
  addCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addIcon: {
    fontSize: 24,
    color: '#28a745',
    fontWeight: 'bold',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },

  // Patient Card Styles
  patientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: '#4285f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 14,
    color: '#6c757d',
  },
  editIcon: {
    fontSize: 20,
    marginLeft: 16,
  },
});
