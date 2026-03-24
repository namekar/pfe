import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native'
import { Link } from 'expo-router'
import { useState } from 'react'
import { useUser } from '@/hooks/useUser'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from "../../components/ThemedTextInput"
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from 'react-native-web'

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] =useState("")
  const [role, setRole] = useState("")

  const { register} = useUser()
  const handleSubmit = async () => {
    try {
      await register(email, password,role, name)
    } catch (error){
      
    }
  }

  

  return (
    
    <TouchableWithoutFeedback>
      <ThemedView style={styles.container}>

        <Spacer />
        <ThemedText title={true} style={styles.title}>
          Register an Account
        </ThemedText>

        <Spacer />
        <ThemedTextInput
          style={{ marginBottom: 20, width: "80%" }}
          placeholder="name"
          value={name}
          onChangeText={setName}
        />
        <ThemedTextInput
          style={{ marginBottom: 20, width: "80%" }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <ThemedTextInput
          style={{ marginBottom: 20, width: "80%" }}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <ThemedView style={styles.row} >
        <ThemedButton onPress={()=> setRole("Owner")}
          style={[
            styles.Option,
            role === "Owner" && styles.selectedOption
        ]}>
          <Text>Owner</Text>

        </ThemedButton>
        <ThemedButton onPress={()=> setRole("Vet")}
          style={[
            styles.Option,
            role === "Vet" && styles.selectedOption
        ]}>
          <Text>veterinary</Text>

        </ThemedButton>
        </ThemedView>

        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: '#f2f2f2' }}>Register</Text>
        </ThemedButton>

        <Spacer height={100} />
        <Link href="/login" replace>
          <ThemedText style={{ textAlign: "center" }}>
            Login instead
          </ThemedText>
        </Link>

      </ThemedView>
    </TouchableWithoutFeedback>
    
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30
  },
  selectedOption: {
    borderColor: "#00893e",
    borderWidth: 2
  },
  Option: {
  marginHorizontal: 50,
  },
  row:{
    flexDirection: "row",
  }
})