import AsyncStorage from '@react-native-async-storage/async-storage';
import {RecordRepository} from './RecordRepository';
import {RecordItem} from './types';

const STORAGE_KEY = 'examen_proyecto_records_v1';

export class NoSqlRecordRepository implements RecordRepository {
  async init() {
    return undefined;
  }

  async getAll(): Promise<RecordItem[]> {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    return JSON.parse(rawValue) as RecordItem[];
  }

  async save(item: RecordItem): Promise<void> {
    const items = await this.getAll();
    const index = items.findIndex(current => current.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.unshift(item);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  async delete(id: string): Promise<void> {
    const items = await this.getAll();
    const filteredItems = items.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
  }
}