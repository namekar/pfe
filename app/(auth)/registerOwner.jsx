import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Link } from 'expo-router';
import { useUser } from '@/hooks/useUser';
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedButton from '../../components/ThemedButton';
import Spacer from '../../components/Spacer';

const COLORS = {
  primary: '#32B36A',
  primaryDark: '#1F8A47',
  background: '#F7FBF5',
  card: '#E6F7EA',
  text: '#0E2A1F',
  muted: '#6B887A'
};

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useUser();

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Validation', 'Passwords do not match.');
      return;
    }

    try {
      await register(email, password, "Owner", name);
      Alert.alert('Success', 'Owner registered (demo).');
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <TouchableWithoutFeedback >
      <View style={{ flex: 1, backgroundColor: COLORS.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.logo}>VetPaws</Text>

          <Text style={styles.hero}>
            Welcome to the future of <Text style={{ color: COLORS.primary }}>pet care.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Create your owner account to manage your pet’s health records and appointments.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>Full name</Text>
            <ThemedTextInput
              style={styles.input}
              placeholder="Jane Doe"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email</Text>
            <ThemedTextInput
              style={styles.input}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <ThemedTextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showBtn}>
                <Text style={{ color: COLORS.primary }}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm Password</Text>
            <ThemedTextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry={!showPassword}
              value={confirm}
              onChangeText={setConfirm}
            />

            <TouchableOpacity style={styles.cta} onPress={handleSubmit}>
              <Text style={styles.ctaText}>Create owner account</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
              <Text style={styles.backText}>Back to account selection</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Register;

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
    elevation: 2
  },
  label: {
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: '#E4EFE6',
    borderWidth: 1,
    color: COLORS.text,
    marginBottom: 10
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  showBtn: {
    marginLeft: 10,
    paddingHorizontal: 8
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
  backLink: {
    marginTop: 12,
    alignItems: 'center'
  },
  backText: {
    color: COLORS.primaryDark
  }
});