const { ObjectId } = require('mongodb');
const { getDB } = require('../utils/db');

const COLLECTION_NAME = 'reviews';

const reviewsCollection = () => getDB().collection(COLLECTION_NAME);

// Schema structure (for reference, MongoDB is schemaless)
// {
//   _id: ObjectId,
//   bookingId: ObjectId,
//   serviceId: ObjectId,
//   customerId: ObjectId,
//   providerId: ObjectId,
//   rating: Number (1-5),
//   comment: String,
//   providerResponse: String (optional),
//   createdAt: Date
// }

module.exports = {
  reviewsCollection,
  COLLECTION_NAME,
};
