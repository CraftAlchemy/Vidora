// FIX: Imported Request and Response directly from express to resolve type conflicts.
// FIX: Changed to a default express import to use explicit express.Request/Response types, fixing property access errors.
// FIX: Explicitly import Request and Response types from express to resolve type conflicts.
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// In a real app, you'd use bcrypt, jwt
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// FIX: Use express.Request and express.Response types to resolve type conflicts.
// FIX: Use explicit Request and Response types from express.
export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email or username already exists' });
    }
    
    // In a real app, hash password here with bcrypt
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        // password: hashedPassword, // Use hashed password in production
        avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
        role: 'user',
        status: 'active',
        isVerified: false,
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
    });

    // In a real app, generate JWT here
    res.status(201).json({
      token: 'mock_jwt_token_on_register',
      user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// FIX: Use express.Request and express.Response types to resolve type conflicts.
// FIX: Use explicit Request and Response types from express.
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // In a real app, compare hashed password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ msg: 'Invalid credentials' });
    // }

    // In a real app, generate JWT here
    res.status(200).json({
      token: 'mock_jwt_token_on_login',
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error during login' });
  }
};