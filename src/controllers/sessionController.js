const { PrismaClient } = require('@prisma/client');
const { COOKIE_NAME } = require('../config');

const prisma = new PrismaClient();

const sessionController = {
    // Health check endpoint
    getHealth: (req, res) => {
        res.send({ ok: true });
    },

    // Create a new game session
    createSession: async (req, res) => {
        try {
            const { photoId } = req.body;

            // Validate input
            if (!photoId) {
                return res.status(400).json({ error: 'photoId is required' });
            }

            // Ensure photo exists and pull character names only
            const photo = await prisma.photo.findUnique({
                where: { id: photoId },
                include: { characters: { select: { id: true, name: true } } },
            });

            if (!photo) {
                return res.status(404).json({ error: 'Photo not found' });
            }

            // Create a new session
            const session = await prisma.gameSession.create({
                data: {
                    photoId: photo.id,
                },
            });

            // Set session cookie
            res.cookie(COOKIE_NAME, session.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            // Return session details
            res.status(201).json({
                sessionId: session.id,
                photoId: session.photoId,
                characters: photo.characters.map((char) => ({
                    id: char.id,
                    found: false,
                })),
            });
        } catch (error) {
            console.error('Error creating session:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};

module.exports = sessionController;