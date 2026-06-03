import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {RecordRepository} from './RecordRepository';
import {RecordItem} from './types';

SQLite.enablePromise(true);

const DATABASE_NAME = 'examen_proyecto.db';

export class SqliteRecordRepository implements RecordRepository {
  private database: SQLiteDatabase | null = null;

  private async getDatabase() {
    if (!this.database) {
      this.database = await SQLite.openDatabase({name: DATABASE_NAME, location: 'default'});
    }

    return this.database;
  }

  async init(): Promise<void> {
    const database = await this.getDatabase();
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS records (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        note TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      );
    `);
  }

  async getAll(): Promise<RecordItem[]> {
    const database = await this.getDatabase();
    const [result] = await database.executeSql(
      'SELECT id, title, note, createdAt FROM records ORDER BY createdAt DESC',
    );

    const records: RecordItem[] = [];
    for (let index = 0; index < result.rows.length; index += 1) {
      records.push(result.rows.item(index) as RecordItem);
    }

    return records;
  }

  async save(item: RecordItem): Promise<void> {
    const database = await this.getDatabase();
    await database.executeSql(
      `INSERT OR REPLACE INTO records (id, title, note, createdAt) VALUES (?, ?, ?, ?)`,
      [item.id, item.title, item.note, item.createdAt],
    );
  }

  async delete(id: string): Promise<void> {
    const database = await this.getDatabase();
    await database.executeSql('DELETE FROM records WHERE id = ?', [id]);
  }
}