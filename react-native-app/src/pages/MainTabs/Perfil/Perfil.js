import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Perfil({ navigation, usuario }) {

    console.log('(Perfil.js) Dados do usuário recebidos via props:', usuario);

    const doLogoutAction = () => {
        console.log("Usuário confirmou o logout. Tentando resetar a navegação...");
        try {
            navigation.getParent().reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (e) {
            console.error("Falha ao usar getParent().reset:", e);
            console.log("Usando método de fallback: navigation.navigate('Login')");
            navigation.navigate('Login');
        }
    };

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            if (window.confirm("Você tem certeza que deseja sair?")) {
                doLogoutAction(); 
            } else {
                console.log("Logout cancelado");
            }
        } else {
            Alert.alert(
                "Encerrar Sessão",
                "Você tem certeza que deseja sair?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Sair", onPress: doLogoutAction, style: "destructive" } 
                ]
            );
        }
    };

    return (
        <View style={Estilo.container}>
            <View style={Estilo.mainContent}>
                {/* Cabeçalho */}
                <View style={Estilo.top}>
                    <View style={[Estilo.icon, Estilo.profileIcon]}>
                        <Feather name="user" size={27} color="rgba(36, 128, 249, 0.8)" />
                    </View>
                    <View>
                        <Text style={Estilo.topTitle}>{usuario ? usuario.nome : 'Usuário'}</Text>
                        <Text style={Estilo.topSubtitle}>{usuario ? (usuario.rol === 'ADM' ? 'Administrador' : 'Usuário Padrão') : 'Carregando...'}</Text>
                    </View>
                </View>

                {/* Botões */}
                <View style={Estilo.botoes}>
                    <TouchableOpacity
                        style={Estilo.button}
                        onPress={() => navigation.navigate('AlterarSenha', { usuario: usuario })}
                    >
                         <View style={Estilo.icon}>
                            <Feather name="key" size={25} color="rgba(36, 128, 249, 0.8)" />
                        </View>
                        <View>
                            <Text style={Estilo.title}>Alterar Senha</Text>
                            <Text style={Estilo.subtitle}>Mudar sua senha de acesso</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Botão Sair chama handleLogout */}
                    <TouchableOpacity style={Estilo.button} onPress={handleLogout}>
                         <View style={Estilo.icon}>
                            <Feather name="log-out" size={25} color="rgba(36, 128, 249, 0.8)" />
                        </View>
                        <View>
                            <Text style={Estilo.title}>Sair</Text>
                            <Text style={Estilo.subtitle}>Encerrar sessão no sistema</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Rodapé */}
            <View style={Estilo.footer}>
                <Text style={Estilo.textfooter}>© 2025 Sistema Positivo de Saúde</Text>
                <Text style={Estilo.subtextfooter}>Todos os direitos reservados.</Text>
            </View>
        </View>
    );
}

const Estilo = StyleSheet.create({
  container: { flex: 1 },
  mainContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 20,
    marginTop: 20,
    alignSelf: "flex-start",
  },
  topTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  topSubtitle: {
    fontSize: 14,
  },
  icon: {
    backgroundColor: "rgba(36, 128, 249, 0.2)",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  botoes: {
    width: "100%",
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    marginBottom: 10,
    gap: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
  },
  footer: {
    backgroundColor: "#f0f4f7",
    padding: 15,
  },
  textfooter: {
    color: "#85858f",
    fontSize: 15,
    textAlign: "center",
  },
  subtextfooter: {
    color: "#85858f",
    fontSize: 12,
    textAlign: "center",
  },
});
