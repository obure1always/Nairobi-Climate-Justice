import express from 'express';
import cors from 'cors';
import { sequelize, setupDb, Participant, Module, ModuleProgress, SyncRecord, AssessmentResponse } from './models/index';

const app = express();
app.use(cors());
app.use(express.json());

// Fake Auth Middleware for the prototype
const requireAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  req.participantId = token.replace('Bearer ', '');
  next();
};

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto; line-height: 1.6;">
        <h1>Climate Justice Nairobi API</h1>
        <p>The backend is running successfully. API endpoints are at <code>/api/v1</code>.</p>
        <div style="padding: 20px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
          <h3>Test Admin Export (FR08)</h3>
          <p>Click the button below to simulate an authenticated admin request to the export endpoint.</p>
          <button onclick="fetchExport()" style="padding: 10px 16px; background: #15803d; color: white; border: none; border-radius: 4px; cursor: pointer;">Download Dataset</button>
          <pre id="output" style="margin-top: 16px; padding: 16px; background: #111827; color: #e5e7eb; border-radius: 4px; overflow: auto; max-height: 400px; display: none;"></pre>
        </div>
        <script>
          async function fetchExport() {
            const out = document.getElementById('output');
            out.style.display = 'block';
            out.textContent = 'Fetching...';
            try {
              // Simulating an authenticated request from the researcher
              const res = await fetch('/api/v1/admin/export', {
                headers: { 'Authorization': 'Bearer KIB-ADMIN-TEST' }
              });
              const data = await res.json();
              out.textContent = JSON.stringify(data, null, 2);
            } catch(err) {
              out.textContent = 'Error: ' + err.message;
            }
          }
        </script>
      </body>
    </html>
  `);
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register a new participant
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const { ageGroup, location, educationStatus, gender } = req.body;
    const id = 'KIB-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const participant = await Participant.create({ id, ageGroup, location, educationStatus, gender });
    res.json({ participantId: participant.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get modules
app.get('/api/v1/modules', async (req, res) => {
  try {
    const modules = await Module.findAll({ order: [['order', 'ASC']] });
    res.json(modules);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Synchronize offline progress and assessments
app.post('/api/v1/sync', requireAuth, async (req: any, res: any) => {
  const { records } = req.body;
  const participantId = req.participantId;
  const processedIds: string[] = [];
  const failedIds: string[] = [];

  const transaction = await sequelize.transaction();
  try {
    for (const record of records) {
      const { clientEventId, entityType, entityData } = record;
      
      // Idempotency check
      const existing = await SyncRecord.findOne({ where: { clientEventId }, transaction });
      if (existing) {
        processedIds.push(clientEventId);
        continue;
      }

      await SyncRecord.create({
        participantId,
        clientEventId,
        entityType,
        entityData,
        status: 'processed'
      }, { transaction });

      // Process specific entity changes
      if (entityType === 'PROGRESS') {
        const { moduleId, completedLessons, completed } = entityData;
        const [progress] = await ModuleProgress.findOrCreate({
          where: { participantId, moduleId },
          defaults: { completedLessons, completed, lastAccessed: new Date(), participantId, moduleId },
          transaction
        });
        if (completedLessons > progress.completedLessons) {
          progress.completedLessons = completedLessons;
        }
        if (completed) progress.completed = true;
        progress.lastAccessed = new Date();
        await progress.save({ transaction });
      } else if (entityType === 'ASSESSMENT') {
        const { questionId, answer } = entityData;
        await AssessmentResponse.create({
          participantId,
          questionId,
          answer
        }, { transaction });
      }
      processedIds.push(clientEventId);
    }
    
    await transaction.commit();
    res.json({ processedIds, failedIds });
  } catch (err: any) {
    await transaction.rollback();
    res.status(500).json({ error: err.message });
  }
});

// Admin export endpoint (FR08)
app.get('/api/v1/admin/export', requireAuth, async (req: any, res: any) => {
  try {
    const participants = await Participant.findAll();
    const progress = await ModuleProgress.findAll();
    const assessments = await AssessmentResponse.findAll();
    
    // In a real scenario we might stream this or convert to CSV
    // Returning JSON for the pilot
    res.json({
      participants,
      progress,
      assessments
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const seedModules = async () => {
  const count = await Module.count();
  if (count === 0) {
    await Module.bulkCreate([
      { order: 1, title: 'Nairobi Climate Risk', description: 'Understand the climate risks affecting Nairobi' },
      { order: 2, title: 'Urban Flooding', description: 'How flooding impacts our communities and how to prepare' },
      { order: 3, title: 'Heat & Health', description: 'The effects of extreme heat on health and what to do' },
      { order: 4, title: 'Water Stress & Disease Prevention', description: 'Managing water shortages and preventing diseases' },
      { order: 5, title: 'Climate Justice', description: 'Understanding unequal impacts and responsibilities' },
      { order: 6, title: 'Green Claims', description: 'How to evaluate environmental claims and information' },
      { order: 7, title: 'Safe Civic Participation', description: 'Safe and lawful ways to participate in civic action' },
    ]);
  }
};

const PORT = process.env.PORT || 3001;

export const startServer = async () => {
  await setupDb();
  await seedModules();
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer().catch(console.error);
}

export default app;
