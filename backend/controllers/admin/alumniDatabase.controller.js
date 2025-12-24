const { Pool } = require('pg');

// Create a new pool specifically for the alumni database
const alumniPool = new Pool({
  connectionString: process.env.POSTGRESQL_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Get all unique batches from alumni database
exports.getAlumniBatches = async (req, res) => {
  try {
    const sql = `SELECT DISTINCT passing_year as batch 
                 FROM alumni 
                 WHERE passing_year IS NOT NULL 
                 ORDER BY passing_year DESC`;

    const result = await alumniPool.query(sql);

    res.status(200).json({
      success: true,
      batches: result.rows.map(row => row.batch),
    });
  } catch (error) {
    console.error("Error fetching alumni batches:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching batches",
    });
  }
};

// Get alumni by batch with pagination
exports.getAlumniByBatch = async (req, res) => {
  try {
    const { batch } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const sql = `SELECT full_name as name, roll_no, passing_year as batch, branch 
                 FROM alumni 
                 WHERE passing_year = $1
                 ORDER BY full_name ASC 
                 LIMIT $2 OFFSET $3`;

    const countSql = `SELECT COUNT(*) as total FROM alumni WHERE passing_year = $1`;

    const [result, countResult] = await Promise.all([
      alumniPool.query(sql, [batch, parseInt(limit), parseInt(offset)]),
      alumniPool.query(countSql, [batch]),
    ]);

    res.status(200).json({
      success: true,
      data: result.rows || [],
      total: parseInt(countResult.rows[0]?.total || 0),
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error("Error fetching alumni by batch:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching alumni records",
    });
  }
};

// Search alumni database (existing functionality)
exports.searchAlumniDatabase = async (req, res) => {
  try {
    const { name, roll_no, batch, branch } = req.body;

    // Build dynamic query based on provided filters
    const whereParts = [];
    const values = [];

    if (name && name.trim() !== "") {
      whereParts.push(`full_name ILIKE $${values.length + 1}`);
      values.push(`%${name.trim()}%`);
    }
    
    if (roll_no && roll_no.trim() !== "") {
      whereParts.push(`roll_no ILIKE $${values.length + 1}`);
      values.push(`%${roll_no.trim()}%`);
    }
    
    if (batch && batch.trim() !== "") {
      whereParts.push(`passing_year = $${values.length + 1}`);
      values.push(batch.trim());
    }
    
    if (branch && branch.trim() !== "") {
      whereParts.push(`branch ILIKE $${values.length + 1}`);
      values.push(`%${branch.trim()}%`);
    }

    if (whereParts.length === 0) {
      return res.status(200).json({ success: true, matches: [] });
    }

    const sql = `SELECT full_name as name, roll_no, passing_year as batch, branch 
                 FROM alumni 
                 WHERE ${whereParts.join(" AND ")}
                 ORDER BY full_name ASC
                 LIMIT 100`;

    const result = await alumniPool.query(sql, values);

    res.status(200).json({
      success: true,
      matches: result.rows || [],
    });
  } catch (error) {
    console.error("Error searching alumni database:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while searching the database",
    });
  }
};
