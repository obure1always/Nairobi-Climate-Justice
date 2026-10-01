import { db } from './db';

const API_URL = 'http://localhost:3001/api/v1';

export class SyncService {
  static async queueRecord(entityType: 'PROGRESS' | 'ASSESSMENT', entityData: any) {
    const clientEventId = crypto.randomUUID();
    await db.syncQueue.add({
      clientEventId,
      entityType,
      entityData,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    // Attempt sync immediately if online
    if (navigator.onLine) {
      this.syncNow();
    }
  }

  static async syncNow() {
    if (!navigator.onLine) return;
    const participantId = localStorage.getItem('participantId');
    if (!participantId) return;

    const pendingRecords = await db.syncQueue.where('status').equals('pending').toArray();
    if (pendingRecords.length === 0) return;

    // Mark as syncing
    await Promise.all(pendingRecords.map(r => db.syncQueue.update(r.id!, { status: 'syncing' })));

    try {
      const response = await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${participantId}`
        },
        body: JSON.stringify({ records: pendingRecords })
      });

      if (!response.ok) throw new Error('Sync failed');

      const { processedIds } = await response.json();
      
      // Delete successfully processed records from queue
      const processedRecords = pendingRecords.filter(r => processedIds.includes(r.clientEventId));
      await db.syncQueue.bulkDelete(processedRecords.map(r => r.id!));
      
    } catch (error) {
      console.error('Offline sync failed, will retry later:', error);
      // Revert status to pending for retry
      await Promise.all(pendingRecords.map(r => db.syncQueue.update(r.id!, { status: 'pending' })));
    }
  }
}

// Add event listeners for network changes
window.addEventListener('online', () => {
  console.log('Back online. Attempting sync...');
  SyncService.syncNow();
});
