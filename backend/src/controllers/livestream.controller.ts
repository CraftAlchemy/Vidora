
// FIX: Explicitly import Request and Response types from express to resolve type conflicts.
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// FIX: Use explicit Request and Response types from express to make `res.status` available.
export const getLiveStreams = async (req: Request, res: Response) => {
    try {
        const streams = await prisma.liveStream.findMany({
            where: { status: 'live' },
            include: { user: true },
        });
        res.status(200).json({ streams });
    } catch (error) {
        console.error('Error fetching live streams:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// FIX: Use explicit Request and Response types from express to make `req.body` and `res.status` available.
export const startLiveStream = async (req: Request, res: Response) => {
    const { title } = req.body;
    // const userId = req.user.id; // From auth middleware
    const userId = 'u1'; // Mocking user for now

    if (!title) {
        return res.status(400).json({ msg: 'Title is required for the livestream' });
    }

    try {
        const newStream = await prisma.liveStream.create({
            data: {
                title,
                userId,
                thumbnailUrl: `https://picsum.photos/seed/${Date.now()}/400/600`, // Placeholder
                status: 'live',
                // videoUrl can be updated later by the streaming service
            },
            include: { user: true },
        });

        res.status(201).json({
            message: 'Livestream started successfully',
            stream: newStream,
        });
    } catch (error) {
        console.error('Error starting live stream:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};