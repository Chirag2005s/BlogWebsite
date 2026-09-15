import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Takes the URI from ATLAS_URI or MONGO_URI or command line argument:
// Usage: node scripts/importToAtlas.js "mongodb+srv://user:pass@cluster0.mongodb.net/dbname"
const targetURI = process.argv[2] || process.env.ATLAS_URI || process.env.MONGO_URI;

if (!targetURI || targetURI.includes('localhost')) {
  console.error('\nUsage: node scripts/importToAtlas.js "<YOUR_MONGODB_ATLAS_CONNECTION_STRING>"');
  console.error('Example: node scripts/importToAtlas.js "mongodb+srv://admin:pass123@cluster0.xyz.mongodb.net/BlogWebsiteData"\n');
  process.exit(1);
}

const toObjectId = (val) => {
  if (!val) return val;
  if (typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val)) {
    return new mongoose.Types.ObjectId(val);
  }
  return val;
};

const toDate = (val) => {
  if (!val) return val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? val : d;
};

const sanitizeDoc = (colName, rawDoc) => {
  const doc = { ...rawDoc };

  if (doc._id) {
    doc._id = toObjectId(doc._id);
  }

  if (doc.createdAt) doc.createdAt = toDate(doc.createdAt);
  if (doc.updatedAt) doc.updatedAt = toDate(doc.updatedAt);
  if (doc.publishedAt) doc.publishedAt = toDate(doc.publishedAt);

  if (colName === 'articles') {
    if (doc.author) doc.author = toObjectId(doc.author);
    if (doc.category) doc.category = toObjectId(doc.category);
    if (Array.isArray(doc.tags)) {
      doc.tags = doc.tags.map(toObjectId);
    }
    if (Array.isArray(doc.likedBy)) {
      doc.likedBy = doc.likedBy.map(toObjectId);
    }
    if (Array.isArray(doc.readers)) {
      doc.readers = doc.readers.map(toObjectId);
    }
  }

  return doc;
};

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
    console.log(`Connected to target database: ${mongoose.connection.host}/${mongoose.connection.name}`);

    const db = mongoose.connection.db;

    for (const [colName, docs] of Object.entries(backup)) {
      if (Array.isArray(docs) && docs.length > 0) {
        const sanitizedDocs = docs.map((doc) => sanitizeDoc(colName, doc));
        console.log(`Importing ${sanitizedDocs.length} documents into "${colName}"...`);
        // Remove existing to avoid duplicate key errors
        await db.collection(colName).deleteMany({});
        await db.collection(colName).insertMany(sanitizedDocs);
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

