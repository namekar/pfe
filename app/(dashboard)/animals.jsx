import { StyleSheet, FlatList, Pressable } from 'react-native'

import { useAnimals } from '../../hooks/useAnimals'
import { Colors } from '../../constants/colors'
import Spacer from "../../components/Spacer"
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import ThemedCard from "../../components/ThemedCard"

const Animals = () => {
    const {animals} =useAnimals()
  return (
    <ThemedView style={styles.container} safe={true}>

        <Spacer />
        <ThemedText title={true} style={styles.heading}>
          Your Animal List
        </ThemedText>
        <Spacer/>
        <FlatList
            data={animals}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={styles.list}
            renderItem={({item})=>(
                <Pressable>
                    <ThemedCard style={styles.card}>
                        <ThemedText style={styles.name}>
                            {item.name}
                        </ThemedText>
                        <ThemedText >
                            owner is {item.owner}
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
    justifyContent: "center",
    alignItems: "stretch",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  list:{
    marginTop: 40
  },
  card:{
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4
  },
  name: {
    fontSize:20,
    fontWeight: "bold",
    marginBottom: 10,
  },
})