import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const records = [
    {
      id: 1,
      clientEventId: 'pending-event',
      ownerId: 'learner-a',
      entityType: 'PROGRESS',
      entityData: { moduleId: 'm1' },
      status: 'pending',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      clientEventId: 'interrupted-event',
      ownerId: 'learner-a',
      entityType: 'PROGRESS',
      entityData: { moduleId: 'm2' },
      status: 'syncing',
      createdAt: '2026-01-01T00:00:01.000Z'
    },
    {
      id: 3,
      clientEventId: 'other-learner-event',
      ownerId: 'learner-b',
      entityType: 'PROGRESS',
      entityData: { moduleId: 'm3' },
      status: 'pending',
      createdAt: '2026-01-01T00:00:02.000Z'
    }
  ];

  const makeCollection = (ownerId: string) => {
    const filters: Array<(record: typeof records[number]) => boolean> = [];
    const matches = (record: typeof records[number]) =>
      record.ownerId === ownerId && filters.every(filter => filter(record));
    const collection = {
      and(filter: (record: typeof records[number]) => boolean) {
        filters.push(filter);
        return collection;
      },
      async modify(changes: Partial<typeof records[number]>) {
        const selected = records.filter(matches);
        selected.forEach(record => Object.assign(record, changes));
        return selected.length;
      },
      async toArray() {
        return records.filter(matches).map(record => ({ ...record }));
      }
    };
    return collection;
  };

  const syncQueue = {
    where: vi.fn(() => ({
      equals: (ownerId: string) => makeCollection(ownerId)
    })),
    update: vi.fn(async (id: number, changes: Partial<typeof records[number]>) => {
      const record = records.find(item => item.id === id);
      if (record) Object.assign(record, changes);
    }),
    bulkDelete: vi.fn(async (ids: number[]) => {
      for (const id of ids) {
        const index = records.findIndex(record => record.id === id);
        if (index >= 0) records.splice(index, 1);
      }
    })
  };

  return {
    records,
    db: {
      syncQueue,
      transaction: vi.fn(async (_mode: string, _table: unknown, callback: () => Promise<void>) => callback())
    }
  };
});

vi.mock('./db', () => ({ db: mocks.db }));

import { SyncService } from './SyncService';

describe('SyncService', () => {
  beforeEach(() => {
    mocks.records.splice(0, mocks.records.length,
      {
        id: 1,
        clientEventId: 'pending-event',
        ownerId: 'learner-a',
        entityType: 'PROGRESS',
        entityData: { moduleId: 'm1' },
        status: 'pending',
        createdAt: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 2,
        clientEventId: 'interrupted-event',
        ownerId: 'learner-a',
        entityType: 'PROGRESS',
        entityData: { moduleId: 'm2' },
        status: 'syncing',
        createdAt: '2026-01-01T00:00:01.000Z'
      },
      {
        id: 3,
        clientEventId: 'other-learner-event',
        ownerId: 'learner-b',
        entityType: 'PROGRESS',
        entityData: { moduleId: 'm3' },
        status: 'pending',
        createdAt: '2026-01-01T00:00:02.000Z'
      }
    );
    localStorage.setItem('climate_justice_token', 'learner-a-token');
    localStorage.setItem('climate_justice_user_id', 'learner-a');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ processedIds: ['pending-event', 'interrupted-event'] })
    }));
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
  });

  it('syncs pending events for the signed-in owner without reusing filters or crossing accounts', async () => {
    await SyncService.syncNow('learner-a');

    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).toHaveBeenCalledOnce();
    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(body.records.map((record: { clientEventId: string }) => record.clientEventId))
      .toEqual(['pending-event', 'interrupted-event']);
    expect(mocks.records.map(record => record.clientEventId)).toEqual(['other-learner-event']);
  });
});
