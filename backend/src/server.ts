import express, { Request, Response } from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import videoRoutes from './routes/video.routes'
import livestreamRoutes from './routes/livestream.routes'
import uploadRoutes from './routes/upload.routes'
import paymentRoutes from './routes/payment.routes'

const app = express()
const PORT = process.env.PORT || 5000

// CORS config
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Middleware
app.use(express.json({ limit: '10mb' }))

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/videos', videoRoutes)
app.use('/api/v1/livestreams', livestreamRoutes)
app.use('/api/v1/uploads', uploadRoutes)
app.use('/api/v1/payments', paymentRoutes)

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('BuzzCast API is running 🚀')
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
