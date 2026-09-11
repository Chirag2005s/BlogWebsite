import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Takes the URI from ATLAS_URI or MONGO_URI or command line argument:
// Usage: node scripts/importToAtlas.js "mongodb+srv://user:pass@cluster0.mongodb.net/dbname"
const targetURI = process.argv[2] || process.env.ATLAS_URI || process.env.MONGO_URI;

if (!targetURI || targetURI.includes('localhost')) {
  console.error('\nUsage: node scripts/importToAtlas.js "<YOUR_MONGODB_ATLAS_CONNECTION_STRING>"');
  console.error('Example: node scripts/importToAtlas.js "mongodb+srv://admin:pass123@cluster0.xyz.mongodb.net/blogsWebsiteData"\n');
  process.exit(1);
}

async function importData() {
  try {
    const backupPath = path.join(__dirname, '..', 'localDataBackup.json');
    if (!fs.existsSync(backupPath)) {
      console.error(`Backup file not found at: ${backupPath}. Run 'node scripts/exportLocalData.js' first.`);
      process.exit(1);
    }

    const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    console.log('Connecting to MongoDB Atlas target...');
    await mongoose.connect(targetURI);
    console.log('Connected to target database!');

    const db = mongoose.connection.db;

    for (const [colName, docs] of Object.entries(backup)) {
      if (Array.isArray(docs) && docs.length > 0) {
        console.log(`Importing ${docs.length} documents into "${colName}"...`);
        // Remove existing to avoid duplicate key errors
        await db.collection(colName).deleteMany({});
        await db.collection(colName).insertMany(docs);
        console.log(`Done inserting into "${colName}".`);
      }
    }

    console.log('\nAll local data successfully migrated to MongoDB Atlas!');
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
}

importData();
