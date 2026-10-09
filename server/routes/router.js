import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to JobReady');
});

router.post('/api/register', (req, res) => {
    res.send('Register');
});

export default router;
