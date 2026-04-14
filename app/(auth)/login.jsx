import {
  StyleSheet,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Platform
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
    } catch (error) {}
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback >
        <View style={styles.container}>

          <Text style={styles.logo}>VetPaws</Text>

          <Text style={styles.hero}>
            Welcome back to the future of{' '}
            <Text style={{ color: COLORS.primary }}>pet care.</Text>
          </Text>

          <Text style={styles.subtitle}>
            Sign in to continue to your dashboard.
          </Text>

          <View style={styles.card}>

            <ThemedText style={styles.label}>Email</ThemedText>
            <ThemedTextInput
              style={styles.input}
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <ThemedText style={[styles.label, { marginTop: 14 }]}>
              Password
            </ThemedText>
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

            <View style={styles.footerRow}>
              <Text style={styles.smallText}>
                Don’t have an account?
              </Text>

              <Link href="../roleChoice" replace>
                <Text style={styles.createLink}> Register</Text>
              </Link>
            </View>

          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Login

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  container: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8
  },
  hero: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: COLORS.text,
    marginVertical: 8
  },
  subtitle: {
    textAlign: 'center',
    color: COLORS.muted,
    marginBottom: 22
  },
  card: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: COLORS.card,
    padding: 24,
    elevation: 2
  },
  label: {
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: '#E4EFE6',
    borderWidth: 1,
    marginBottom: 10
  },
  cta: {
    marginTop: 18,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center'
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  footerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  smallText: {
    color: COLORS.muted
  },
  createLink: {
    color: COLORS.primaryDark,
    fontWeight: '700'
  }
})