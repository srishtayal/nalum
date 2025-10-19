import express from 'express';
import pool from '../db/postgres.js';

const router = express.Router();

router.post('/verify', async (req, res) => {
  const { alumniId, email } = req.body;

  if (!alumniId || !email) {
    return res.status(400).json({ error: 'alumniId and email are required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM alumni WHERE alumni_id = $1 AND email = $2',
      [alumniId, email]
    );

    if (result.rows.length > 0) {
      return res.json({ verified: true, data: result.rows[0] });
    } else {
      return res.json({ verified: false });
    }
  } catch (err) {
    console.error('Error verifying alumni:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
