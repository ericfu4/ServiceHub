import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import {
  ensureServiceIndexes,
  createService,
  getService,
  updateService,
  deleteService,
  searchServices,
  listServicesByProvider,
} from '../models/services.js';
import { ObjectId } from 'mongodb';
import { getDB } from '../utils/db.js';

const router = Router();

router.post('/', authRequired, async (req, res, next) => {
  try {
    await ensureServiceIndexes();
    const svc = await createService({
      ...req.body,
      providerId: req.session.userId,
    });
    res.status(201).json({ service: svc });
  } catch (err) {
    next(err);
  }
});

// GET /api/services - Browse/search services
router.get('/', async (req, res, next) => {
  try {
    const { q, category, location, min, max, page, limit, providerId } =
      req.query;
    const result = await searchServices({
      q,
      category,
      location,
      min,
      max,
      page,
      limit,
      providerId,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/services/mine - Get current user's services
router.get('/mine', authRequired, async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const result = await listServicesByProvider(req.session.userId, {
      page,
      limit,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/services/:id - Get single service with provider info
// GET /api/services/:id - Get single service with provider info
router.get('/:id', async (req, res, next) => {
  try {
    const _id = new ObjectId(req.params.id);

    const [doc] = await getDB()
      .collection('services')
      .aggregate([
        { $match: { _id } },
        {
          $lookup: {
            from: 'users',
            localField: 'providerId',
            foreignField: '_id',
            as: 'provider',
            pipeline: [{ $project: { email: 1, username: 1 } }],
          },
        },
        {
          $addFields: {
            providerEmail: { $first: '$provider.email' },
            providerName: { $first: '$provider.username' },
          },
        },
        { $project: { provider: 0 } },
      ])
      .toArray();

    if (!doc) return res.status(404).json({ error: 'Service not found' });
    res.json({ service: doc });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authRequired, async (req, res, next) => {
  try {
    const updated = await updateService(
      req.params.id,
      req.session.userId,
      req.body || {}
    );
    if (!updated)
      return res.status(404).json({ error: 'Not found or not owner' });
    res.json({ service: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authRequired, async (req, res, next) => {
  try {
    const removed = await deleteService(req.params.id, req.session.userId);
    if (!removed)
      return res.status(404).json({ error: 'Not found or not owner' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
