import * as Notifications from "expo-notifications"
import { ToastAndroid } from "react-native"
import { getNotificationPermission } from "../permissions"

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
    date?: number
}

const pushNotificationMessage = async ({ title, message, date = Date.now() }: NotificationProps) => {
    await Notifications.scheduleNotificationAsync({
        content: { title, body: message },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: date
        },
    })
}

export const pushNotification = async (props: NotificationProps) => {

    if (await getNotificationPermission())
        await pushNotificationMessage(props)
    // else -> not permissioned
}

export const pushMessage = async (message: string) => {
    ToastAndroid.show(message, ToastAndroid.BOTTOM)
}



