import { createContext, useEffect, useState } from "react";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { useUser } from "../hooks/useUser";
import { client, databases } from "../lib/appwrite";

const DATABASE_ID = "69b9f57d000b139ece20"
const COLLECTION_ID = "animals"
const OWNER_COLLECTION_ID = "owners"

export const AnimalsContext = createContext()

export function AnimalsProvider({ children }){
    const [animals, setAnimals] = useState([])
    const {user} = useUser()
    const [owners, setOwners] = useState([])

    async function fetchAnimals(){
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
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

    async function fetchOwners(){
        try {
            const res = await databases.listDocuments(
                DATABASE_ID,
                OWNER_COLLECTION_ID,
                [Query.equal('vetId', user.$id)]
            )

            setOwners(res.documents)
        } catch (error){
            console.log(error.message)
        }
    }

    async function createOwner(data){
        try {
            if (!user) throw new Error("User not ready")

            const owner = await databases.createDocument(
                DATABASE_ID,
                OWNER_COLLECTION_ID,
                ID.unique(),
                {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    address: data.address || "", // Add address field
                    vetId: user.$id
                }
            )

            setOwners(prev => [owner, ...prev])

            return owner

        } catch (error){
            console.error("CREATE OWNER ERROR:", error)
            return null
        }
    }

    async function createAnimal(data){
        try{
            const newAnimal = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    ...data,
                    OwnerId: data.OwnerId,
                    VetId: user.$id
                },
                [
                    Permission.read(Role.user(user.$id)),
                    Permission.update(Role.user(user.$id)),
                    Permission.delete(Role.user(user.$id))
                ]
            )
            
            // Refresh animals list after creation
            await fetchAnimals()
            return newAnimal
            
        }catch (error){
            console.error(error.message)
        }
    }

    async function updateAnimal(id, data){
        try{
            const updatedAnimal = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id,
                {
                    ...data,
                    OwnerId: data.OwnerId,
                    VetId: user.$id
                }
            )
            
            // Update local state
            setAnimals(prev => prev.map(animal => 
                animal.$id === id ? updatedAnimal : animal
            ))
            
            return updatedAnimal
            
        }catch (error){
            console.error("UPDATE ANIMAL ERROR:", error.message)
            throw error
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
            fetchOwners() // Also fetch owners when user loads

            unsubscribe = client.subscribe(channel, (response) => {
                const { payload, events } = response
                console.log("event", events)
                console.log("this is the payload", payload)

                if (events[0].includes("create")) {
                    setAnimals((prevAnimals) => [...prevAnimals, payload])
                }

                if (events[0].includes("update")) {
                    setAnimals((prevAnimals) => 
                        prevAnimals.map((animal) => 
                            animal.$id === payload.$id ? payload : animal
                        )
                    )
                }

                if (events[0].includes("delete")) {
                    setAnimals((prevAnimals) => prevAnimals.filter((animal) => animal.$id !== payload.$id))
                }
            })

        } else {
            setAnimals([])
            setOwners([])
        }

        return () => {
            if (unsubscribe) unsubscribe()
        }

    }, [user])
    
    return (
        <AnimalsContext.Provider 
            value={{
                animals, 
                fetchAnimals, 
                fetchAnimalById, 
                createAnimal, 
                updateAnimal,  // Add this
                DeleteAnimal, 
                owners, 
                fetchOwners,
                createOwner
            }}
        >
            {children}
        </AnimalsContext.Provider>
    )
}