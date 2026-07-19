import { RecordRepository } from './RecordRepository';
import { RecordItem } from './types';

export class InMemoryRecordRepository implements RecordRepository {
  private items: RecordItem[] = [];

  constructor(initialItems: RecordItem[] = []) {
    this.items = [...initialItems];
  }

  async init(): Promise<void> {
    return undefined;
  }

  async getAll(): Promise<RecordItem[]> {
    return [...this.items];
  }

  async save(item: RecordItem): Promise<void> {
    const index = this.items.findIndex(current => current.id === item.id);
    if (index >= 0) {
      this.items[index] = item;
      return;
    }

    this.items.unshift(item);
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== id);
  }
}
