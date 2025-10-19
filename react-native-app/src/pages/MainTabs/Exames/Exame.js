import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Octicons, Feather } from "@expo/vector-icons";

export default function Exames({ navigation }) {
  const handleAddExam = () => {
    navigation.navigate('CadastroExames');
  };

  const handleViewStats = () => {
    navigation.navigate('ListagemExames');
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
        <Feather style={Estilo.headerIcon} name="file-text" size={27} color="rgba(36, 128, 249, 0.8)" />
        <Text style={Estilo.headerTitle}>Exames</Text>
      </View>
      
      <ScrollView style={Estilo.content}>
        <Text style={Estilo.description}>
          Acesse cadastro e listagem dos exames.
        </Text>
        
        <TouchableOpacity style={Estilo.addCard} onPress={handleAddExam}>
          <View style={Estilo.addIconContainer}>
            <Text style={Estilo.addIcon}>+</Text>
          </View>
          <View style={Estilo.cardText}>
            <Text style={Estilo.cardTitle}>Cadastro de Exames</Text>
            <Text style={Estilo.cardSubtitle}>Cadastre Exames</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={Estilo.editCard} onPress={handleViewStats}>
          <View style={Estilo.editIconContainer}>
            <Octicons style={Estilo.editIcon} name="graph" size={27} color="rgba(36, 128, 249, 0.8)" />
          </View>
          <View style={Estilo.cardText}>
            <Text style={Estilo.cardTitle}>Listagem de Exames</Text>
            <Text style={Estilo.cardSubtitle}>Veja os exames disponiveis</Text>
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
});
