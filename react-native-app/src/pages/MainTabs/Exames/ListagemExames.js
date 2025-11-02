import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { Octicons } from '@expo/vector-icons';

export default function ListagemExames({ navigation }) {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarExames = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await api.get('/exames', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExames(response.data);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de exames');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarExames();
  }, []);

  const handleAddExame = () => {
    navigation.navigate('CadastroExames');
  };

  const handleEditExame = (exame) => {
    navigation.navigate('EditarExame', { exame });
  };

  const handleDeleteExame = (exame) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o exame "${exame.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('authToken');
              await api.delete(`/exames/${exame.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('Sucesso', `Exame "${exame.nome}" excluído!`);
              carregarExames();
            } catch (error) {
              console.error('Erro ao excluir exame:', error);
              Alert.alert('Erro', 'Não foi possível excluir o exame');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>{'<-'} Voltar</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Listagem de Exames</Text>
      </View>

      <TouchableOpacity style={Estilo.addCard} onPress={handleAddExame} disabled={loading}>
        <View style={Estilo.addIconContainer}>
          <Text style={Estilo.addIcon}>+</Text>
        </View>
        <View style={Estilo.cardText}>
          <Text style={Estilo.cardTitle}>Adicionar Exame</Text>
          <Text style={Estilo.cardSubtitle}>Cadastrar novo exame no sistema</Text>
        </View>
      </TouchableOpacity>

      <ScrollView style={Estilo.content}>
        {loading && <Text style={{ textAlign: 'center' }}>Carregando...</Text>}
        {!loading && exames.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum exame cadastrado.</Text>
        )}
        {exames.map((exame) => (
          <View key={exame.id} style={Estilo.exameCard}>
            <View style={Estilo.exameCardContent}>
              <Text style={Estilo.exameCardTitle}>{exame.nome}</Text>
              <Text style={Estilo.exameCardSubtitle}>Tipo: {exame.tipoExame}</Text>
              <Text style={Estilo.exameCardDetails}>Paciente: {exame.pacienteNome}</Text>
              <Text style={Estilo.exameCardDetails}>Consulta: {exame.dataConsulta}</Text>
            </View>
            <View style={Estilo.actionsContainer}>
              <TouchableOpacity
                style={Estilo.actionButton}
                onPress={() => handleEditExame(exame)}
              >
                <Octicons name="pencil" size={20} color="#2480f9" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[Estilo.actionButton, { marginLeft: 10 }]}
                onPress={() => handleDeleteExame(exame)}
              >
                <Octicons name="trash" size={20} color="#dc3545" />
              </TouchableOpacity>
            </View>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  exameCard: {
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
  exameCardContent: {
    flex: 1,
  },
  exameCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  exameCardSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  exameCardDetails: {
    fontSize: 14,
    color: '#6c757d',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#e9f1ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
