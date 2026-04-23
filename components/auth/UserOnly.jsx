import { useRouter, useSegments } from "expo-router"
import { useUser } from "../../hooks/useUser"
import { useEffect } from "react"
import ThemedLoader from "../ThemedLoader"

const UserOnly = ({ children, allowedRoles = [] }) => {
    const { user, authChecked } = useUser()
    const router = useRouter()
    const segments = useSegments()

    useEffect(() => {
        if (!authChecked) return

        // If no user, redirect to auth
        if (!user) {
            router.replace('/login')
            return
        }

        // If roles are specified
        if (allowedRoles.length > 0) {
            const userRole = user.role?.toLowerCase()
            const allowedRolesLower = allowedRoles.map(r => r.toLowerCase())
            
            // Check if user has allowed role
            if (!allowedRolesLower.includes(userRole)) {
                // Redirect based on their actual role
                if (userRole === 'vet') {
                    // They are a vet but trying to access non-vet area
                    // This shouldn't happen, but just in case
                    if (!segments.includes('(vetDashboard)')) {
                        router.replace('/(vetDashboard)/animals')
                    }
                } else if (userRole === 'owner') {
                    router.replace('/(ownerDashboard)/animals')
                } else {
                    router.replace('/auth')
                }
                return
            }
        }

        // User has correct role, allow access
    }, [user, authChecked])

    if (!authChecked) {
        return <ThemedLoader />
    }

    if (!user) {
        return <ThemedLoader />
    }

    // Final role check
    if (allowedRoles.length > 0) {
        const userRole = user.role?.toLowerCase()
        const allowedRolesLower = allowedRoles.map(r => r.toLowerCase())
        
        if (!allowedRolesLower.includes(userRole)) {
            return <ThemedLoader />
        }
    }

    return children
}

export default UserOnly