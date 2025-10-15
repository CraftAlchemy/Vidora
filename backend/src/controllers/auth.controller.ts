
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

// Functional registration with database
export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  // Basic validation
  if (!email || !username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
        return res.status(400).json({ msg: 'User with that email or username already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user in the database
    const newUser = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
            avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
            // Create associated models for the new user
            wallet: { create: { balance: 0 } },
            creatorStats: { create: { totalEarnings: 0, receivedGiftsCount: 0 } }
        },
        include: {
            wallet: true,
            creatorStats: true,
        }
    });

    // Create JWT token
    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' });

    // Exclude password from the returned user object
    const { password: _, ...userToReturn } = newUser;

    res.status(201).json({
        token,
        user: userToReturn,
    });
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ msg: 'Server error during registration.' });
  }
};

// Functional login with database
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            wallet: true,
            creatorStats: true,
            badges: true,
            savedPaymentMethods: true,
        }
    });

    if (!user) {
        return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    // Exclude password from the returned user object
    const { password: _, ...userToReturn } = user;

    res.status(200).json({
        token,
        user: userToReturn,
    });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ msg: 'Server error during login.' });
  }
};
