import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import verifyRoutes from './routes/VerifyRoutes.js';
import morgan from 'morgan'; // <-- CORRECT: Use import instead of require

dotenv.config();
const app = express();

app.use(morgan("dev")); // This line is perfect as it is
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🎓 Alumni Service API is running');
});

app.use('/alumni', verifyRoutes);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`🚀 Alumni Service running on port ${PORT}`));
