import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";

// API_URL Universal (web/nativo)
const API_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.15.7:3000';

export default function Login({ navigation }) {
    // Estados para armazenar os dados dos campos
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    // Função para lidar com o login
    const handleLogin = async () => {
        if (!email || !senha) {
            Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, senha: senha }),
            });

            const data = await response.json();

            if (response.ok) {
    Alert.alert('Sucesso', data.message);

    console.log('Dados do usuário recebidos no Login:', data.usuario); 

    navigation.reset({ 
        index: 0, 
        routes: [{ name: 'MainTabs', params: { usuario: data.usuario } }], 
    });
}

            if (response.ok) {
                Alert.alert('Sucesso', data.message);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs', params: { usuario: data.usuario } }], 
                });
            } else { 
                Alert.alert('Erro', data.error || 'Não foi possível fazer login.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erro de Conexão', 'Não foi possível se conectar ao servidor.');
        }
    };

    return (
        <View style={Estilo.container}>
            <View style={Estilo.box}>
                {/* Cadeado */}
                <View style={Estilo.cadeado}>
                    <Feather name="lock" size={27} color="white" />
                </View>
                {/* Título e subtítulo */}
                <Text style={Estilo.texto}>Acesso Institucional</Text>
                <Text style={Estilo.subtexto}>Entre com suas credenciais para acessar o sistema</Text>
                {/* Campo de e-mail */}
                <View style={Estilo.grupoCampo}>
                    <Text style={Estilo.label}>E-mail Institucional</Text>
                    <TextInput style={Estilo.campo} placeholder="seu.email@instituicao.com" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
                {/* Campo de senha */}
                <View style={Estilo.grupoCampo}>
                    <Text style={Estilo.label}>Senha</Text>
                    <TextInput style={Estilo.campo} placeholder="Digite sua senha" secureTextEntry={true} placeholderTextColor="#888" value={senha} onChangeText={setSenha} />
                </View>
                {/* Esqueci minha senha */}
                <TouchableOpacity style={{ width: '100%' }} onPress={() => navigation.navigate('RecuperarSenha')}>
                    <Text style={Estilo.ForgetPass}>Esqueci minha senha - Clique aqui</Text>
                </TouchableOpacity>
                {/* Botão de login */}
                <TouchableOpacity style={Estilo.botao} onPress={handleLogin}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Entrar no Sistema</Text>
                </TouchableOpacity>
            </View> 
        </View>
    );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f9f9f9"
  },
  cadeado: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2480F9',
    borderRadius: 60 / 2,
    margin: 10,
  },
  box: {
    width: 350,
    padding: 20,
    backgroundColor: '#FEFEFE',
    borderRadius: 12,
    alignItems: "center"
  },
  texto: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000'
  },
  subtexto: {
    fontSize: 12,
    margin: 5,
    textAlign: "center"
  },
  grupoCampo: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15
  },
  label: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
    marginLeft: 5,
    alignSelf: "flex-start",
    fontWeight: 'bold',
  },
  campo: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    width: "100%",
    borderRadius: 8,
  },
  ForgetPass: {
    fontWeight: 'bold',
    fontSize: 14,
    color: "#2480F9",
    textDecorationLine: "underline",
    margin: 4,
    alignSelf: 'flex-end',
  },
  botao: {
    backgroundColor: "#2480F9",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  }
})