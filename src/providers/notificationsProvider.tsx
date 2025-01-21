
import { ReactElement, ReactNode, createContext, useContext, useState } from "react"
import { NotificationApp } from "../services/notification/application"

type NotificationContextType = {
    homeState: boolean,
    feedState: boolean,
    ordersState: boolean,
    messageState: boolean,
    setNotificationApp?: (bar: NotificationApp) => void
}

const SettingsContext = createContext<NotificationContextType>({ 
    messageState: false,
    homeState: false,
    feedState: false,
    ordersState: false
})

const useNotificationBar = (): NotificationContextType => useContext(SettingsContext)

const NotificationProvider = ({ children }: { children: ReactNode }): ReactElement => {

    const [homeState, setHomeState] = useState<boolean>(false)
    const [feedState, setFeedState] = useState<boolean>(false)
    const [ordersState, setOrdersState] = useState<boolean>(false)
    const [messageState, setMessageState] = useState<boolean>(false)

    const setNotificationApp = (state: NotificationApp) => {
        switch(state.type) {
            case "message": 
                setMessageState(state.state)            
                break
            case "feed": 
                setFeedState(state.state)
                break
            case "orders":
                setOrdersState(state.state)
                break
            case "home": 
                setHomeState(state.state) 
                break
        }
    }

    return (
        <SettingsContext.Provider value={{ messageState, feedState, ordersState, homeState, setNotificationApp }}>
            {children}
        </SettingsContext.Provider>
    )
}

export { NotificationProvider, useNotificationBar }
