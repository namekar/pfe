import { Pressable, StyleSheet, Text, View, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
export default function ChoiceScreen() {
  const router = useRouter();
  const handlePressVet = () => {
    router.push('./(auth)/register');
  }
  const handlePressOwner = () =>{
    router.push('./(auth)/registerOwner')
  }
  const topScale = useRef(new Animated.Value(1)).current;
  const bottomScale = useRef(new Animated.Value(1)).current;
  const [isTopHovered, setIsTopHovered] = useState(false);
  const [isBottomHovered, setIsBottomHovered] = useState(false);


  const animateIn = (anim)=> {
    Animated.timing(anim, {
      toValue: 1.05,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };
  const animateOut = (anim) => {
    Animated.timing(anim,{
      toValue:1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: topScale}], flex:1 }}>
        
      <Pressable 
        onPress={handlePressVet}    
        style={[styles.half1,
          isTopHovered ? styles.topHover : styles.top]}
        onHoverIn={()=> {setIsTopHovered(true); animateIn(topScale);}}
        onHoverOut={()=> {setIsTopHovered(false); animateOut(topScale);}}
        >
        <Text style={styles.text}>Veterinary account</Text>
        <Text style={styles.paragraph}>Lorem ipsum, dolor sit tes, magnam, suscipit <br/>assumenda iusto non! Minima quae optio dolorem quos nemo.</Text>
      </Pressable>
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: bottomScale}], flex:1 }}>
      <Pressable
        onPress={handlePressOwner}
        style={[styles.half,
          isBottomHovered ? styles.bottomHover : styles.bottom]}
        onHoverIn={()=> {setIsBottomHovered(true); animateIn(bottomScale);}}
        onHoverOut={()=> {setIsBottomHovered(false); animateOut(bottomScale);}}
        >
        <Text style={styles.text2}>Owner account</Text>
        <Text style={styles.paragraph2}>Lorem ipsum, dolor sit tes, magnam, suscipit <br/>assumenda iusto non! Minima quae optio dolorem quos nemo.</Text>
      </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4FBF7",
  },
  half: {
    flex: 1, 
    marginLeft: "4%",
    marginBottom: "4%",
    marginRight: "4%",
    marginTop: "2%",
    borderRadius: "3%",
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius : 10,
    elevation: 5,
    
    
  },
  half1: {
    flex: 1, 
    marginTop: "4%",
    marginLeft: "4%",
    marginBottom: "2%",
    marginRight: "4%",
    borderRadius: "3%",
    shadowColor: "#000",
    shadowOpacity: 1,
    shadowRadius : 10,
    elevation: 5,
    
    
  },
  top: {
    backgroundColor: "#2F6F4E",
  },
  topHover:{
    backgroundColor : "#87C1A3",
  },
  bottom: {
    backgroundColor: "#2F6F4E",
  },
  bottomHover: {
  backgroundColor: "#87C1A3",
},
  text: {
    fontSize: 30,
    color: "#2E8B57",
    fontWeight: "bold",
    marginTop: "2%",
    marginLeft: "15%",
  },text2: {
    fontSize: 30,
    color: "#2E8B57",
    fontWeight: "bold",
    marginTop: "2%",
    marginLeft: "15%",
  },
  paragraph:{
    fontSize: 16,
    color: "#2E8B57",
    fontWeight: "bold",
    marginTop: "2%",
    marginLeft: "7%",
    
  },
  paragraph2:{
    fontSize: 16,
    color: "#2E8B57",
    fontWeight: "bold",
    marginTop: "2%",
    marginLeft: "7%",
  }
});