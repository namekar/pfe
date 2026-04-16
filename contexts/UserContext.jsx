import { createContext, useEffect, useState } from "react";
import { ID } from "react-native-appwrite";
import { account, databases } from "../lib/appwrite";
import { Text } from "react-native";
export const UserContext = createContext()
const DATABASE_ID = "69b9f57d000b139ece20"
const USER_ID = "users"

export function UserProvider({children}){
    const [user, setUser] = useState(null)
    const [authChecked, setAuthChecked] = useState(false)

    async function login(email, password) {

        try {
            await account.createEmailPasswordSession( email, password)
            const response = await account.get()
            const userDoc = await databases.getDocument(
                DATABASE_ID,
                USER_ID,
                response.$id
            )
            setUser({
                ...response,
                role: userDoc.role
            })
        } catch (error) {
            console.log(error.message)
        }
    }
    async function register(email, password,radio,name) {
        try {
            await account.create(ID.unique(), email, password)
            await account.createEmailPasswordSession(email, password)
            const user = await account.get()
            await databases.createDocument(
                DATABASE_ID,
                USER_ID,
                user.$id,
                {
                    userId: user.$id,
                    name: name,
                    email: email,
                    role: radio
                }
            )
            setUser({ ...user,
                role: radio
            })
            

        } catch (error) {
            console.log(error.message)
        }
    }
    async function logout() {
        await account.deleteSession("current")
        setUser(null)
        
    }
    async function getInitialUserValue(){
        try{
            const response = await account.get()
            const userDoc = await databases.getDocument(
                DATABASE_ID,
                USER_ID,
                response.$id
            )
            setUser({ ...response,
                role: userDoc.role
            })
        }catch (error) {
            setUser(null)
        }finally{
            setAuthChecked(true )
        }
    }
    useEffect(()=>{
        getInitialUserValue()
    },[])
    return (
        <UserContext.Provider value={{user, login, register, logout, authChecked}}>
            {children}
        </UserContext.Provider>
    )
}