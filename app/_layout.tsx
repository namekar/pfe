import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Text, useColorScheme, View, } from "react-native";
import { Colors } from "../constants/colors";
import {UserProvider} from '../contexts/UserContext'
export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  
  
  return (
    <UserProvider>
    <View className="flex-1">
      <StatusBar style="auto"/>
      <Stack
      screenOptions={{
        headerStyle : {backgroundColor: theme.navBackground},
        headerTintColor: theme.title,
      }}
      >
        <Stack.Screen name="index" options={{title: 'Home'}}/>
        <Stack.Screen name="register" options={{title: 'register'}}/>
        <Stack.Screen name="login" options={{title: 'login'}}/>
      </Stack>
      
    </View>
    </UserProvider>
  );
}
