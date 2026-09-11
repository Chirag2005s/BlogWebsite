import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LOCAL_URI = 'mongodb://localhost:27017/blogsWebsiteData';

async function exportData() {
  try {
    console.log('Connecting to local MongoDB:', LOCAL_URI);
    await mongoose.connect(LOCAL_URI);
    console.log('Connected to local MongoDB!');

    const db = mongoose.connection.db;
    const collections = ['users', 'articles', 'categories', 'tags'];
    const backup = {};

    for (const name of collections) {
      try {
        const docs = await db.collection(name).find({}).toArray();
        backup[name] = docs;
        console.log(`Exported ${docs.length} documents from "${name}"`);
      } catch (err) {
        console.warn(`Could not export "${name}":`, err.message);
      }
    }

    const outputPath = path.join(__dirname, '..', 'localDataBackup.json');
    fs.writeFileSync(outputPath, JSON.stringify(backup, null, 2));
    console.log(`\nSuccessfully exported data to: ${outputPath}`);
    process.exit(0);
  } catch (err) {
    console.error('Export failed:', err.message);
    process.exit(1);
  }
}

exportData();
