

// FIX: Explicitly import Request and Response types from express to resolve type conflicts.
// FIX: Changed 'import type' to a direct 'import' to make express types available.
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getFeed = async (req: Request, res: Response) => {
    try {
        const videos = await prisma.video.findMany({
            where: { status: 'approved' },
            include: { author: true, comments: { include: { author: true } } },
            orderBy: { uploadDate: 'desc' },
        });
        res.status(200).json({ videos });
    } catch (error) {
        console.error('Error fetching video feed:', error);
        res.status(500).json({ msg: 'Server error' });
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
        const newComment = await prisma.comment.create({
            data: {
                text,
                authorId: authorId,
                videoId,
            },
            include: { author: true }, // Include user data in the returned comment
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error(`Error adding comment to video ${videoId}:`, error);
        if ((error as any).code === 'P2025') {
            return res.status(404).json({ msg: 'Video not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
};