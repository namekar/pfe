import { StyleSheet, TouchableOpacity, View, Image } from 'react-native'
import { Link, router } from 'expo-router'
import { Feather } from '@expo/vector-icons'

import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"
import ThemedLogo from "../components/ThemedLogo"
import Spacer from "../components/Spacer"
import { Colors } from '../constants/colors'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <ThemedLogo />
        </View>
        
        <ThemedText style={styles.title} title={true}>
          Pet Archives
        </ThemedText>
        
        <ThemedText style={styles.subtitle}>
          Save all files safely in one place
        </ThemedText>
        
        <View style={styles.taglineContainer}>
          <View style={styles.taglineItem}>
            <Feather name="check-circle" size={16} color={Colors.primary} />
            <ThemedText style={styles.taglineText}>Secure pet records</ThemedText>
          </View>
          <View style={styles.taglineItem}>
            <Feather name="check-circle" size={16} color={Colors.primary} />
            <ThemedText style={styles.taglineText}>Easy access anywhere</ThemedText>
          </View>
          <View style={styles.taglineItem}>
            <Feather name="check-circle" size={16} color={Colors.primary} />
            <ThemedText style={styles.taglineText}>Professional management</ThemedText>
          </View>
        </View>
      </View>

      <Spacer />

      {/* Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]} 
          onPress={() => router.push('/login')}
        >
          <Feather name="log-in" size={20} color="#fff" />
          <ThemedText style={styles.loginButtonText}>Login</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.registerButton]} 
          onPress={() => router.push('/roleChoice')}
        >
          <Feather name="user-plus" size={20} color={Colors.primary} />
          <ThemedText style={styles.registerButtonText}>Register</ThemedText>
        </TouchableOpacity>
      </View>

      <Spacer />

      {/* Footer */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Manage your veterinary practice efficiently
        </ThemedText>
      </View>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  taglineContainer: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  taglineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  taglineText: {
    fontSize: 14,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  loginButton: {
    backgroundColor: Colors.primary,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  registerButtonText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
    textAlign: 'center',
  },
})