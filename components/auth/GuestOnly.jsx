import { useRouter } from "expo-router"
import { useUser } from "../../hooks/useUser"
import { useEffect } from "react"
import ThemedLoader from "../ThemedLoader"

const GuestOnly = ({ children }) => {
    const { user, authChecked } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (authChecked && user !== null){
            // Only redirect vets, owners are not allowed anymore
            if(user.role?.toLowerCase() === "vet"){
                router.replace('/(vetDashboard)/animals')
            } else {
                // If any other role, redirect to auth
                router.replace('/auth')
            }
        }
    }, [user, authChecked])
    
    if (!authChecked || user){
        return <ThemedLoader />
    }
    
    return children
}

export default GuestOnly