
// FIX: Explicitly import Request and Response types from express to resolve type conflicts.
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// FIX: Use explicit Request and Response types from express to make `res.status` available.
export const getMe = async (req: Request, res: Response) => {
  // In a real app, the user ID would come from the decoded JWT token in authMiddleware
  // const userId = req.user.id;
  const userId = 'u1'; // Mocking authenticated user for now

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ msg: 'Server error' });
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