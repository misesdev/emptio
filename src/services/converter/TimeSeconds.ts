
export class TimeSeconds
{
    public static minute: number = 60;
    public static hour: number = 3600;
    public static day: number = 86400;
    public static week: number = 604800;
   
    public static now() 
    {
        return Math.floor(Date.now() / 1000)
    }

    public static without(days: number) 
    {
        return Math.floor(Date.now() / 1000) - (days * this.day)
    }

    public static toString(timestamp: number) {
        const now = this.now();
        const diff = now - timestamp;
        const date = new Date(timestamp * 1000);

        const isToday = (time: Date, now: Date) => (
            time.getFullYear() == now.getFullYear() &&
            time.getMonth() == now.getMonth() &&
            time.getDay() == now.getDay()
        )
        const isYesterday = (time: Date, now: Date) => (
            time.getFullYear() == now.getFullYear() &&
            time.getMonth() == now.getMonth() &&
            (time.getDay()+1) == now.getDay()
        )

        const getTime = (date: Date) => {
            const hour = date.getHours().toString()
            const minutes = date.getMinutes().toString()
            return `${hour}:${minutes.length < 2 ? "0"+minutes : minutes}`
        }

        if (diff < this.hour) return `now ${getTime(date)}`;
        if (isToday(date, new Date(this.now() * 1000))) return `today ${getTime(date)}`;
        if (isYesterday(date, new Date(this.now() * 1000))) return `yesterday ${getTime(date)}`;

        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    // public static toString(timestamp: number)
    // {
    //     let date = new Date(timestamp * 1000)
    //     return date.toLocaleString()
    // }
}
