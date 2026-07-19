export type StorageMode = 'sqlite' | 'nosql';

export type RecordItem = {
  id: string;
  title: string;
  note: string;
  createdAt: number;
};