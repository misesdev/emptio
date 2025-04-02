
export const formatCurrency = (value: number, currency: string = "USD", multiple: number = 100) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    })

    return formatter.format(value / multiple)
}



