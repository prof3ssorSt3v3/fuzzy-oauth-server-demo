import 'dotenv/config';
//connect to the database
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
//load the drizzle connector for the specific postgres driver

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

export default db;
