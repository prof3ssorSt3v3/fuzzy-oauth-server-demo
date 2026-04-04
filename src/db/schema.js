import { integer, pgTable as table, varchar, timestamp } from 'drizzle-orm/pg-core';

export const sessions = table('sessions', {
  session_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  google_id: varchar({ length: 30 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull(),
  created_at: timestamp().defaultNow(),
});
