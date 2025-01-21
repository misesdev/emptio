
export type TypeCategory = "message" | "home" | "orders" | "feed"

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
