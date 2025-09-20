
// FIX: Changed 'import type' to a direct 'import' for Request and Response.
// This provides the correct Express types, making properties like `req.body`, `req.params`, and `res.status` available.
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getFeed = async (req: Request, res: Response) => {
    try {
        const videos = await prisma.video.findMany({
            where: { status: 'approved' },
            include: { author: true, comments: { include: { author: true } } },
            orderBy: { uploadDate: 'desc' },
        });

        if (videos && videos.length > 0) {
            return res.status(200).json({ videos });
        }
        
        console.warn('No videos found in database. Falling back to mock data.');
        const { mockVideos } = await import('../data');
        return res.status(200).json({ videos: mockVideos.filter(v => v.status === 'approved') });

    } catch (error) {
        console.error('Error fetching video feed from DB, falling back to mock data:', error);
        try {
            const { mockVideos } = await import('../data');
            return res.status(200).json({ videos: mockVideos.filter(v => v.status === 'approved') });
        } catch (fallbackError) {
            console.error('Mock fallback also failed:', fallbackError);
            return res.status(500).json({ msg: 'Server error' });
        }
    }
};

export const uploadVideo = async (req: Request, res: Response) => {
    const { description, videoUrl, thumbnailUrl } = req.body;
    const authorId = req.user.id; // From auth middleware

    if (!description || !videoUrl) {
        return res.status(400).json({ msg: 'Missing required video data from upload.' });
    }

    try {
        const newVideo = await prisma.video.create({
            data: {
                description,
                authorId,
                thumbnailUrl: thumbnailUrl || 'https://via.placeholder.com/400x600.png?text=Processing',
                status: 'approved', // Or 'pending' for moderation
                videoSources: {
                    create: [{ quality: 'Auto', url: videoUrl }]
                },
            },
            include: { author: true, comments: true },
        });
        res.status(201).json(newVideo);
    } catch (error) {
        console.error('Error creating video record:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

export const addComment = async (req: Request, res: Response) => {
    const { videoId } = req.params;
    const { text } = req.body;
    const authorId = req.user.id;

    if (!text) {
        return res.status(400).json({ msg: 'Comment text is required' });
    }

    try {
        // Use a transaction to ensure both comment creation and video count update succeed or fail together
        const [newComment] = await prisma.$transaction([
            prisma.videoComment.create({
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
        if ((error as any).code === 'P2025') {
            return res.status(404).json({ msg: 'Video not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
};