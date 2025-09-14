import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';

export default function Paciente({ navigation }) {
  const handleAddPatient = () => {
    console.log('Adicionar Paciente');
  };

  const handleEditPatient = () => {
    console.log('Editar Paciente');
  };

  const handleNavigation = (item) => {
    console.log(`Navegação: ${item}`);
  };

  const handleGoBack = () => {
    console.log('Voltar para Funcionalidades');

  };

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={Estilo.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Funcionalidades")} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerIcon}>👥</Text>
        <Text style={Estilo.headerTitle}>Pacientes</Text>
      </View>
      
      {/* Conteúdo */}
      <ScrollView style={Estilo.content}>
        {/* Descrição */}
        <Text style={Estilo.description}>
          Gerenciar cadastro de pacientes, histórico médico e informações pessoais.
        </Text>
        
        {/* Card adicionar paciente */}
        <TouchableOpacity style={Estilo.addCard} onPress={handleAddPatient}>
          <View style={Estilo.addIconContainer}>
            <Text style={Estilo.addIcon}>+</Text>
          </View>
          <View style={Estilo.cardText}>
            <Text style={Estilo.cardTitle}>Adicionar Paciente</Text>
            <Text style={Estilo.cardSubtitle}>Cadastrar novo paciente no sistema</Text>
          </View>
        </TouchableOpacity>
        
        {/* Card edição de paciente */}
        <TouchableOpacity style={Estilo.editCard} onPress={handleEditPatient}>
          <View style={Estilo.editIconContainer}>
            <Text style={Estilo.editIcon}>✏️</Text>
          </View>
          <View style={Estilo.cardText}>
            <Text style={Estilo.cardTitle}>Editar Paciente</Text>
            <Text style={Estilo.cardSubtitle}>Atualizar informações de pacientes existentes</Text>
          </View>
        </TouchableOpacity>
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
  
  // Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    lineHeight: 24,
    marginTop: 20,
    marginBottom: 30,
  },
  
  // Card Styles
  addCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
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
  editCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4285f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  // Icon Container Styles
  addIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8f5e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  editIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addIcon: {
    fontSize: 24,
    color: '#28a745',
    fontWeight: 'bold',
  },
  editIcon: {
    fontSize: 20,
  },
  
  // Card Text Styles
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
  }
});

