import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar,} from 'react-native';

export default function RelatorioPaciente({ navigation }) {
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
        <Text style={Estilo.headerTitle}>Relatório de Pacientes</Text>
      </View>
      
      {/* conteúdo  dos gráficos */}
      <View style={Estilo.content}>
        <Text>Conteúdo dos relatórios aqui</Text>
      </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});