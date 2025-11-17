import React, { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../services/api';
import { Feather } from "@expo/vector-icons";

export default function ListagemExames({ navigation }) {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExames() {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await api.get('/exames', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Agrupar exames por tipo para o SectionList
        const grouped = response.data.reduce((acc, exame) => {
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

  const renderItem = ({ item }) => (
    <View style={Estilo.itemContainer}>
      <Text style={Estilo.itemTitle}>{item.nome}</Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={Estilo.sectionHeader}>
      <Text style={Estilo.sectionHeaderText}>{title}</Text>
    </View>
  );

  const handleGoBack = () => navigation.goBack();

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>←</Text>
        </TouchableOpacity>
        <Feather
          style={Estilo.headerIcon}
          name="list"
          size={27}
          color="rgba(36, 128, 249, 0.8)"
        />
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
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#4285f4",
  },
  headerIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#212529",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    backgroundColor: "#e9ecef",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: "#212529",
  },
  itemContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ced4da",
  },
  itemTitle: {
    fontSize: 16,
    color: "#212529",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#868e96",
  },
});
