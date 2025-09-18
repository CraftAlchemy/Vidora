import { Router } from 'express';
import { getUploadSignature } from '../controllers/upload.controller';

const router = Router();

// @route   GET api/v1/uploads/signature
// @desc    Get a signature for direct Cloudinary uploads
// @access  Private (should be protected by auth middleware)
router.get('/signature', getUploadSignature);

export default router;
