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

export default function ListaPacientes({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState('');

  const formatCpfVisual = (cpf) => {
    if (!cpf) return 'Não informado';
    const cpfString = String(cpf);
    if (cpfString.length === 11) {
      return cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpfString;
  };

  const carregarPacientes = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await api.get('/pacientes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPacientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarPacientes();
    });
    return unsubscribe;
  }, [navigation]);

  const handleAddPatient = () => {
    navigation.navigate('CadastroPacientes');
  };

  const handleEditPatient = (paciente) => {
    navigation.navigate('EditarPaciente', { pacienteId: paciente.id });
  };

  const handleDeletePatient = (paciente) => {

    const performDelete = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        await api.delete(`/pacientes/${paciente.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (Platform.OS === 'web') {
            window.alert(`Sucesso: Paciente ${paciente.nome} excluído.`);
        } else {
            Alert.alert('Sucesso', `Paciente ${paciente.nome} excluído.`);
        }
        carregarPacientes();
      } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        Alert.alert('Erro', 'Não foi possível excluir o paciente.');
      }
    };

    if (Platform.OS === 'web') {
        const confirmacao = window.confirm(`Deseja realmente excluir o paciente ${paciente.nome}?`);
        if (confirmacao) {
            performDelete();
        }
    } else {
        Alert.alert(
            'Confirmar Exclusão',
            `Deseja realmente excluir o paciente ${paciente.nome}?`,
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

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>{'<-'} Voltar</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Visualizar Pacientes</Text>
      </View>

      <View style={Estilo.searchContainer}>
        <Octicons name="search" size={20} color="#6c757d" style={Estilo.searchIcon} />
        <TextInput
          style={Estilo.searchInput}
          placeholder="Buscar paciente pelo nome..."
          value={busca}
          onChangeText={setBusca}
          placeholderTextColor="#999"
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => setBusca('')}>
            <Octicons name="x-circle" size={20} color="#6c757d" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={Estilo.addCard} onPress={handleAddPatient} disabled={loading}>
        <View style={Estilo.addIconContainer}>
          <Text style={Estilo.addIcon}>+</Text>
        </View>
        <View style={Estilo.cardText}>
          <Text style={Estilo.cardTitle}>Adicionar Paciente</Text>
          <Text style={Estilo.cardSubtitle}>Cadastrar novo paciente no sistema</Text>
        </View>
      </TouchableOpacity>

      <ScrollView style={Estilo.content}>
        {loading && <Text style={{ textAlign: 'center' }}>Carregando...</Text>}

        {!loading && pacientesFiltrados.length === 0 && (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
            {pacientes.length === 0 ? "Nenhum paciente cadastrado." : "Nenhum paciente encontrado com esse nome."}
          </Text>
        )}

        {pacientesFiltrados.map((paciente) => (
          <View key={paciente.id} style={Estilo.patientCard}>
            <View style={Estilo.patientInfo}>
              <Text style={Estilo.patientName}>{paciente.nome}</Text>
              <Text style={Estilo.patientDetails}>
                Idade: {paciente.data_nascimento ? new Date().getFullYear() - new Date(paciente.data_nascimento).getFullYear() : 'N/A'} anos
              </Text>
              <Text style={Estilo.patientDetails}>
                CPF: {formatCpfVisual(paciente.CPF || paciente.cpf)}
              </Text>
            </View>
            <View style={Estilo.actionsContainer}>
              <TouchableOpacity
                style={Estilo.actionButton}
                onPress={() => handleEditPatient(paciente)}
              >
                <Octicons name="pencil" size={20} color="#2480f9" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[Estilo.actionButton, { marginLeft: 10 }]}
                onPress={() => handleDeletePatient(paciente)}
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
    borderColor: '#e9ecef',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  addCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 16,
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
  },
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