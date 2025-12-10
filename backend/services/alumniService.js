import axios from 'axios';

const ALUMNI_SERVICE_URL = process.env.ALUMNI_SERVICE_URL || 'http://localhost:4001';

export async function verifyAlumni(alumniId, email) {
  try {
    const res = await axios.post(`${ALUMNI_SERVICE_URL}/alumni/verify`, {
      alumniId,
      email
    });
    return res.data;
  } catch (err) {
    console.error('Error contacting alumni service:', err);
    throw err;
  }
}
