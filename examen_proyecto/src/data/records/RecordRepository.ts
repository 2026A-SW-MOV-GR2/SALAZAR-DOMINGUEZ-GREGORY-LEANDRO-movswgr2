import {RecordItem} from './types';

export interface RecordRepository {
  init(): Promise<void>;
  getAll(): Promise<RecordItem[]>;
  save(item: RecordItem): Promise<void>;
  delete(id: string): Promise<void>;
}