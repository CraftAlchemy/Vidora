import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /api/v1/users/:username
export const getUserProfile = async (req: Request, res: Response) => {
  const { username } = req.params;
  try {
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true,
            followers: true,
            following: true,
            totalLikes: true,
            isVerified: true,
            level: true,
            xp: true,
            streakCount: true,
            badges: true,
            commentPrivacySetting: true,
            followingIds: true,
            likedVideoIds: true,
        }
    });

    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error fetching profile for ${username}:`, error);
    res.status(500).json({ msg: 'Server error while fetching profile.' });
  }
};

// PUT /api/v1/users/:id
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, bio, avatarUrl } = req.body;
    
    // In a real app, you would verify that the authenticated user's ID matches `id`.
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { username, bio, avatarUrl },
            include: {
                wallet: { include: { transactions: true } },
                creatorStats: true,
                badges: true,
                savedPaymentMethods: true,
            }
        });

        const { password, ...userToReturn } = updatedUser;
        res.status(200).json(userToReturn);
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        res.status(500).json({ msg: 'Server error during user update.' });
    }
};

// POST /api/v1/users/:id/toggle-follow
export const toggleFollow = async (req: Request, res: Response) => {
    const { id: userToFollowId } = req.params;
    const { currentUserId } = req.body;

    if (!currentUserId) {
        return res.status(400).json({ msg: 'currentUserId is required' });
    }
    if (currentUserId === userToFollowId) {
        return res.status(400).json({ msg: 'User cannot follow themselves' });
    }

    try {
        const currentUser = await prisma.user.findUnique({ where: { id: currentUserId } });
        const userToFollow = await prisma.user.findUnique({ where: { id: userToFollowId } });

        if (!currentUser || !userToFollow) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const isFollowing = currentUser.followingIds?.includes(userToFollowId);

        await prisma.$transaction([
            // Update current user's following list
            prisma.user.update({
                where: { id: currentUserId },
                data: {
                    followingIds: isFollowing
                        ? { set: currentUser.followingIds.filter(id => id !== userToFollowId) }
                        : { push: userToFollowId },
                    following: { [isFollowing ? 'decrement' : 'increment']: 1 }
                }
            }),
            // Update followed user's followers count
            prisma.user.update({
                where: { id: userToFollowId },
                data: {
                    followers: { [isFollowing ? 'decrement' : 'increment']: 1 }
                }
            })
        ]);

        res.status(200).json({ success: true, isFollowing: !isFollowing });

    } catch (error) {
        console.error(`Error toggling follow for user ${userToFollowId}:`, error);
        res.status(500).json({ msg: 'Server error during follow action.' });
    }
}
