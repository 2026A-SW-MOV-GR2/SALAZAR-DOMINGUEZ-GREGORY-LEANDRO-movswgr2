import { InMemoryRecordRepository } from '../InMemoryRecordRepository';
import { RepositoryController } from '../RepositoryController';

const sampleItem = {
  id: '1',
  title: 'Registro A',
  note: 'Contenido A',
  createdAt: 1000,
};

describe('RepositoryController', () => {
  it('saves data only in the active repository', async () => {
    const sqliteRepository = new InMemoryRecordRepository();
    const nosqlRepository = new InMemoryRecordRepository();
    const controller = new RepositoryController(sqliteRepository, nosqlRepository);

    await controller.init();
    await controller.save(sampleItem);

    expect(await sqliteRepository.getAll()).toHaveLength(1);
    expect(await nosqlRepository.getAll()).toHaveLength(0);

    controller.setMode('nosql');
    await controller.save({ ...sampleItem, id: '2', title: 'Registro B' });

    expect(await sqliteRepository.getAll()).toHaveLength(1);
    expect(await nosqlRepository.getAll()).toHaveLength(1);
  });

  it('switches backend and reads the correct source immediately', async () => {
    const sqliteRepository = new InMemoryRecordRepository([{ ...sampleItem }]);
    const nosqlRepository = new InMemoryRecordRepository([{ ...sampleItem, id: '9', title: 'NoSQL' }]);
    const controller = new RepositoryController(sqliteRepository, nosqlRepository);

    await controller.init();
    expect((await controller.getAll())[0].title).toBe('Registro A');

    controller.setMode('nosql');
    expect((await controller.getAll())[0].title).toBe('NoSQL');
  });
});
