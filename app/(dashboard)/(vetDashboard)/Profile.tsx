import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native'
import React from 'react'
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Colors } from "../../../constants/colors"
import { useUser } from '../../../hooks/useUser'
import { useAnimals } from '../../../hooks/useAnimals'
import ThemedView from '../../../components/ThemedView'
import Spacer from '../../../components/Spacer'
import ThemedText from '../../../components/ThemedText'
import ThemedCard from '../../../components/ThemedCard'

const Profile = () => {
  const { logout, user } = useUser()
  const { animals, owners } = useAnimals()
  const router = useRouter()

  // YOUR ORIGINAL WORKING LOGOUT LOGIC - KEPT EXACTLY THE SAME
  const handleLogout = () => {
    logout()
  }

  const userStats = {
    totalAnimals: animals?.length || 0,
    totalOwners: owners?.length || 0,
    memberSince: user?.$createdAt ? new Date(user.$createdAt).getFullYear() : '2024',
    lastActive: 'Today'
  }

  const mutedColor = '#6B887A'

  return (
    <ThemedView style={styles.container} safe={true}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer />
        
        {/* Header */}
        <View style={styles.header}>
          <ThemedText title={true} style={styles.heading}>
            Profile
          </ThemedText>
        </View>

        <Spacer />

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.userName}>
            {user?.name || user?.email?.split('@')[0] || 'User'}
          </ThemedText>
          <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
          <View style={styles.userRoleBadge}>
            <MaterialCommunityIcons name="stethoscope" size={14} color={Colors.primary} />
            <ThemedText style={styles.userRoleText}>Veterinarian</ThemedText>
          </View>
        </View>

        <Spacer />

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <ThemedCard style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="users" size={20} color={Colors.primary} />
            </View>
            <ThemedText style={styles.statNumber}>{userStats.totalOwners}</ThemedText>
            <ThemedText style={styles.statLabel}>Owners</ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="paw" size={20} color={Colors.primary} />
            </View>
            <ThemedText style={styles.statNumber}>{userStats.totalAnimals}</ThemedText>
            <ThemedText style={styles.statLabel}>Animals</ThemedText>
          </ThemedCard>

          <ThemedCard style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Feather name="calendar" size={20} color={Colors.primary} />
            </View>
            <ThemedText style={styles.statNumber}>{userStats.memberSince}</ThemedText>
            <ThemedText style={styles.statLabel}>Member Since</ThemedText>
          </ThemedCard>
        </View>

        <Spacer />

        {/* Account Information Section */}
        <ThemedCard style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Feather name="user" size={20} color={Colors.primary} />
            <ThemedText style={styles.cardTitle}>Account Information</ThemedText>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="mail" size={16} color={mutedColor} />
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Email Address</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.email || 'Not set'}</ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="clock" size={16} color={mutedColor} />
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Account Created</ThemedText>
              <ThemedText style={styles.infoValue}>
                {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : 'Unknown'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="activity" size={16} color={mutedColor} />
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>Last Active</ThemedText>
              <ThemedText style={styles.infoValue}>{userStats.lastActive}</ThemedText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Feather name="hash" size={16} color={mutedColor} />
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoLabel}>User ID</ThemedText>
              <ThemedText style={[styles.infoValue, styles.monoText]} numberOfLines={1}>
                {user?.$id || 'Unknown'}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>

        <Spacer />

        {/* Settings Section */}
        <ThemedCard style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Feather name="settings" size={20} color={Colors.primary} />
            <ThemedText style={styles.cardTitle}>Settings</ThemedText>
          </View>

          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsIcon}>
              <Feather name="bell" size={18} color={mutedColor} />
            </View>
            <View style={styles.settingsContent}>
              <ThemedText style={styles.settingsLabel}>Notifications</ThemedText>
              <ThemedText style={styles.settingsDescription}>Manage your notification preferences</ThemedText>
            </View>
            <Feather name="chevron-right" size={18} color={mutedColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsIcon}>
              <Feather name="lock" size={18} color={mutedColor} />
            </View>
            <View style={styles.settingsContent}>
              <ThemedText style={styles.settingsLabel}>Privacy & Security</ThemedText>
              <ThemedText style={styles.settingsDescription}>Manage your privacy settings</ThemedText>
            </View>
            <Feather name="chevron-right" size={18} color={mutedColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsIcon}>
              <Feather name="help-circle" size={18} color={mutedColor} />
            </View>
            <View style={styles.settingsContent}>
              <ThemedText style={styles.settingsLabel}>Help & Support</ThemedText>
              <ThemedText style={styles.settingsDescription}>Get help or contact support</ThemedText>
            </View>
            <Feather name="chevron-right" size={18} color={mutedColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsRow}>
            <View style={styles.settingsIcon}>
              <Feather name="info" size={18} color={mutedColor} />
            </View>
            <View style={styles.settingsContent}>
              <ThemedText style={styles.settingsLabel}>About</ThemedText>
              <ThemedText style={styles.settingsDescription}>App version: 1.0.0</ThemedText>
            </View>
            <Feather name="chevron-right" size={18} color={mutedColor} />
          </TouchableOpacity>
        </ThemedCard>

        <Spacer />

        {/* Logout Button - Using YOUR ORIGINAL SIMPLE LOGIC */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={20} color="#FF3B30" />
            <ThemedText style={styles.logoutText}>Logout</ThemedText>
          </TouchableOpacity>
        </View>

        <Spacer />
        <Spacer />
      </ScrollView>
    </ThemedView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B887A',
    marginBottom: 8,
  },
  userRoleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  userRoleText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B887A',
  },
  infoCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  settingsCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  infoIcon: {
    width: 32,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B887A',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  monoText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  settingsIcon: {
    width: 32,
  },
  settingsContent: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingsDescription: {
    fontSize: 12,
    color: '#6B887A',
  },
  logoutContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF3B30' + '10',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
})