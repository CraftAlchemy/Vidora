
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        name: username, // Add the required 'name' field
        password: hashedPassword,
        // Add other default fields as per your schema
        role: 'user',
        status: 'active',
      },
    });

    const payload = { user: { id: newUser.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_default_secret', { expiresIn: '1h' });

    res.status(201).json({
      token,
      user: { id: newUser.id, email: newUser.email, username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_default_secret', { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: { id: user.id, email: user.email, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error during login' });
  }
};
