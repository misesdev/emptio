import * as Notifications from "expo-notifications"
import { ToastAndroid } from "react-native"

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    }),
})

type NotificationProps = {
    title: string,
    message: string,
    time?: number
}

const notifyMessage = async ({ title, message, time }: NotificationProps) => {
    await Notifications.scheduleNotificationAsync({
        content: { title, body: message },
        trigger: time ? { seconds: time } : null,
    })
}

const getPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync()
    if (status != 'granted') {
        const result = await Notifications.requestPermissionsAsync()
        return (result.status === 'granted')
    } else
        return true
}

export const pushNotification = async (props: NotificationProps) => {

    if (await getPermission())
        await notifyMessage(props)
    // else -> not permissioned
}

export const pushMessage = async (message: string) => ToastAndroid.show(message, ToastAndroid.BOTTOM)



