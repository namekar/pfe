import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { Tabs, usePathname, router, Stack } from "expo-router"
import { useColorScheme, Platform, Pressable, View, StyleSheet } from "react-native"
import { Colors } from "../../../constants/colors"
import ThemedText from "../../../components/ThemedText"
import UserOnly from "../../../components/auth/UserOnly"

export default function DashboardLayout() {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  const pathname = usePathname()

  // Web view - Stack navigation with custom navbar
  if (Platform.OS === 'web') {
    return (
      <UserOnly>
        <View style={[styles.webContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.navbar, { backgroundColor: theme.navBackground, borderBottomColor: theme.border || '#E5E5E5' }]}>
            <View style={styles.navbarContent}>
              <Pressable onPress={() => router.push('/animals')} style={styles.logoContainer}>
                <Ionicons name="paw" size={28} color={theme.primary || Colors.light.primary} />
                <ThemedText style={[styles.logoText, { color: theme.text }]}>vetora</ThemedText>
              </Pressable>
              
              <View style={styles.navLinks}>
                <Pressable
                  onPress={() => router.push('/animals')}
                  style={({ pressed }) => [
                    styles.navLink,
                    pathname === '/animals' && [styles.navLinkActive, { borderBottomColor: theme.primary }],
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <Ionicons 
                    name={pathname === '/animals' ? 'paw' : 'paw-outline'} 
                    size={20} 
                    color={pathname === '/animals' ? theme.primary : theme.iconColor} 
                  />
                  <ThemedText style={[
                    styles.navLinkText,
                    pathname === '/animals' && [styles.navLinkTextActive, { color: theme.primary }]
                  ]}>
                    Animals
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/VetIntelAI')}
                  style={({ pressed }) => [
                    styles.navLink,
                    pathname === '/VetIntelAI' && [styles.navLinkActive, { borderBottomColor: theme.primary }],
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <MaterialCommunityIcons 
                    name={pathname === '/VetIntelAI' ? 'robot-brain' : 'robot-brain-outline'} 
                    size={20} 
                    color={pathname === '/VetIntelAI' ? theme.primary : theme.iconColor} 
                  />
                  <ThemedText style={[
                    styles.navLinkText,
                    pathname === '/VetIntelAI' && [styles.navLinkTextActive, { color: theme.primary }]
                  ]}>
                    VetIntel
                  </ThemedText>
                </Pressable>

                <Pressable
                  onPress={() => router.push('/Profile')}
                  style={({ pressed }) => [
                    styles.navLink,
                    pathname === '/Profile' && [styles.navLinkActive, { borderBottomColor: theme.primary }],
                    pressed && { opacity: 0.7 }
                  ]}
                >
                  <Ionicons 
                    name={pathname === '/Profile' ? 'person' : 'person-outline'} 
                    size={20} 
                    color={pathname === '/Profile' ? theme.primary : theme.iconColor} 
                  />
                  <ThemedText style={[
                    styles.navLinkText,
                    pathname === '/Profile' && [styles.navLinkTextActive, { color: theme.primary }]
                  ]}>
                    Profile
                  </ThemedText>
                </Pressable>
              </View>

              <View style={styles.rightSection} />
            </View>
          </View>
          
          <View style={styles.content}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="animals" />
              <Stack.Screen name="VetIntelAI" />
              <Stack.Screen name="Profile" />
              <Stack.Screen name="animals/[id]" />
            </Stack>
          </View>
        </View>
      </UserOnly>
    )
  }

  // Mobile view - Bottom tabs
  return (
    <UserOnly>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: theme.navBackground, paddingTop: 10, height: 90 },
          tabBarActiveTintColor: theme.iconColorFocused,
          tabBarInactiveTintColor: theme.iconColor,
        }}
      >
        <Tabs.Screen 
          name="animals"
          options={{ 
            title: "Animals", 
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                size={24} 
                name={focused ? 'paw' : 'paw-outline'} 
                color={focused ? theme.iconColorFocused : theme.iconColor} 
              />
            )
          }}
        />
        <Tabs.Screen 
          name="VetIntelAI"
          options={{ 
            title: "VetIntel", 
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons 
                size={24} 
                name={focused ? 'robot-brain' : 'robot-brain-outline'} 
                color={focused ? theme.iconColorFocused : theme.iconColor} 
              />
            )
          }}
        />
        <Tabs.Screen 
          name="Profile"
          options={{ 
            title: "Profile", 
            tabBarIcon: ({ focused }) => (
              <Ionicons 
                size={24} 
                name={focused ? 'person' : 'person-outline'} 
                color={focused ? theme.iconColorFocused : theme.iconColor} 
              />
            )
          }}
        />
        <Tabs.Screen name="animals/[id]" options={{ href: null }} />
      </Tabs>
    </UserOnly>
  )
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
  },
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  navbarContent: {
    maxWidth: 1200,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    cursor: 'pointer',
  },
  navLinkActive: {
    borderBottomColor: Colors.light.primary,
  },
  navLinkText: {
    fontSize: 16,
    fontWeight: '500',
  },
  navLinkTextActive: {
    fontWeight: '600',
  },
  rightSection: {
    width: 40,
  },
  content: {
    flex: 1,
  },
})