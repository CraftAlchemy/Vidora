import { Router } from 'express';
import { updateUser, getUserProfile, toggleFollow } from '../controllers/user.controller';
// import { authMiddleware } from '../middleware/auth'; // A placeholder for auth middleware

const router = Router();

// @route   PUT api/v1/users/:id
// @desc    Update a user's profile
// @access  Private (should be protected by auth middleware)
router.put('/:id', /* authMiddleware, */ updateUser);

// @route   GET api/v1/users/:username
// @desc    Get user profile by username
// @access  Public
router.get('/:username', getUserProfile);

// @route   POST api/v1/users/:id/toggle-follow
// @desc    Follow or unfollow a user
// @access  Private
router.post('/:id/toggle-follow', /* authMiddleware, */ toggleFollow);

export default router;