import { Link } from "expo-router";
import { Text, View } from "react-native";
import Tabs from "./Tabs";
import Login from "./(auth)/login"
import Register from "./(auth)/register"



export default function Index() {
  return (
    <View className="">
      
      <Link href="/(auth)/register">register</Link>
      <Link href="/(auth)/login">login</Link>
      <Link href="/Profile">profile</Link>
      
      
    </View>
  );
}
