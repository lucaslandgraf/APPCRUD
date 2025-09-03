import { StyleSheet, View, Text } from "react-native"


export default function Home(){
    return(
    <View style={Estilo.container}>
        <View style={Estilo.box}>
            <Text style={Estilo.texto}>Acesso Institucional</Text>
        </View>
    </View>
    )
}

const Estilo = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f9f9f9ff"
  },
  box:{
        width: 400,     
        padding: 20,              
        backgroundColor: '#FEFEFE',   
        borderRadius: 12,     
        alignItems: "center"  
  },
  texto: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000' // deixa o texto branco pra contrastar
  }
})