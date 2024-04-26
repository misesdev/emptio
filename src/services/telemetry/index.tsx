
export type Response<T> = {
    success: boolean,
    message: string,
    data?: T
}

export const trackException = (ex: any) : Response<any> => {

    // track the exception for server manager error

    console.log(ex)

    return { success: false, message: ex.toString() }
}

