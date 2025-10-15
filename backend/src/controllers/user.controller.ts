import { Request, Response } from 'express';
import { mockUsers } from '../data';

// Get current user's profile (simulated)
export const getMe = async (req: Request, res: Response) => {
  // In a real app, the user ID would come from the decoded JWT token
  // const userId = req.user.id;
  // For simulation, we'll use a hardcoded ID, e.g., the first user.
  const userId = 'u1';
  console.log(`Fetching profile for current user: ${userId}`);

  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ msg: 'User not found' });
  }

  res.status(200).json(user);
};

// Update current user's profile (simulated)
export const updateMe = async (req: Request, res: Response) => {
  const { username, bio } = req.body;
  // const userId = req.user.id;
  const userId = 'u1'; // Mock user ID
  console.log(`Updating profile for user ${userId} with:`, { username, bio });

  const userIndex = mockUsers.findIndex(u => u.id === userId);

  if (userIndex === -1) {
      return res.status(404).json({ msg: 'User not found' });
  }

  const updatedUser = { ...mockUsers[userIndex], username, bio };
  mockUsers[userIndex] = updatedUser;
  
  res.status(200).json(updatedUser);
};

// Get user profile by username
export const getUserProfile = async (req: Request, res: Response) => {
  const { username } = req.params;
  console.log(`Fetching profile for username: ${username}`);
  
  const user = mockUsers.find(u => u.username === username);

  if (!user) {
      return res.status(404).json({ msg: 'User not found' });
  }

  // Return a public version of the profile (omitting sensitive data)
  const publicProfile = {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      totalLikes: user.totalLikes,
      isVerified: user.isVerified,
  };

  res.status(200).json(publicProfile);
};