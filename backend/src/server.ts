
// FIX: Corrected express import to resolve type conflicts.
import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import videoRoutes from './routes/video.routes';
import livestreamRoutes from './routes/livestream.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Use a more explicit CORS configuration to prevent "Failed to fetch" errors from the browser.
// This allows requests from any origin and specifies the methods and headers the backend will accept.
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// FIX: This error was a symptom of incorrect express types. Correcting the import resolves this.
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 avatar uploads

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/livestreams', livestreamRoutes);
app.use('/api/v1/uploads', uploadRoutes);

// FIX: Use explicit Request and Response types from express to make `res.send` available.
app.get('/', (req: Request, res: Response) => {
    res.send('BuzzCast API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});