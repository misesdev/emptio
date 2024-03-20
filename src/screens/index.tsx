import { useEffect, useState } from "react";
import SplashScreen from "../components/general/SplashScreen";

const Initialize = ({ navigation } : any) => {

    const [loading, setLoading] = useState(false)

    useEffect(() => {

    }, [])

    if(loading)
        return <SplashScreen />

    return (
        <>
        
        </>
    )
}

export default Initialize;