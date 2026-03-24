import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {Colors} from "../../../constants/colors"
import {useUser} from '../../../hooks/useUser'
import ThemedButton from '../../../components/ThemedButton'
import ThemedView from '../../../components/ThemedView'
import Spacer from '../../../components/Spacer'
import ThemedText from '../../../components/ThemedText'
const profile = () => {
  const { logout, user } = useUser()

  return (
    <ThemedView style={styles.container}>

      <ThemedText title={true} style={styles.heading}>
        {user.email}
      </ThemedText>
      <Spacer />

      <ThemedText style={styles.container}>Time to start reading some books...</ThemedText>
      <Spacer />

      <ThemedButton onPress={logout} style={styles.btn}>
        <Text style={{ color: '#f2f2f2' }}>Logout</Text>
      </ThemedButton>

    </ThemedView>
  )
}

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  btn: {
      backgroundColor: Colors.primary,
      padding: 18,
      borderRadius: 6,
      marginVertical: 10
    },
})
