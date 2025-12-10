// seed/index.js
import 'dotenv/config';
import { seedUsers } from './seedUsers.js';
import { seedServices } from './seedServices.js';
import { seedReviews } from './seedReviews.js';

const SMALL = process.env.SEED_SMALL === '1';

console.log('🌱 Starting ServiceHub data seeding…\n');

(async () => {
  try {
    console.log('1️⃣  Seeding users…');
    await seedUsers({ limit: SMALL ? 50 : 450 });

    console.log('\n2️⃣  Seeding services…');
    await seedServices({ limit: SMALL ? 75 : 350 });

    console.log('\n4️⃣  Seeding reviews…');
    await seedReviews({ limit: SMALL ? 80 : 250 });

    console.log('\n✅ All data seeded successfully!');
  } catch (e) {
    console.error('\n❌ Seeding failed:', e.message);
    process.exit(1);
  }
})();
