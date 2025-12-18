const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.POSTGRESQL_DATABASE_URL;

if (!connectionString) {
	throw new Error('POSTGRESQL_DATABASE_URL is not set');
}

const pool = new Pool({
	connectionString,
	ssl: process.env.PGSSLMODE === 'require' || process.env.NODE_ENV === 'production'
		? { rejectUnauthorized: false }
		: false,
});

function describeConnection() {
	try {
		const u = new URL(connectionString);
		const db = u.pathname.replace(/^\//, '') || 'postgres';
		const host = u.hostname || 'localhost';
		const port = u.port || '5432';
		return `${host}:${port}/${db}`;
	} catch (_) {
		return 'postgres';
	}
}

console.log(`Postgres pool initialized for ${describeConnection()}`);

pool.on('error', (err) => {
	console.error('Postgres pool error (idle client):', err.message);
});

async function initPostgres() {
	const start = Date.now();
	console.log('Checking Postgres connection...');
	let client;
	try {
		client = await pool.connect();
		const res = await client.query('SELECT NOW()');
		const ms = Date.now() - start;
		console.log(`Postgres connected to ${describeConnection()} (t=${ms}ms)`);
		return res.rows?.[0]?.now ?? true;
	} catch (err) {
		console.error('Postgres connection check failed:', err.message);
		return false;
	} finally {
		if (client) client.release();
	}
}

module.exports.pool = pool;
module.exports.initPostgres = initPostgres;
