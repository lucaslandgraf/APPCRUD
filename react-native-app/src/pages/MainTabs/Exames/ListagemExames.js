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
  TextInput,
  Platform,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { Octicons } from '@expo/vector-icons';

export default function ListagemExames({ navigation }) {
  const [listaOriginal, setListaOriginal] = useState([]);
  const [secoesExames, setSecoesExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');

  const agruparExames = (lista) => {
    return lista.reduce((acc, exame) => {
      let section = acc.find(s => s.title === exame.tipo);
      if (!section) {
        section = { title: exame.tipo, data: [] };
        acc.push(section);
      }
      section.data.push(exame);
      return acc;
    }, []);
  };

  async function fetchExames() {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await api.get('/exames', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const dados = response.data;
      setListaOriginal(dados);
      setSecoesExames(agruparExames(dados));

    } catch (error) {
      console.error('Erro ao carregar exames:', error);
      Alert.alert('Erro', 'Não foi possível carregar os exames.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchExames();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (listaOriginal.length === 0) return;
    const termo = busca.toLowerCase();
    const listaFiltrada = listaOriginal.filter(item => {
      const nomeP = item.nomePaciente ? item.nomePaciente.toLowerCase() : '';
      const nomeExame = item.nome ? item.nome.toLowerCase() : '';
      return nomeP.includes(termo) || nomeExame.includes(termo);
    });
    setSecoesExames(agruparExames(listaFiltrada));
  }, [busca, listaOriginal]);


  const getExameEndpoint = (exame) => {
    switch (exame.tipo.toLowerCase()) {
      case 'abo': return `/exames/abo/${exame.id}`;
      case 'dengue': return `/exames/dengue/${exame.id}`;
      case 'covid': return `/exames/covid/${exame.id}`;
      default: return '';
    }
  };

  const handleEditExame = (exame) => {
    navigation.navigate('EdicaoExames', { exameId: exame.id, tipo: exame.tipo });
  };

  const handleDelete = (exame) => {

    const performDelete = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        const endpoint = getExameEndpoint(exame);
        await api.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });

        if (Platform.OS === 'web') {
          alert('Sucesso: Exame deletado com sucesso!');
        } else {
          Alert.alert('Sucesso', 'Exame deletado com sucesso!');
        }

        fetchExames();
      } catch (error) {
        console.error('Erro ao deletar:', error);
        Alert.alert('Erro', 'Não foi possível deletar o exame.');
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Deseja realmente deletar o exame ID ${exame.id} (${exame.tipo})?`)) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Confirmar Exclusão',
        `Deseja realmente deletar o exame ID ${exame.id} (${exame.tipo})?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: performDelete
          }
        ]
      );
    }
  };

  const renderItem = ({ item }) => (
    <View style={Estilo.card}>
      <View style={Estilo.cardContent}>
        <Text style={Estilo.cardTitle}>{item.nome || `Exame ${item.tipo}`}</Text>
        <Text style={Estilo.cardSubtitle}>
          Paciente: {item.nomePaciente || 'Não informado'}
        </Text>
        <Text style={Estilo.cardDetails}>
          Data: {item.dataConsulta ? new Date(item.dataConsulta).toLocaleDateString('pt-BR') : '--/--/----'}
        </Text>
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
        <Text style={Estilo.headerTitle}>Exames</Text>
      </View>

      <View style={Estilo.searchContainer}>
        <Octicons name="search" size={20} color="#6c757d" style={Estilo.searchIcon} />
        <TextInput
          style={Estilo.searchInput}
          placeholder="Filtrar por paciente..."
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

      {loading ? (
        <ActivityIndicator size="large" color="#2480f9" style={{ marginTop: 30 }} />
      ) : secoesExames.length === 0 ? (
        <View style={Estilo.emptyContainer}>
          <Text style={Estilo.emptyText}>
            {busca ? "Nenhum exame encontrado." : "Nenhum exame cadastrado."}
          </Text>
        </View>
      ) : (
        <SectionList
          sections={secoesExames}
          keyExtractor={(item) => item.id.toString() + item.tipo}
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
    backgroundColor: '#f8f9fa'
  },
  header: {
    backgroundColor: '#fff',
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
    marginTop: 10,
    marginBottom: 5,
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
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  sectionHeader: {
    backgroundColor: '#e9ecef',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 8,
    marginTop: 10
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529'
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
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  cardContent: {
    flex: 1
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529'
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4
  },
  cardDetails: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    color: '#868e96'
  },
});