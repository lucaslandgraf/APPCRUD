import React, { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { Octicons } from '@expo/vector-icons';

export default function ListagemExames({ navigation }) {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExames() {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await api.get('/exames', { headers });
        const examesData = response.data;

        const pacientesCache = {};
        const agendamentosCache = {};

        async function getPacienteNome(id) {
          if (!pacientesCache[id]) {
            const resp = await api.get(`/pacientes/${id}`, { headers });
            pacientesCache[id] = resp.data.nome;
          }
          return pacientesCache[id];
        }

        async function getAgendamentoData(id) {
          if (!agendamentosCache[id]) {
            const resp = await api.get(`/agendamentos/${id}`, { headers });
            agendamentosCache[id] = resp.data.data_consulta;
          }
          return agendamentosCache[id];
        }

        for (const exame of examesData) {
          exame.nomePaciente = await getPacienteNome(exame.paciente_id);
          exame.dataConsulta = await getAgendamentoData(exame.agendamento_id);
        }

        const grouped = examesData.reduce((acc, exame) => {
          let section = acc.find(s => s.title === exame.tipo);
          if (!section) {
            section = { title: exame.tipo, data: [] };
            acc.push(section);
          }
          section.data.push(exame);
          return acc;
        }, []);

        setExames(grouped);
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
        Alert.alert('Erro', 'Não foi possível carregar os exames.');
      } finally {
        setLoading(false);
      }
    }
    fetchExames();
  }, []);

  const getExameEndpoint = (exame) => {
  switch (exame.tipo.toLowerCase()) {
    case 'abo':
      return `/exames/abo/${exame.id}`;
    case 'dengue':
      return `/exames/dengue/${exame.id}`;
    case 'covid':
      return `/exames/covid/${exame.id}`;
  }
};

const handleEditExame = (exame) => {
  navigation.navigate('EdicaoExames', { exameId: exame.id, tipo: exame.tipo });
};

  const handleDelete = (exame) => {
    const confirmacao = window.confirm(
      `Deseja realmente deletar o exame ID ${exame.id} (Tipo: ${exame.tipo})?`
    );
    if (confirmacao) {
      setLoading(true);
      AsyncStorage.getItem('authToken').then(token => {
        const endpoint = getExameEndpoint(exame);
        api.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } })
          .then(() => {
            window.alert('Exame deletado com sucesso!');
            fetchExames();
          })
          .catch((error) => {
            console.error('Erro ao deletar exame:', error);
            window.alert('Não foi possível deletar o exame.');
          })
          .finally(() => {
            setLoading(false);
          });
      });
    }
  };

  async function fetchExames() {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await api.get('/exames', { headers });
      const examesData = response.data;

      const pacientesCache = {};
      const agendamentosCache = {};

      async function getPacienteNome(id) {
        if (!pacientesCache[id]) {
          const resp = await api.get(`/pacientes/${id}`, { headers });
          pacientesCache[id] = resp.data.nome;
        }
        return pacientesCache[id];
      }

      async function getAgendamentoData(id) {
        if (!agendamentosCache[id]) {
          const resp = await api.get(`/agendamentos/${id}`, { headers });
          agendamentosCache[id] = resp.data.data_consulta;
        }
        return agendamentosCache[id];
      }

      for (const exame of examesData) {
        exame.nomePaciente = await getPacienteNome(exame.paciente_id);
        exame.dataConsulta = await getAgendamentoData(exame.agendamento_id);
      }

      const grouped = examesData.reduce((acc, exame) => {
        let section = acc.find(s => s.title === exame.tipo);
        if (!section) {
          section = { title: exame.tipo, data: [] };
          acc.push(section);
        }
        section.data.push(exame);
        return acc;
      }, []);

      setExames(grouped);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
      Alert.alert('Erro', 'Não foi possível carregar os exames.');
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item }) => (
    <View style={Estilo.card}>
      <View style={Estilo.cardContent}>
        <Text style={Estilo.cardTitle}>{item.nome}</Text>
        <Text style={Estilo.cardSubtitle}>Paciente: {item.nomePaciente}</Text>
        <Text style={Estilo.cardDetails}>Data da Consulta: {item.dataConsulta}</Text>
      </View>
      <View style={Estilo.actionsContainer}>
        <TouchableOpacity style={Estilo.actionButton} onPress={() => handleEditExame(item)}>
          <Octicons name="pencil" size={20} color="#2480f9" />
        </TouchableOpacity>
        <TouchableOpacity style={[Estilo.actionButton, { marginLeft: 10 }]} onPress={() => handleDelete(item)}>
          <Octicons name="trash" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={Estilo.sectionHeader}>
      <Text style={Estilo.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={Estilo.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>{'<-'} Voltar</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Exames Cadastrados</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2480f9" style={{ marginTop: 30 }} />
      ) : exames.length === 0 ? (
        <View style={Estilo.emptyContainer}>
          <Text style={Estilo.emptyText}>Nenhum exame cadastrado.</Text>
        </View>
      ) : (
        <SectionList
          sections={exames}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={Estilo.listContent}
        />
      )}
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
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    backgroundColor: '#e9ecef',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4280f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  cardDetails: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#868e96',
  },
});
