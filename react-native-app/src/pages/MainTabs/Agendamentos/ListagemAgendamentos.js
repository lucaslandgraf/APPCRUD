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
  TextInput,
  Platform, 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { Octicons } from '@expo/vector-icons';

export default function ListagemAgendamentos({ navigation }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await api.get('/agendamentos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarAgendamentos();
    });
    return unsubscribe;
  }, [navigation]);

  const handleAddAgendamento = () => {
    navigation.navigate('CadastroAgendamento');
  };

  const handleEditAgendamento = (agendamento) => {
    navigation.navigate('EdicaoAgendamento', { agendamentoId: agendamento.id });
  };

  const handleDeleteAgendamento = (agendamento) => {
    const performDelete = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        await api.delete(`/agendamentos/${agendamento.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Platform.OS === 'web') {
            alert('Sucesso: Agendamento excluído!');
        } else {
            Alert.alert('Sucesso', 'Agendamento excluído!');
        }
        
        carregarAgendamentos(); 
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        Alert.alert('Erro', 'Não foi possível excluir o agendamento.');
      }
    };

    if (Platform.OS === 'web') {
      const confirm = window.confirm(`Deseja realmente excluir o agendamento ID ${agendamento.id}?`);
      if (confirm) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Confirmar Exclusão',
        `Deseja realmente excluir o agendamento ID ${agendamento.id}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: performDelete, 
          },
        ]
      );
    }
  };

  const agendamentosFiltrados = agendamentos.filter((item) => {
    const termo = busca.toLowerCase();
    const nomePaciente = item.nome_paciente ? item.nome_paciente.toLowerCase() : '';
    const idPaciente = String(item.paciente_id);
    return nomePaciente.includes(termo) || idPaciente.includes(termo);
  });

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>{'<-'} Voltar</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Agendamentos</Text>
      </View>

      <View style={Estilo.searchContainer}>
        <Octicons name="search" size={20} color="#6c757d" style={Estilo.searchIcon} />
        <TextInput
          style={Estilo.searchInput}
          placeholder="Buscar por nome ou ID..."
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Octicons name="x-circle" size={20} color="#6c757d" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={Estilo.addCard} onPress={handleAddAgendamento} disabled={loading}>
        <View style={Estilo.addIconContainer}>
          <Text style={Estilo.addIcon}>+</Text>
        </View>
        <View style={Estilo.cardText}>
          <Text style={Estilo.cardTitle}>Novo Agendamento</Text>
          <Text style={Estilo.cardSubtitle}>Agendar consulta para paciente</Text>
        </View>
      </TouchableOpacity>

      <ScrollView style={Estilo.content}>
        {loading && <Text style={{ textAlign: 'center', marginTop: 10 }}>Carregando...</Text>}
        
        {!loading && agendamentosFiltrados.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
            {agendamentos.length === 0 ? "Nenhum agendamento cadastrado." : "Nenhum agendamento encontrado."}
          </Text>
        )}

        {agendamentosFiltrados.map((agendamento) => (
          <View key={agendamento.id} style={Estilo.agendamentoCard}>
            <View style={Estilo.agendamentoCardContent}>
              <Text style={Estilo.agendamentoCardTitle}>{agendamento.tipo_exame}</Text>
              <Text style={Estilo.agendamentoCardSubtitle}>
                Paciente: {agendamento.nome_paciente ? agendamento.nome_paciente : `ID ${agendamento.paciente_id}`}
              </Text>
              <Text style={Estilo.agendamentoCardDetails}>
                Data: {new Date(agendamento.data_consulta).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <View style={Estilo.actionsContainer}>
              <TouchableOpacity
                style={Estilo.actionButton}
                onPress={() => handleEditAgendamento(agendamento)}
              >
                <Octicons name="pencil" size={20} color="#2480f9" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[Estilo.actionButton, { marginLeft: 10 }]}
                onPress={() => handleDeleteAgendamento(agendamento)}
              >
                <Octicons name="trash" size={20} color="#dc3545" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Estilo = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: { 
    backgroundColor: '#ffffff', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#e9ecef' 
  },
  backButton: { 
    marginRight: 10 
  },
  backButtonText: { 
    fontSize: 16, 
    color: '#4285f4' 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: '600', 
    color: '#212529' 
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ffffff', 
    borderRadius: 10, 
    marginHorizontal: 20, 
    marginTop: 16, 
    marginBottom: 8, 
    paddingHorizontal: 15, 
    height: 50, 
    borderWidth: 1, 
    borderColor: '#e9ecef' 
  },
  searchIcon: { 
    marginRight: 10 
  },
  searchInput: { 
    flex: 1, 
    fontSize: 16, 
    color: '#333', 
    height: '100%' 
  },
  addCard: { 
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    padding: 20, 
    marginHorizontal: 20, 
    marginVertical: 10, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderLeftWidth: 4, 
    borderLeftColor: '#28a745', 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0,
      height: 2 }, 
      shadowOpacity: 0.1, 
      shadowRadius: 8, 
      elevation: 3 
    },
  addIconContainer: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#e8f5e8', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  addIcon: { 
    fontSize: 24, 
    color: '#28a745', 
    fontWeight: 'bold' 
  },
  cardText: { 
    flex: 1 
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#212529', 
    marginBottom: 4 
  },
  cardSubtitle: { 
    fontSize: 14, 
    color: '#6c757d', 
    lineHeight: 20 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  agendamentoCard: { 
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
    shadowOffset: { 
      width: 0, 
      height: 2 
    }, 
      shadowOpacity: 0.1, 
      shadowRadius: 8, 
      elevation: 3 
    },
  agendamentoCardContent: { 
    flex: 1 
  },
  agendamentoCardTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#212529', 
    marginBottom: 4 
  },
  agendamentoCardSubtitle: { 
    fontSize: 14, 
    color: '#6c757d', 
    marginBottom: 2 
  },
  agendamentoCardDetails: { 
    fontSize: 13, 
    color: '#999' 
  },
  actionsContainer: { 
    flexDirection: 'row', 
    marginLeft: 16 
  },
  actionButton: { 
    padding: 8, 
    borderRadius: 6, 
    backgroundColor: '#e9f1ff', 
    justifyContent: 'center', 
    alignItems: 'center'
 },
});