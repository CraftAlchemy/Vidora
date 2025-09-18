

// FIX: Import express and use express.Request/Response to avoid type conflicts.
import express from 'express';
import prisma from '../lib/prisma';

// FIX: Use express.Request and express.Response types to resolve type conflicts.
export const getMe = async (req: express.Request, res: express.Response) => {
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

// FIX: Use express.Request and express.Response types to resolve type conflicts.
export const updateMe = async (req: express.Request, res: express.Response) => {
  const { username, bio } = req.body;
  // const userId = req.user.id;
  const userId = 'u1'; // Mocking authenticated user

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, bio },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// FIX: Use express.Request and express.Response types to resolve type conflicts.
export const getUserProfile = async (req: express.Request, res: express.Response) => {
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
