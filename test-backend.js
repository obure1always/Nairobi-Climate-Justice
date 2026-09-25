const fs = require('fs');

async function testBackend() {
  console.log('Testing Registration...');
  const regRes = await fetch('http://localhost:3001/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ageGroup: '20-25', location: 'Kibera', educationStatus: 'College', gender: 'Female' })
  });
  
  if (!regRes.ok) throw new Error('Registration failed');
  const { participantId } = await regRes.json();
  console.log('Registered! Participant ID:', participantId);

  console.log('Testing Sync...');
  const syncRes = await fetch('http://localhost:3001/api/v1/sync', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${participantId}`
    },
    body: JSON.stringify({
      records: [
        {
          clientEventId: 'test-event-1',
          entityType: 'PROGRESS',
          entityData: { moduleId: '1', completedLessons: [0, 1], completed: true }
        },
        {
          clientEventId: 'test-event-2',
          entityType: 'ASSESSMENT',
          entityData: { questionId: 'q1', answer: '4' }
        }
      ]
    })
  });
  
  if (!syncRes.ok) throw new Error('Sync failed: ' + await syncRes.text());
  const syncData = await syncRes.json();
  console.log('Sync Successful:', syncData);

  console.log('Testing Admin Export...');
  const exportRes = await fetch('http://localhost:3001/api/v1/admin/export', {
    headers: { 'Authorization': 'Bearer ADMIN-TEST' }
  });
  const exportData = await exportRes.json();
  console.log(`Found ${exportData.participants.length} participants.`);
  console.log(`Found ${exportData.progress.length} progress records.`);
  console.log(`Found ${exportData.assessments.length} assessment records.`);
}

testBackend().catch(console.error);
