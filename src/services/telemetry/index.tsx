
export type Response<T> = {
    success: boolean,
    message?: string,
    data?: T
}

export function trackException<T>(ex: any, data?: T) : Response<T> {

    // track the exception for server manager error

    console.log(ex)

    return { success: false, message: ex.toString(), data: data }
}

