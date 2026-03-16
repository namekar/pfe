import { View, Text } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import {useUser} from '../../hooks/useUser'
import ThemedButton from '../../components/ThemedButton'
const profile = () => {
  const {logout} = useUser()
  return (
    <View>
      <ThemedButton  onPress={logout} ><Text style={{ color: '#f2f2f2'}}>logout</Text></ThemedButton>
    </View>
  )
}

export default profile