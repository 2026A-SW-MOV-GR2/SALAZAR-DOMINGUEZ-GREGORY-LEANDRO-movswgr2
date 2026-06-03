import {log} from '../logger';
import {RecordRepository} from './RecordRepository';
import {RecordItem, StorageMode} from './types';

export class RepositoryController {
  private mode: StorageMode = 'sqlite';

  constructor(
    private readonly sqliteRepository: RecordRepository,
    private readonly nosqlRepository: RecordRepository,
  ) {}

  setMode(mode: StorageMode) {
    this.mode = mode;
    log('INFO', 'Storage mode changed', {mode});
  }

  getMode() {
    return this.mode;
  }

  private get activeRepository() {
    return this.mode === 'sqlite' ? this.sqliteRepository : this.nosqlRepository;
  }

  async init() {
    await this.sqliteRepository.init();
    await this.nosqlRepository.init();
  }

  async getAll() {
    return this.activeRepository.getAll();
  }

  async save(item: RecordItem) {
    log('DEBUG', 'Saving record', {mode: this.mode, id: item.id});
    await this.activeRepository.save(item);
  }

  async delete(id: string) {
    log('DEBUG', 'Deleting record', {mode: this.mode, id});
    await this.activeRepository.delete(id);
  }
}