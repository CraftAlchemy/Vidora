
import { Router } from 'express';
import { register, login, googleLogin } from '../controllers/auth.controller';

const router = Router();

// @route   POST api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   POST api/v1/auth/google-login
// @desc    Authenticate user via Google Sign-In
// @access  Public
router.post('/google-login', googleLogin);

export default router;