import AsyncStorage from "@react-native-async-storage/async-storage"
import { User } from "../types"

export class UserStorage {
    static async get() : Promise<User> {
        let response: User = {}
        var data = await AsyncStorage.getItem("userdata")
        if(data)
            response = JSON.parse(data) as User
        return response
    }

    static async save(user: User) : Promise<void> {
        await AsyncStorage.setItem("userdata", JSON.stringify(user))
    }

    static async delete() : Promise<void> {
        await AsyncStorage.removeItem("userdata")
    }
}

