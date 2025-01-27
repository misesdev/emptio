/* import * as Notifications from "expo-notifications" */
import { ToastAndroid } from "react-native"
import { getNotificationPermission } from "../permissions"
import { Notifications, Notification } from "react-native-notifications"

// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: true
//     }),
// })

type NotificationProps = {
    title: string,
    subtitle?: string,
    message: string,
    date?: number
}

const pushNotificationMessage = async ({ title, subtitle, message, date = Date.now() }: NotificationProps) => {
    
    // await Notifications.scheduleNotificationAsync({
    //     content: { 
    //         title, 
    //         subtitle,
    //         body: message,
    //     },
    //     trigger: {
    //         type: Notifications.SchedulableTriggerInputTypes.DATE,
    //         date: date,
    //     },
    // })
    //
    // Notifications.postLocalNotification({ 
    //     body: "Local notification!",
    //     title: "Local Notification Title",
    //     sound: "chime.aiff",
    //     silent: false,
    //     category: "SOME_CATEGORY",
    //     userInfo: { },
    //     fireDate: new Date()
    // })
}

export const pushNotification = async (props: NotificationProps) => {

    if (await getNotificationPermission())
        await pushNotificationMessage(props)
    // else -> not permissioned
}

export const pushMessage = async (message: string) => {
    if(!!message.trim())
        ToastAndroid.show(message, ToastAndroid.BOTTOM)
}



