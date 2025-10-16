
import { Request, Response } from 'express';
import prisma from '../lib/prisma';


// GET /api/v1/livestreams
export const getLiveStreams = async (req: Request, res: Response) => {
    console.log('Fetching active livestreams from database');
    try {
        const streams = await prisma.liveStream.findMany({
            where: { status: 'live' },
            include: { user: true }
        });
        res.status(200).json({ streams: streams });
    } catch (error) {
        console.error("Error fetching livestreams:", error);
        res.status(500).json({ msg: 'Server error fetching livestreams' });
    }
};

// POST /api/v1/livestreams/start
export const startLiveStream = async (req: Request, res: Response) => {
    const { title, userId } = req.body;
    
    if (!title || !userId) {
        return res.status(400).json({ msg: 'Title and userId are required for the livestream' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // In a real app, you might want to end previous streams for the user.
        // For now, we just create a new one.

        const newStream = await prisma.liveStream.create({
            data: {
                title,
                userId,
                thumbnailUrl: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Placeholder
                viewers: 1, // Broadcaster
                status: 'live',
                videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' // Placeholder
            },
            include: { user: true }
        });

        console.log(`User ${userId} started livestream '${title}' with id ${newStream.id}`);
        
        res.status(201).json({ stream: newStream });

    } catch (error) {
        console.error("Error starting livestream:", error);
        res.status(500).json({ msg: 'Server error starting livestream' });
    }
};
