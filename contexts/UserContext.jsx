import { createContext, useEffect } from "react";
import { useState } from "react"
import {account, databases} from "../lib/appwrite"
import {ID} from "react-native-appwrite"
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
            setUser(response)
        } catch (error) {
            console.log(error.message)
        }
    }
    async function register(email, password,radio,name) {
        try {
            await account.create(ID.unique(), email, password,name)
            await login(email,password)
            const user = await account.get()
            await databases.createDocument(
                DATABASE_ID,
                USER_ID,
                user.$id,
                {
                    name: name,
                    email: email,
                    role: radio
                }
            )
            

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
            setUser(response)
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