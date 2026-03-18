import { createContext, useEffect, useState } from "react";
import { databases,client } from "../lib/appwrite";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";

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
                    Query.equal('userId',user.$id)
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
                {...data, userId: user.$id},
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            )
        }catch (error){
            console.error(error.message)
        }
    }
    async function DeleteAnimal(id){
        try{

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