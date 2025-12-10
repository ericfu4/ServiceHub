// seed/seedReviews.js
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, closeDB, getDB } from '../utils/db.js';
import { readSeedFile } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function synthReviews(n = 150, services = [], users = []) {
  const reviews = [];
  for (let i = 0; i < n && i < services.length; i++) {
    const service = faker.helpers.arrayElement(services);
    const customer = faker.helpers.arrayElement(users);

    reviews.push({
      serviceId: service._id,
      customerId: customer._id,
      providerId: service.providerId,
      rating: faker.number.int({ min: 3, max: 5 }),
      comment: faker.lorem.sentences(2),
      providerResponse: Math.random() > 0.7 ? faker.lorem.sentence() : null,
      createdAt: faker.date.past({ years: 1 }),
    });
  }
  return reviews;
}

export async function seedReviews({ limit = 0 } = {}) {
  try {
    await connectDB(); // Connect first!
    const db = getDB();
    const reviews = db.collection('reviews');

    const services = await db.collection('services').find({}).toArray();
    const users = await db.collection('users').find({}).toArray();

    if (!services.length || !users.length) {
      throw new Error('Need services + users before seeding reviews.');
    }

    const dataPath = path.join(__dirname, 'data', 'reviews.json');
    let rows = await readSeedFile(dataPath);

    if (!rows) rows = synthReviews(150, services, users);

    const docs = (limit ? rows.slice(0, limit) : rows).map((r) => ({
      serviceId: new ObjectId(
        r.serviceId || faker.helpers.arrayElement(services)._id
      ),
      customerId: new ObjectId(
        r.customerId || faker.helpers.arrayElement(users)._id
      ),
      providerId: new ObjectId(
        r.providerId || faker.helpers.arrayElement(services).providerId
      ),
      rating: Number(r.rating ?? faker.number.int({ min: 1, max: 5 })),
      comment: r.comment || faker.lorem.sentences(2),
      providerResponse:
        r.providerResponse ||
        (Math.random() > 0.7 ? faker.lorem.sentence() : null),
      createdAt: r.createdAt
        ? new Date(r.createdAt)
        : faker.date.past({ years: 1 }),
    }));

    // Don't delete - just add more reviews
    const result = await reviews.insertMany(docs, { ordered: false });
    const inserted = result.insertedCount;
    console.log(`✅ Inserted ${inserted} reviews`);
    return inserted;
  } catch (err) {
    console.error('❌ Error seeding reviews:', err.message);
    return 0;
  } finally {
    await closeDB(); // Close connection
  }
}
