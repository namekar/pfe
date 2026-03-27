import { createContext, useEffect, useState } from "react";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";
import { client, databases } from "../lib/appwrite";

const DATABASE_ID = "69b9f57d000b139ece20"
const COLLECTION_ID = "69b9f6a7002b3b4a4811"

export const AnimalsContext = createContext()

export function AnimalsProvider({ children }){
    const [animals, setAnimals] = useState([])
    const {user} = useUser()

    async function fetchAnimals(){
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.equal('OwnerId',user.$id),
                    Query.equal('VetId',user.$id)
                ]
            )
            setAnimals(response.documents)
            console.log(response.documents)
        } catch (error){
            console.log(error.message)
        }
    }

    async function fetchAnimalById(id){
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            )
            return response
        } catch (error){
            console.error(error.message)
        }
    }
    async function createAnimal(data){
        try{
            const newAnimal = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {...data,
                    OwnerId: data.OwnerId ||  user.$id,
                    VetId: data.VetId || (user.role === "Vet" ? user.$id: null),
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            )
            setAnimals(prev => [...prev, newAnimal])
        }catch (error){
            console.error(error.message)
        }
    }
    async function DeleteAnimal(id){
        try{
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            )
            setAnimals(prev => prev.filter(animal => animal.$id !== id))
        }catch (error){
            console.error(error.message) 
        }
    }
    useEffect(() => {
    let unsubscribe
    const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`

    if (user) {
      fetchAnimals()

      unsubscribe = client.subscribe(channel, (response) => {
        const { payload, events } = response
        console.log("event",events)
        console.log("this is the payload",payload)

        if (events[0].includes("create")) {
          setAnimals((prevAnimals) => [...prevAnimals, payload])
        }

        if (events[0].includes("delete")) {
          setAnimals((prevAnimals) => prevAnimals.filter((animal) => animal.$id !== payload.$id))
        }
      })

    } else {
      setAnimals([])
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }

  }, [user])
    
    return (
        <AnimalsContext.Provider 
            value={{animals, fetchAnimals, fetchAnimalById, createAnimal, DeleteAnimal}}
        >
            {children}
        </AnimalsContext.Provider>
    )
}