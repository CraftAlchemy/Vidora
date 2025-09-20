
// FIX: Changed 'import type' to a direct 'import' for Request and Response.
// This provides the correct Express types, making properties like `req.body` and `res.status` available.
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// FIX: Use explicit Request and Response types from express to make `res.status` available.
export const getLiveStreams = async (req: Request, res: Response) => {
    try {
        const streams = await prisma.liveStream.findMany({
            where: { status: 'live' },
            include: { user: true },
        });

        if (streams && streams.length > 0) {
            return res.status(200).json({ streams });
        }
        
        console.warn('No live streams found in database. Falling back to mock data.');
        const { mockLiveStreams } = await import('../data');
        return res.status(200).json({ streams: mockLiveStreams.filter(s => s.status === 'live') });

    } catch (error) {
        console.error('Error fetching live streams from DB, falling back to mock data:', error);
        try {
            const { mockLiveStreams } = await import('../data');
            return res.status(200).json({ streams: mockLiveStreams.filter(s => s.status === 'live') });
        } catch (fallbackError) {
            console.error('Mock fallback also failed:', fallbackError);
            return res.status(500).json({ msg: 'Server error' });
        }
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