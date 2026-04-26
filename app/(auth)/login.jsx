import {
  StyleSheet,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native'
import { Link } from 'expo-router'
import { useState } from 'react'
import { useUser } from '../../hooks/useUser'

import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from "../../components/ThemedTextInput"

const COLORS = {
  primary: '#32B36A',
  primaryDark: '#1F8A47',
  background: '#F7FBF5',
  card: '#E6F7EA',
  text: '#0E2A1F',
  muted: '#6B887A'
};

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { login } = useUser()

  const handleSubmit = async () => {
    try {
      await login(email, password)
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.logo}>VetPaws</Text>
        <Text style={styles.hero}>
          Welcome back to the future of <Text style={{ color: COLORS.primary }}>pet care.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Sign in to continue to your dashboard.
        </Text>

        <ThemedView style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <ThemedTextInput
            style={styles.input}
            placeholder="you@clinic.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <ThemedTextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <ThemedButton style={styles.cta} onPress={handleSubmit}>
            <Text style={styles.ctaText}>Login</Text>
          </ThemedButton>

          <Link href="/register" replace>
            <Text style={styles.backText}>Register instead</Text>
          </Link>
        </ThemedView>
      </ScrollView>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 24
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8
  },
  hero: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
    color: COLORS.text,
    marginVertical: 12
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.muted,
    marginBottom: 20,
    maxWidth: 920
  },
  card: {
    width: '100%',
    maxWidth: 920,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center'
  },
  label: {
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    alignSelf: 'flex-start'
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: '#E4EFE6',
    borderWidth: 1,
    color: COLORS.text,
    marginBottom: 16
  },
  cta: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    width: '100%'
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  backText: {
    color: COLORS.primaryDark,
    marginTop: 12,
    textAlign: 'center'
  }
})