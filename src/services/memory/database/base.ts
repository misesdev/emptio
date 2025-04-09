import * as SQLite from 'expo-sqlite';

export class Database {
    protected static database: SQLite.SQLiteDatabase; 

    protected static async getDatabaseConnection() : Promise<SQLite.SQLiteDatabase> {
        if(!this.database)
            this.database = await SQLite.openDatabaseAsync("events.db")
        return this.database
    }
}
