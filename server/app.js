import 'dotenv/config';
import express from 'express';
import router from './routes/router.js';
import authRouter from './routes/authRoutes.js';

const app = express();

app.use('/', router);

app.use('/api', authRouter);

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});

export default app;