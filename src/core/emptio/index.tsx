import env from "@/env"
import axios from "axios"

export type EmptioMessage = {
    type: "alert" | "instruction" | "regular",
    message: string,
}

export type EmptioData = {
    developers?: string[],
    securesellers?: string[],
    messages?: EmptioMessage[]
}

const getInitalData = async (): Promise<EmptioData> => {
    const response = await axios.get(`${env.emptio.host}/index.json`)

    if (response.status === 200)
        return response.data

    return {}
}

export const emptioService = {
    getInitalData
}