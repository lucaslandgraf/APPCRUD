import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Home({ navigation }) {
  return (
    <View style={Estilo.container}>
      {/* Título */}
      <Text style={Estilo.title}>Sistema Positivo de Saúde</Text>
      <Text style={Estilo.subtitle}>Bem-vindo! Gerencie seus pacientes e exames com facilidade.</Text>

      {/* Bloco de Pacientes Ativos */}
      <View style={Estilo.blocos}>
        <View style={Estilo.blocodados}>
          <Text style={{color:"#838383ff"}}>Pacientes Ativos</Text>
          <Text style={{color:"#2480F9"}}>0</Text>
        </View>
        <View style={Estilo.blocodados}>
          <Text style={{color:"#838383ff"}}>Agendamentos Hoje</Text>
          <Text style={{color:"#2480F9"}}>0</Text>
        </View>
      </View>

      {/* Bloco de Ações Rápidas */}
      <View style={Estilo.containerAcoes}>
        <Text style={Estilo.textobloco}>Ações Rápidas</Text>

        <View style={Estilo.containerBotoes}>

          <TouchableOpacity style={Estilo.button} onPress={ () => navigation.navigate('Pacientes')}>
            <View style={Estilo.icon}>
              <Feather name="user-plus" size={25} color="rgba(36, 128, 249, 0.8)" />
            </View>
            <View>
              <Text>Pacientes</Text>
              <Text style={{color:"#838383ff"}}>Cadastrar Pacientes</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={Estilo.button} onPress={ () => navigation.navigate('Agendamentos')}>
            <View style={Estilo.icon}>
              <Feather name="calendar" size={25} color="rgba(36, 128, 249, 0.8)" />
            </View>
            <View>
              <Text >Agendamentos</Text>
              <Text style={{color:"#838383ff"}}>Visualizar agenda</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={Estilo.button} onPress={ () => navigation.navigate('Relatorios')}>
            <View style={Estilo.icon}>
              <Feather name="file-text" size={25} color="rgba(36, 128, 249, 0.8)" />
            </View>
            <View>
              <Text>Relatórios</Text>
              <Text style={{color:"#838383ff"}}>Consultar Relatórios</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const Estilo = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 50,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  subtitle: {
    fontSize: 12,
    color: '#838383ff',
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 20,
  },
  textobloco: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    marginLeft: 20,
  },
  blocos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginBottom: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  containerAcoes: {
    width: '90%',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  containerBotoes: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    width: '100%',
    justifyContent: 'flex-start',
    gap: 15,
    marginLeft: 40, 
  },
  blocodados: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    flex: 1,                
    alignItems: 'center',
    elevation: 5,
    justifyContent: 'center',
    gap: 5,
    marginHorizontal: 6,    
  },
});