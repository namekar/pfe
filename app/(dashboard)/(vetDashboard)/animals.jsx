import { FlatList, Pressable, StyleSheet, View } from 'react-native'
import { router } from 'expo-router'

import Spacer from "../../../components/Spacer"
import ThemedCard from "../../../components/ThemedCard"
import ThemedText from "../../../components/ThemedText"
import ThemedView from "../../../components/ThemedView"
import { Colors } from '../../../constants/colors'
import { useAnimals } from '../../../hooks/useAnimals'

const Animals = () => {
  const { animals } = useAnimals()

  return (
    <ThemedView style={styles.container} safe={true}>
      <Spacer />
      
      <ThemedText title={true} style={styles.heading}>
        Your Animal List
      </ThemedText>

      <Spacer />

      <FlatList
        data={animals}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/animals/${item.$id}`)}>
            <ThemedCard style={styles.card}>

              {/* Top row (name + status) */}
              <View style={styles.headerRow}>
                <ThemedText style={styles.name}>
                  {item.name}
                </ThemedText>

                <View style={styles.status}>
                  <ThemedText style={styles.statusText}>
                    Active
                  </ThemedText>
                </View>
              </View>

              {/* Species + Breed */}
              <ThemedText style={styles.meta}>
                {item.species || "Unknown"} 
                {item.breed ? ` • ${item.breed}` : ""}
              </ThemedText>

              {/* Extra info */}
              <ThemedText style={styles.meta}>
                {item.sex || "Unknown"}
                {item.age ? ` • ${item.age} yrs` : ""}
                {item.weight ? ` • ${item.weight} kg` : ""}
              </ThemedText>

              {/* Owner */}
              <ThemedText style={styles.owner}>
                Owner: {item.ownerName || item.OwnerId || "Unknown"}
              </ThemedText>

            </ThemedCard>
          </Pressable>
        )}
      />
    </ThemedView>
  )
}

export default Animals

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },

  heading: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },

  list: {
    marginTop: 20,
    paddingBottom: 40,
  },

  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4,
    borderRadius: 12,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  status: {
    backgroundColor: "#DAF6E1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1F8A47",
  },

  meta: {
    fontSize: 13,
    color: "#6B887A",
    marginTop: 6,
  },

  owner: {
    fontSize: 13,
    marginTop: 10,
    fontWeight: "500",
  },
})