// backend/utils/createIndexes.js
import { getDB } from './db.js';

async function safeCreateIndex(col, keys, options = {}) {
  try {
    // Always give indexes explicit names to avoid auto-name clashes
    const name =
      options.name ||
      Object.entries(keys)
        .map(([k, v]) => `${k}_${v}`)
        .join('_');

    await col.createIndex(keys, { name, ...options });
  } catch (err) {
    // Ignore "already exists / spec conflict" errors
    // 85 = IndexOptionsConflict (older servers)
    // 86 = IndexKeySpecsConflict (modern servers)
    if (err?.code === 85 || err?.code === 86) {
      console.warn(`Index creation warning: ${err.message}`);
      return;
    }
    throw err;
  }
}

export async function createIndexes() {
  const db = getDB();

  // --- services ---
  await safeCreateIndex(
    db.collection('services'),
    { title: 'text', description: 'text' },
    { name: 'title_text_description_text' }
  );
  await safeCreateIndex(db.collection('services'), { category: 1 });
  await safeCreateIndex(db.collection('services'), { providerId: 1 });
  await safeCreateIndex(db.collection('services'), { hourlyRate: 1 });
  await safeCreateIndex(db.collection('services'), { createdAt: -1 });

  // --- bookings ---
  await safeCreateIndex(db.collection('bookings'), { customerId: 1 });
  await safeCreateIndex(db.collection('bookings'), { providerId: 1 });
  await safeCreateIndex(db.collection('bookings'), { serviceId: 1 });
  await safeCreateIndex(db.collection('bookings'), { status: 1 });
  await safeCreateIndex(db.collection('bookings'), { date: 1 });
  await safeCreateIndex(db.collection('bookings'), { createdAt: -1 });

  // --- reviews ---
  await safeCreateIndex(db.collection('reviews'), { serviceId: 1 });
  await safeCreateIndex(db.collection('reviews'), { providerId: 1 });
  await safeCreateIndex(db.collection('reviews'), { customerId: 1 });
  await safeCreateIndex(db.collection('reviews'), { createdAt: -1 });

  // --- users ---
  await safeCreateIndex(
    db.collection('users'),
    { email: 1 },
    { unique: true, name: 'email_1' }
  );
  await safeCreateIndex(
    db.collection('users'),
    { username: 1 },
    { unique: true, name: 'username_1' }
  ); // <-- make it unique to match existing

  console.log('✅ Index setup complete (idempotent).');
}
