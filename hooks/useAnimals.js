import { useContext } from "react";
import { AnimalsContext } from '../contexts/AnimalsContext'

export function useAnimals() {
    const context = useContext(AnimalsContext)

    if (!context) {
        throw new Error ("useUser must be used within a UserProvider")
    }

    return context 
}