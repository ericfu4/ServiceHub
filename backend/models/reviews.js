// backend/models/reviews.js (ESM)
import { getDB } from '../utils/db.js';

export const REVIEWS_COLLECTION = 'reviews';

export function reviewsCollection() {
  return getDB().collection(REVIEWS_COLLECTION);
}

// (Optional) helper to create useful indexes once
export async function ensureReviewIndexes() {
  const col = reviewsCollection();
  await col.createIndex({ serviceId: 1 });
  await col.createIndex({ providerId: 1 });
  await col.createIndex({ customerId: 1 });
  await col.createIndex({ createdAt: -1 });
}
