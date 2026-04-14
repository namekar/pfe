import { ActivityIndicator, useColorScheme } from "react-native";
import {Colors} from "../constants/colors"
import ThemedView from './ThemedView'
import LottieView from "lottie-react-native";

const ThemedLoader = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light



    return(
        <ThemedView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
        <LottieView
            source={require("../assets/animations/Davsan.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </ThemedView>
    )
}
export default ThemedLoader