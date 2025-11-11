// backend/scripts/peek.mjs
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

const names = ['users', 'services', 'bookings', 'reviews'];

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(); // uses DB from your URI

  console.log('DB name:', db.databaseName);

  for (const n of names) {
    const count = await db.collection(n).countDocuments();
    console.log(`${n}: ${count}`);
  }

  const sample = await db.collection('services').find().limit(3).toArray();
  console.log('Sample services:', sample);
  await client.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
