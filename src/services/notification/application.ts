
export type TypeCategory = "message" | "home" | "orders" | "feed" | "videos"

export type NotificationApp = {
    type: TypeCategory,
    state: boolean,
    message?: string
}

export type NotificationBar = {
    home?: boolean,
    messages?: boolean,
    orders?: boolean,
    feed?: boolean
}
