const { PrismaClient } = require('@prisma/client');
const { COOKIE_NAME } = require('../config');

const prisma = new PrismaClient();

const sessionController = {
    // Health check endpoint
    getHealth: (req, res) => {
        res.send({ok: true});
    },

    // Create a new game session
    createSession: async (req, res) => {
        try {
            const { photoId } = req.body;
            if (!photoId) {
                return res.status(400).json({ error: 'photoId required' });
            }
            
            // Ensure photo exists and pull character names only
            const photo = await prisma.photo.findUnique({
                where: { id: photoId },
                include: { characters: { select: { id: true, name: true } } }
            });
            
            if (!photo) {
                return res.status(404).json({ error: 'photo not found' });
            }
            
            const session = await prisma.gameSession.create({
                data: { photoId: photo.id }
            });
            
            res.cookie(COOKIE_NAME, session.id, {
                httpOnly: true,
                sameSite: 'lax',
            });
            
            res.json({
                sessionId: session.id,
                photo: {
                    id: photo.id,
                    title: photo.title,
                    imageUrl: photo.imageUrl,
                    characters: photo.characters.map(c => ({ id: c.id, name: c.name})),
                    totalCharacters: photo.characters.length
                },
            });
            
        } catch (error) {
            console.error('Error creating session:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = sessionController;
