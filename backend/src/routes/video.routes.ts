
import { Router } from 'express';
import { getFeed, uploadVideo } from '../controllers/video.controller';
// import { authMiddleware } from '../middleware/auth';
// import { upload } from '../middleware/upload'; // Middleware for handling file uploads

const router = Router();

// @route   GET api/v1/videos/feed
// @desc    Get video feed
// @access  Private
router.get('/feed', /* authMiddleware, */ getFeed);

// @route   POST api/v1/videos/upload
// @desc    Upload a video
// @access  Private
router.post('/upload', /* authMiddleware, upload.single('video'), */ uploadVideo);

export default router;
