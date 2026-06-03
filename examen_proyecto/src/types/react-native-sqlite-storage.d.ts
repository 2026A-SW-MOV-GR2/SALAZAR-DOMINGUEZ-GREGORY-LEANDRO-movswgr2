declare module 'react-native-sqlite-storage' {
  export interface SQLiteResultSetRowList {
    length: number;
    item(index: number): unknown;
  }

  export interface SQLiteResultSet {
    rows: SQLiteResultSetRowList;
  }

  export interface SQLiteDatabase {
    executeSql(sql: string, params?: readonly unknown[]): Promise<SQLiteResultSet[]>;
  }

  export interface OpenDatabaseParams {
    name: string;
    location: 'default' | 'Library';
  }

  export function enablePromise(value: boolean): void;
  export function openDatabase(params: OpenDatabaseParams): Promise<SQLiteDatabase>;

  const SQLite: {
    enablePromise: typeof enablePromise;
    openDatabase: typeof openDatabase;
  };

  export default SQLite;
}
