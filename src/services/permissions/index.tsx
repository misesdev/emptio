import * as Notifications from "expo-notifications"

export const getNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync()
    if (status != 'granted') {
        const result = await Notifications.requestPermissionsAsync()
        return (result.status === 'granted')
    } else
        return true
}
