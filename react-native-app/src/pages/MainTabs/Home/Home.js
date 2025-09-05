import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={Estilo.container}>
      <Text style={Estilo.texto}>Bem-vindo ao Sistema 🎉</Text>
    </View>

  )
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  texto: {
    fontSize: 20,
    fontWeight: "bold",
  }
});
