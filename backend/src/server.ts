// FIX: Changed express import to a namespace import to correctly handle types for Request and Response.
import * as express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import videoRoutes from './routes/video.routes';
import livestreamRoutes from './routes/livestream.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Use a more explicit CORS configuration to prevent "Failed to fetch" errors from the browser.
// This allows requests from any origin and specifies the methods and headers the backend will accept.
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/videos', videoRoutes);
app.use('/api/v1/livestreams', livestreamRoutes);

// Use the imported Request and Response types for the route handler to ensure correct types.
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('BuzzCast API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});