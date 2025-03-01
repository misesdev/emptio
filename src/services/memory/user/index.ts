import AsyncStorage from "@react-native-async-storage/async-storage"
import { User } from "./types"

export const getUser = async (): Promise<User> => {

    var response: User = {}

    var user = await AsyncStorage.getItem("userData")

    if (user)
        response = JSON.parse(user) as User

    return response
}

export const insertUpdateUser = async (userData: User) => await AsyncStorage.setItem("userData", JSON.stringify(userData))

export const deleteUser = async () => await AsyncStorage.removeItem("userData")
