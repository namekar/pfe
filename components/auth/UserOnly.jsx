import { useRouter, useSegments } from "expo-router"
import { useUser } from "../../hooks/useUser"
import { useEffect } from "react"
import ThemedLoader from "../ThemedLoader"

const UserOnly = ({ children }) => {
    const { user, authChecked } = useUser()
    const router = useRouter()
    const segments = useSegments()

    useEffect(() => {
        if (!authChecked) return

        // If no user, redirect to auth
        if (!user) {
            router.replace('/auth')
            return
        }

        // Check if user has vet role
        const userRole = user.role?.toLowerCase()
        
        if (userRole !== 'vet') {
            router.replace('/auth')
            return
        }

    }, [user, authChecked])

    if (!authChecked) {
        return <ThemedLoader />
    }

    if (!user) {
        return <ThemedLoader />
    }

    // Final role check
    const userRole = user.role?.toLowerCase()
    if (userRole !== 'vet') {
        return <ThemedLoader />
    }

    return children
}

export default UserOnly