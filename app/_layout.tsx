import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { Text, useColorScheme, View, } from "react-native";
import { Colors } from "../constants/colors";
import {UserProvider} from '../contexts/UserContext'
import {AnimalsProvider} from '../contexts/AnimalsContext'
export default function RootLayout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  
  
  return (
    <UserProvider>
    <AnimalsProvider>
      <View className="flex-1">
        <StatusBar style="auto"/>
        <Stack
        screenOptions={{
          headerShown : false,
          headerStyle : {backgroundColor: theme.navBackground},
          headerTintColor: theme.title,
        }}
        >
          <Stack.Screen name="(auth)" options={{headerShown: false}}/>
          <Stack.Screen name="(dashboard)" options={{headerShown: false}}/>
          <Stack.Screen name="index" options={{title: 'Home'}}/>
        </Stack>
        
      </View>
    </AnimalsProvider>
    </UserProvider>
  );
}
