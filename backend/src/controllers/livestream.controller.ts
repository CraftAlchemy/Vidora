

// FIX: Import express and use express.Request/Response to avoid type conflicts.
import express from 'express';
import prisma from '../lib/prisma';

// FIX: Use express.Request and express.Response types to resolve type conflicts.
export const getLiveStreams = async (req: express.Request, res: express.Response) => {
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

// FIX: Use express.Request and express.Response types to resolve type conflicts.
export const startLiveStream = async (req: express.Request, res: express.Response) => {
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
