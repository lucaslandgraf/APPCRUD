import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';

export default function CadastroAlunos({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Aqui futuramente vai a conexão com a API
    console.log('Aluno salvo (simulação)');
  };

  return (
    <SafeAreaView style={Estilo.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={Estilo.header}>
        <TouchableOpacity onPress={handleGoBack} style={Estilo.backButton}>
          <Text style={Estilo.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={Estilo.headerTitle}>Cadastro de Aluno</Text>
      </View>

      <ScrollView style={Estilo.content}>
        {/* Campo NOME */}
        <Text style={Estilo.label}>Nome</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Nome completo do aluno"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        {/* Campo E-MAIL */}
        <Text style={Estilo.label}>E-mail</Text>
        <TextInput
          style={Estilo.input}
          placeholder="exemplo@dominio.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo TIPO DE USUÁRIO */}
        <Text style={Estilo.label}>Tipo de Usuário</Text>
        <TextInput
          style={Estilo.input}
          placeholder="ADM ou DEFAULT"
          value={tipoUsuario}
          onChangeText={setTipoUsuario}
          autoCapitalize="characters"
        />

        {/* Campo SENHA */}
        <Text style={Estilo.label}>Senha</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Digite a senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
        />

        {/* Campo CONFIRMAR SENHA */}
        <Text style={Estilo.label}>Confirmar Senha</Text>
        <TextInput
          style={Estilo.input}
          placeholder="Confirme a senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry={true}
        />

        {/* Botão SALVAR */}
        <TouchableOpacity style={Estilo.saveButton} onPress={handleSave}>
          <Text style={Estilo.saveButtonText}>Salvar Aluno</Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212529',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
