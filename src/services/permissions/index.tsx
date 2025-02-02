import { PermissionsAndroid, Platform } from "react-native"
import { Notifications } from "react-native-notifications"

export const getNotificationPermission = async () => {
    // const { status } = Notifications.
    // if (status != 'granted') {
    //     const result = Notifications.requestPermissionsAsync()
    //     return (result.status === 'granted')
    // } else
        return true
}

export const getGaleryPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      )
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true
}
