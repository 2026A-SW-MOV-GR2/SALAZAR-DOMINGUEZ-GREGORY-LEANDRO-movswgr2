import { InMemoryRecordRepository } from '../InMemoryRecordRepository';

const first = { id: '1', title: 'Uno', note: 'Nota uno', createdAt: 1 };
const updated = { id: '1', title: 'Uno editado', note: 'Nota editada', createdAt: 2 };

describe('InMemoryRecordRepository', () => {
  it('updates items with the same id', async () => {
    const repository = new InMemoryRecordRepository();

    await repository.save(first);
    await repository.save(updated);

    const items = await repository.getAll();
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Uno editado');
    expect(items[0].note).toBe('Nota editada');
  });

  it('deletes items by id', async () => {
    const repository = new InMemoryRecordRepository([first]);

    await repository.delete('1');

    expect(await repository.getAll()).toHaveLength(0);
  });
});
