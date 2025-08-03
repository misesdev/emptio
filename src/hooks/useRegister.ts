import { useTranslateService } from "@src/providers/translateProvider"
import { useAuth } from "@src/context/AuthContext"
import { pushMessage } from "@services/notification"
import UserService from "@services/user/UserService"
import { Utilities } from "@src/utils/Utilities"
import AuthService from "@services/auth/AuthService"
import { User } from "@services/user/types/User"
import { useState } from "react"

const useRegister = () => {

    const { login } = useAuth()
    const authService = new AuthService()
    const userService = new UserService()
    const [userName, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const { useTranslate } = useTranslateService()

    const setUserName = (value: string) => {
        setDisabled(value.trim().length < 3)
        setName(value)
    }

    const onRegister = async () => {
        if (userName.trim())
        {
            setLoading(true)
            setDisabled(true)

            const results = await userService.searchUser({
                searchTerm: userName.trim(),
                limit: 1
            })
          
            if(results.some(u => Utilities.getUserName(u).trim() == userName.trim())) 
            {
                setLoading(false)
                setDisabled(false)
                return pushMessage(`${useTranslate("register.already_exists")} ${userName.trim()}`)
            }

            await registerUser()

            setDisabled(false)
            setLoading(false)
        }
    }

    const registerUser = async () => {
        const result = await authService.signUp(userName.trim())

        if (result.success) login(result.data as User)
        if (!result.success) { 
            pushMessage(`${useTranslate("message.request.error")} ${result.message}`)
        }
    }

    return {
        loading,
        disabled,
        onRegister,
        userName,
        setUserName
    }
}

export default useRegister

