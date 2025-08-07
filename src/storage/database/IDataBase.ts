import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

interface IDataBase {
    getConnection(): Promise<SQLiteDatabase>;
    //insertEntity(query: string, params: any[]):  Promise<SQLiteRunResult>;
    deleteByCondition(condition: string, args: any[]) : Promise<void>;
    delete(primary: string) : Promise<void>;
    clear() : Promise<void>;
}

export default IDataBase
