import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  SafeAreaView,
  useWindowDimensions
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import LottieView from "lottie-react-native";

const COLORS = {
  primary: "#32B36A",
  primaryDark: "#1F8A47",
  background: "#F7FBF5",
  card: "#E6F7EA",
  cardSelected: "#DAF6E1",
  text: "#0E2A1F",
  muted: "#6B887A"
};

export default function ChoiceScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isDesktop = width > 768;

  const handlePressVet = () => {
    router.push("./(auth)/register");
  };

  const handlePressOwner = () => {
    router.push("./(auth)/registerOwner");
  };

  const topScale = useRef(new Animated.Value(1)).current;
  const bottomScale = useRef(new Animated.Value(1)).current;

  const [isTopHovered, setIsTopHovered] = useState(false);
  const [isBottomHovered, setIsBottomHovered] = useState(false);

  const animateIn = (anim) => {
    Animated.timing(anim, {
      toValue: 1.05,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const animateOut = (anim) => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.logo}>VetPaws</Text>

        <Text style={styles.hero}>
          Welcome to the future of{" "}
          <Text style={{ color: COLORS.primary }}>pet care.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Please select the account type that best describes your role.
        </Text>

        <View
          style={[
            styles.list,
            isDesktop && { flexDirection: "row", gap: 20 }
          ]}
        >
          <Animated.View style={{ flex: 1, transform: [{ scale: topScale }] }}>
            <Pressable
              onPress={handlePressVet}
              style={[
                styles.bubble,
                isTopHovered ? styles.bubbleSelected : styles.bubbleDefault
              ]}
              onHoverIn={() => {
                setIsTopHovered(true);
                animateIn(topScale);
              }}
              onHoverOut={() => {
                setIsTopHovered(false);
                animateOut(topScale);
              }}
            >
              <Text style={[
                styles.roleTitle,
                isTopHovered && { color: COLORS.primaryDark }
              ]}>
                Veterinary Medical Professional
              </Text>

              <Text style={styles.roleSubtitle}>
                Access clinical tools, patient records, and practice settings.
              </Text>

              <Text style={styles.roleHint}>
                Professional verified • Practice tools
              </Text>
              <View style={styles.chipsContainer}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Patient Records</Text>
                </View>
                <View style={styles.chip}>
                 <Text style={styles.chipText}>Appointments</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Analytics</Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>

          <Animated.View style={{ flex: 1, transform: [{ scale: bottomScale }] }}>
            <Pressable
              onPress={handlePressOwner}
              style={[
                styles.bubble,
                isBottomHovered ? styles.bubbleSelected : styles.bubbleDefault
              ]}
              onHoverIn={() => {
                setIsBottomHovered(true);
                animateIn(bottomScale);
              }}
              onHoverOut={() => {
                setIsBottomHovered(false);
                animateOut(bottomScale);
              }}
            >
              <Text style={[
                styles.roleTitle,
                isBottomHovered && { color: COLORS.primaryDark }
              ]}>
                Dedicated Pet Owner
              </Text>

              <Text style={styles.roleSubtitle}>
                Manage your pet’s health, appointments, and records.
              </Text>

              <Text style={styles.roleHint}>
                Health tracking • Secure records
              </Text>
              <View style={styles.chipsContainer}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Health Tracking</Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>Reminders</Text>
                </View>
                <View style={styles.chip}>
                 <Text style={styles.chipText}>Vet Access</Text>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </View>

        
        <View style={styles.lottieContainer}>
          <LottieView
            source={require("../assets/animations/Happy Dog.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background
  },

  container: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 20
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 6
  },

  hero: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: COLORS.text,
    marginVertical: 8,
    maxWidth: 800
  },

  subtitle: {
    textAlign: "center",
    color: COLORS.muted,
    marginBottom: 25,
    maxWidth: 600
  },

  list: {
    width: "100%",
    maxWidth: 900
  },

  bubble: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1
  },

  bubbleDefault: {
    backgroundColor: COLORS.card,
    borderColor: "#E6F4EA"
  },

  bubbleSelected: {
    backgroundColor: COLORS.cardSelected,
    borderColor: COLORS.primary
  },

  roleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6
  },

  roleSubtitle: {
    color: COLORS.muted,
    marginBottom: 10
  },

  roleHint: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600"
  },

  lottieContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8
  },

  chip: {
    backgroundColor: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCEFE0"
  },

  chipText: {
    fontSize: 12,
    color: "#1F8A47",
    fontWeight: "600"
  },
});