import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { processOutfitSwap, processImageEdit } from './services/geminiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// API Endpoints

// Outfit Swap
app.post('/api/outfit-swap', async (req, res) => {
    try {
        const { target, outfit } = req.body;

        if (!target || !outfit) {
            return res.status(400).json({ error: 'Missing target or outfit image' });
        }

        const resultImage = await processOutfitSwap(target, outfit);
        return res.json({ image: resultImage });

    } catch (error) {
        console.error('Outfit Swap Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Edit Image
app.post('/api/edit-image', async (req, res) => {
    try {
        const { image, prompt } = req.body;

        if (!image || !prompt) {
            return res.status(400).json({ error: 'Missing image or prompt' });
        }

        const resultImage = await processImageEdit(image, prompt);
        return res.json({ image: resultImage });

    } catch (error) {
        console.error('Edit Image Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

// Serve Frontend (Production)
// Assuming client/dist is at ../client/dist relative to server/index.js
const clientDistPath = path.join(__dirname, '../client/dist');

app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
