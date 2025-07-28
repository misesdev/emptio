import { SQLiteDatabase, openDatabaseAsync, SQLiteRunResult } from 'expo-sqlite';

export abstract class Database 
{
    protected _table: string;
    protected _dbname: string;
    protected _primary: string;

    constructor(dbname: string, table: string, primary: string = "id") 
    {
        this._table = table
        this._dbname = dbname
        this._primary = primary
    }
    
    public async getConnection(): Promise<SQLiteDatabase> {
        return await openDatabaseAsync(this._dbname)
    }

    protected async insertEntity(query: string, params: any[]):  Promise<SQLiteRunResult> {
        const connection = await this.getConnection()
        return await connection.runAsync(query, params)
    }

    public async delete(primary: string) : Promise<void> {
        const connection = await this.getConnection()
        await connection.runAsync(`
            DELETE FROM ${this._table} WHERE ${this._primary} = ?;  
        `, [primary])
    }
    
    public async deleteByCondition(condition: string, args: any[]) : Promise<void> {
        const connection = await this.getConnection()
        await connection.runAsync(`
            UPDATE ${this._table} SET deleted = 1 WHERE ${condition};  
        `, args)
    }
        
    public async clear() : Promise<void> {
        const connection = await this.getConnection()
        await connection.execAsync(`DELETE FROM ${this._table};`)
    }
}
