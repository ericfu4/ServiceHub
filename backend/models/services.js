import { getDB } from '../utils/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION = 'services';

export async function ensureServiceIndexes() {
  const col = getDB().collection(COLLECTION);
  await col.createIndex({ title: 'text', description: 'text' });
  await col.createIndex({ category: 1 });
  await col.createIndex({ providerId: 1 });
}

export async function createService(doc) {
  const col = getDB().collection(COLLECTION);
  const payload = {
    title: String(doc.title || '').trim(),
    description: String(doc.description || '').trim(),
    category: String(doc.category || '').trim(),
    hourlyRate: Number(doc.hourlyRate || 0),
    providerId: new ObjectId(doc.providerId),
    images: Array.isArray(doc.images) ? doc.images : [],
    availability: doc.availability || [], // [{ day:'Mon', start:'10:00', end:'14:00' }]
    status: 'active',
    isEmergency: !!doc.isEmergency,
    location: String(doc.location || '').trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const res = await col.insertOne(payload);
  return { _id: res.insertedId, ...payload };
}

export async function getService(id) {
  return getDB()
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
}

export async function updateService(id, providerId, patch) {
  const col = getDB().collection(COLLECTION);
  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(id), providerId: new ObjectId(providerId) },
    { $set: { ...patch, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return res.value;
}

export async function deleteService(id, providerId) {
  const col = getDB().collection(COLLECTION);
  const res = await col.findOneAndUpdate(
    { _id: new ObjectId(id), providerId: new ObjectId(providerId) },
    { $set: { status: 'deleted', updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  return res.value;
}

export async function searchServices({
  q = '',
  category,
  min = 0,
  max = 1e9,
  page = 1,
  limit = 12,
}) {
  const col = getDB().collection(COLLECTION);
  const filter = {
    status: 'active',
    hourlyRate: { $gte: Number(min), $lte: Number(max) },
  };
  if (category) filter.category = category;
  const pipeline = [];

  if (q && q.trim()) {
    pipeline.push({ $match: filter }, { $match: { $text: { $search: q } } });
  } else {
    pipeline.push({ $match: filter });
  }

  const skip = (Number(page) - 1) * Number(limit);
  pipeline.push(
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        items: [{ $skip: skip }, { $limit: Number(limit) }],
        total: [{ $count: 'count' }],
      },
    }
  );

  const [res] = await col.aggregate(pipeline).toArray();
  const total = res?.total?.[0]?.count || 0;
  return {
    items: res?.items || [],
    total,
    page: Number(page),
    limit: Number(limit),
  };
}
