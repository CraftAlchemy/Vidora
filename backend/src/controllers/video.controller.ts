
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET /api/v1/videos/feed
export const getFeed = async (req: Request, res: Response) => {
    try {
        const videos = await prisma.video.findMany({
            where: { status: 'approved' },
            include: { 
                user: true, 
                commentsData: {
                    include: {
                        user: true,
                        replies: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        timestamp: 'desc'
                    }
                },
                videoSources: true
            },
            orderBy: { uploadDate: 'desc' },
        });
        res.status(200).json({ videos });
    } catch (error) {
        console.error('Error fetching feed:', error);
        res.status(500).json({ msg: 'Server error while fetching feed.' });
    }
};

// POST /api/v1/videos/upload
export const uploadVideo = async (req: Request, res: Response) => {
    const { description, userId } = req.body;

    if (!description || !userId) {
        return res.status(400).json({ msg: 'Description and userId are required' });
    }

    try {
        const currentUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!currentUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const newVideo = await prisma.video.create({
            data: {
                description,
                userId,
                videoSources: { create: [{ quality: 'Auto', url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }] },
                thumbnailUrl: 'https://i.ytimg.com/vi/otNh9bTjX1k/maxresdefault.jpg', // Placeholder
                status: 'approved',
            },
            include: { user: true, commentsData: true, videoSources: true }
        });
        
        res.status(201).json(newVideo);
    } catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ msg: 'Server error during video upload.' });
    }
};

// POST /api/v1/videos/:videoId/comments
export const addComment = async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const { text, userId } = req.body;

    if (!text || !userId) {
        return res.status(400).json({ msg: 'Comment text and userId are required' });
    }

    try {
        const [video, user] = await Promise.all([
            prisma.video.findUnique({ where: { id: videoId } }),
            prisma.user.findUnique({ where: { id: userId } })
        ]);

        if (!video) return res.status(404).json({ msg: 'Video not found' });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const [newComment, _] = await prisma.$transaction([
            prisma.comment.create({
                data: {
                    text,
                    userId,
                    videoId,
                },
                include: { user: true }
            }),
            prisma.video.update({
                where: { id: videoId },
                data: { comments: { increment: 1 } },
            })
        ]);

        res.status(201).json(newComment);
    } catch (error) {
        console.error(`Error adding comment to video ${videoId}:`, error);
        res.status(500).json({ msg: 'Server error during adding comment.' });
    }
};

// PUT /api/v1/videos/:videoId
export const updateVideo = async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const { description, userId } = req.body; // Assuming userId is passed for auth check

    if (description === undefined) {
        return res.status(400).json({ msg: 'Description is required' });
    }

    try {
        const video = await prisma.video.findUnique({ where: { id: videoId } });
        if (!video) {
            return res.status(404).json({ msg: 'Video not found' });
        }
        
        // This is not secure, but without auth middleware it's a placeholder
        // In a real app, userId would come from a decoded JWT.
        if (userId && video.userId !== userId) {
            return res.status(403).json({ msg: 'User not authorized to edit this video' });
        }

        const updatedVideo = await prisma.video.update({
            where: { id: videoId },
            data: { description },
            include: { user: true, commentsData: true, videoSources: true }
        });

        res.status(200).json(updatedVideo);
    } catch (error) {
        console.error(`Error updating video ${videoId}:`, error);
        res.status(500).json({ msg: 'Server error during video update.' });
    }
};
