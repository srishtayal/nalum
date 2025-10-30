import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DB,
});

pool.connect()
  .then(() => console.log('✅ Connected to Postgres Database'))
  .catch(err => console.error('❌ Postgres Connection Error:', err));

export default pool;
