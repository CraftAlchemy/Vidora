

// Using `import type` for Request and Response helps resolve type conflicts with other libraries or global types,
// ensuring that Express's specific extended types are used.
// FIX: Changed to a direct import to resolve type issues with express.json and res.send.
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

// The express.json() middleware is now correctly typed, resolving the overload error.
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 avatar uploads

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/livestreams', livestreamRoutes);
app.use('/api/v1/uploads', uploadRoutes);

// Using the correctly imported Response type makes `res.send` available.
app.get('/', (req: Request, res: Response) => {
    res.send('BuzzCast API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});