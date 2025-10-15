import { Request, Response } from 'express';
import { mockUsers } from '../data';

// In a real app, you'd use bcrypt, jwt, and your Prisma client
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// Placeholder register function
export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  // Basic validation
  if (!email || !username || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check if user already exists
  if (mockUsers.some(u => u.email === email)) {
      return res.status(400).json({ msg: 'User with that email already exists.' });
  }

  const newUser = {
      id: `u${Date.now()}`,
      username,
      email,
      // In a real app, you'd hash the password.
      // password: hashedPassword,
      avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
      role: 'user' as const,
      status: 'active' as const,
      isVerified: false,
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
  };

  // Add the new user to our in-memory "database"
  // @ts-ignore
  mockUsers.push(newUser);

  console.log('Registering user:', { email, username });

  // Mock response
  res.status(201).json({
    token: 'mock_jwt_token_on_register',
    user: newUser,
  });
};

// Functional mock login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  
  // Special admin login
  if (email === 'admin@vidora.app' && password === 'adminpassword') {
      const adminUser = mockUsers.find(u => u.email === 'admin@vidora.app' && u.role === 'admin');
      if (adminUser) {
          console.log('Admin user logged in:', { email });
          return res.status(200).json({
              token: 'mock-admin-jwt-token',
              user: adminUser,
          });
      }
  }

  // Regular user login
  const user = mockUsers.find(u => u.email === email);

  // In a real app, you would also use bcrypt.compare() to check the password
  if (!user) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }
  
  console.log('Logging in user:', { email });

  res.status(200).json({
    token: 'mock-user-jwt-token',
    user: user,
  });
};