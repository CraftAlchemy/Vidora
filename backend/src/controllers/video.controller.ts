// FIX: Imported Request and Response directly from express to resolve type conflicts.
// FIX: Changed to a default express import to use explicit express.Request/Response types, fixing property access errors.
import express from 'express';
import prisma from '../lib/prisma';

// FIX: Use express.Request and express.Response types to resolve type conflicts.
export const getFeed = async (req: express.Request, res: express.Response) => {
    try {
        const videos = await prisma.video.findMany({
            where: { status: 'approved' },
            include: { user: true, commentsData: { include: { user: true } } },
            orderBy: { uploadDate: 'desc' },
        });
        res.status(200).json({ videos });
    } catch (error) {
        console.error('Error fetching video feed:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// FIX: Use express.Request and express.Response types to resolve type conflicts.
export const uploadVideo = async (req: express.Request, res: express.Response) => {
    // The frontend sends the URLs after uploading to Cloudinary
    const { description, videoUrl, thumbnailUrl } = req.body;
    // const userId = req.user.id; // From auth middleware
    const userId = 'u1'; // Mock user for demonstration

    if (!description || !videoUrl) {
        return res.status(400).json({ msg: 'Missing required video data from upload.' });
    }

    try {
        const newVideo = await prisma.video.create({
            data: {
                description,
                userId,
                thumbnailUrl: thumbnailUrl || 'https://via.placeholder.com/400x600.png?text=Processing',
                uploadDate: new Date().toISOString(),
                status: 'approved', // Or 'pending' for moderation
                videoSources: {
                    create: [{ quality: 'Auto', url: videoUrl }]
                },
            },
            include: { user: true, commentsData: true },
        });
        res.status(201).json(newVideo);
    } catch (error) {
        console.error('Error creating video record:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// FIX: Use express.Request and express.Response types to resolve type conflicts.
export const addComment = async (req: express.Request, res: express.Response) => {
    const { videoId } = req.params;
    const { text, userId } = req.body;

    if (!text || !userId) {
        return res.status(400).json({ msg: 'Comment text and userId are required' });
    }

    try {
        // Use a transaction to ensure both comment creation and video count update succeed or fail together
        const [newComment] = await prisma.$transaction([
            prisma.comment.create({
                data: {
                    text,
                    userId,
                    videoId,
                },
                include: { user: true }, // Include user data in the returned comment
            }),
            prisma.video.update({
                where: { id: videoId },
                data: { comments: { increment: 1 } },
            }),
        ]);

        res.status(201).json(newComment);
    } catch (error) {
        console.error(`Error adding comment to video ${videoId}:`, error);
        // Check for specific error, e.g., video not found
        if ((error as any).code === 'P2025') {
            return res.status(404).json({ msg: 'Video not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
};