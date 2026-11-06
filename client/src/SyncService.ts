import { db, type SyncQueueItem } from './db';
import { apiUrl } from './lib/api';

export class SyncService {
  private static syncPromise: Promise<void> | null = null;

  static async queueRecord(
    entityType: SyncQueueItem['entityType'],
    entityData: object,
    ownerId = localStorage.getItem('climate_justice_owner_id') || '',
    clientEventId = crypto.randomUUID()
  ) {
    if (!ownerId) throw new Error('Cannot queue a learning event without an active owner');
    await db.syncQueue.add({
      clientEventId,
      ownerId,
      entityType,
      entityData,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    if (navigator.onLine) void this.syncNow(ownerId);
  }

  static syncNow(activeOwnerId = localStorage.getItem('climate_justice_owner_id') || ''): Promise<void> {
    if (!navigator.onLine || !activeOwnerId) return Promise.resolve();
    if (this.syncPromise) {
      return this.syncPromise.then(() => this.syncNow(activeOwnerId));
    }
    this.syncPromise = this.performSync(activeOwnerId).finally(() => {
      this.syncPromise = null;
    });
    return this.syncPromise;
  }

  private static async performSync(activeOwnerId: string) {
    const authToken = localStorage.getItem('climate_justice_token')
      || sessionStorage.getItem('climate_justice_token');
    const authenticatedUserId = localStorage.getItem('climate_justice_user_id');
    if (!authToken || authenticatedUserId !== activeOwnerId) return;

    try {
      await db.syncQueue.where('ownerId').equals(activeOwnerId)
        .and(record => record.status === 'syncing')
        .modify({ status: 'pending' });
      const pendingRecords = await db.syncQueue.where('ownerId').equals(activeOwnerId)
        .and(record => record.status === 'pending' || record.status === 'failed')
        .toArray();
      if (pendingRecords.length === 0) return;

      await Promise.all(pendingRecords.map(record =>
        record.id === undefined ? Promise.resolve() : db.syncQueue.update(record.id, { status: 'syncing' })
      ));

      const response = await fetch(apiUrl('/sync'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          records: pendingRecords.map(({ clientEventId, ownerId, entityType, entityData, createdAt }) => ({
            clientEventId,
            ownerId,
            entityType,
            entityData,
            createdAt
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Sync endpoint returned ${response.status}`);
      }

      const result: { processedIds?: unknown } = await response.json();
      const processedIds = new Set(
        Array.isArray(result.processedIds)
          ? result.processedIds.filter((id): id is string => typeof id === 'string')
          : []
      );
      const savedRecords = pendingRecords.filter(record => processedIds.has(record.clientEventId));
      const unacknowledgedRecords = pendingRecords.filter(record => !processedIds.has(record.clientEventId));

      await db.transaction('rw', db.syncQueue, async () => {
        await db.syncQueue.bulkDelete(savedRecords.flatMap(record => record.id === undefined ? [] : [record.id]));
        await Promise.all(unacknowledgedRecords.map(record =>
          record.id === undefined ? Promise.resolve() : db.syncQueue.update(record.id, { status: 'pending' })
        ));
      });
      if (savedRecords.length) {
        window.dispatchEvent(new CustomEvent('climate-justice-sync-complete', {
          detail: { clientEventIds: savedRecords.map(record => record.clientEventId) }
        }));
        window.dispatchEvent(new Event('climate-justice-data-changed'));
      }
    } catch (error) {
      console.error('Offline sync failed; events remain queued for retry', error);
      await db.syncQueue.where('ownerId').equals(activeOwnerId)
        .and(record => record.status === 'syncing')
        .modify({ status: 'pending' });
    }
  }
}

window.addEventListener('online', () => {
  void SyncService.syncNow();
});
