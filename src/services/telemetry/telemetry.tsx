
export type Response = {
    success: boolean,
    message: string,
}

export const trackException = (ex: any) : Response => {

    // track the exception for server manager error

    console.log(ex)

    return { success: false, message: ex.toString() }
}

