

// FIX: Explicitly import Request and Response types from express to resolve type conflicts.
// FIX: Changed 'import type' to a direct 'import' to make express types available.
import { Request, Response } from 'express';
import cloudinary from '../lib/cloudinary';

export const getUploadSignature = (req: Request, res: Response) => {
    try {
        const timestamp = Math.round((new Date).getTime() / 1000);

        // The signature is created on the backend, ensuring the secret key is never exposed.
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                // You can add other parameters here for more security,
                // like folders or upload presets.
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        res.status(200).json({
            signature,
            timestamp,
            api_key: process.env.CLOUDINARY_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME
        });
    } catch (error) {
        console.error("Error generating Cloudinary signature:", error);
        res.status(500).json({ msg: "Server error generating signature." });
    }
};