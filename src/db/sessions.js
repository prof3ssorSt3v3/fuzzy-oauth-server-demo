import db from '../db/connection.js';
import { sessions } from './schema.js';
import { eq, asc, desc } from 'drizzle-orm';

const createSession = async (user) => {
  console.log(user);
  const { googleId: google_id, email, name, avatar } = user;
  return await db.insert(sessions).values({ google_id, email, name, avatar }).returning();
};

const verifySession = async (user) => {
  console.log(user);
  const { id: google_id, email, name, avatar } = user;
  //find a match and return it
  return await db.select().from(sessions).where(eq('google_id', google_id)).orderBy(desc('create_at')).limit(1);
};

export { createSession, verifySession };
