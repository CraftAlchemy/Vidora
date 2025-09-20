// FIX: Changed 'import type' to a direct 'import' for Request and Response.
// This provides the correct Express types, making properties like `req.body`, `req.params`, and `res.status` available.
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// FIX: Use explicit Request and Response types from express to make `res.status` available.
export const getMe = async (req: Request, res: Response) => {
  // In a real app, the user ID would come from the decoded JWT token in authMiddleware
  const userId = 'u1'; // Mocking authenticated user for now

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      return res.status(200).json(user);
    }
    // If user not found in DB, try mock data
    console.warn(`User with ID '${userId}' not found in database. Falling back to mock data.`);
    const { mockUsers } = await import('../data');
    const mockUser = mockUsers.find(u => u.id === userId);
    if (mockUser) {
      return res.status(200).json(mockUser);
    }
    return res.status(404).json({ msg: 'User not found in DB or mocks' });

  } catch (error) {
    console.error('Error fetching current user from DB, falling back to mock data:', error);
    try {
        const { mockUsers } = await import('../data');
        const mockUser = mockUsers.find(u => u.id === userId);
        if (mockUser) {
          return res.status(200).json(mockUser);
        }
        return res.status(500).json({ msg: 'Server error and mock fallback failed' });
    } catch (fallbackError) {
        console.error('Mock fallback also failed:', fallbackError);
        return res.status(500).json({ msg: 'Server error' });
    }
  }
};

// FIX: Use explicit Request and Response types from express to make `req.body` and `res.status` available.
export const updateMe = async (req: Request, res: Response) => {
  const { username, bio, avatarUrl } = req.body;
  // const userId = req.user.id;
  const userId = 'u1'; // Mocking authenticated user

  const dataToUpdate: { username?: string; bio?: string, avatarUrl?: string } = {};
  if (username !== undefined) dataToUpdate.username = username;
  if (bio !== undefined) dataToUpdate.bio = bio;
  if (avatarUrl !== undefined) dataToUpdate.avatarUrl = avatarUrl;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// FIX: Use explicit Request and Response types from express to make `req.params` and `res.status` available.
export const getUserProfile = async (req: Request, res: Response) => {
  const { username } = req.params;
  
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};