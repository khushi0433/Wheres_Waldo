const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const photoController = {
    // Fetch leaderboard for a specific photo
    leaderboard: async (req, res, next) => {
        try {
            const { photoId } = req.query;
            if (!photoId) {
                return res.status(400).json({ error: 'photoId is required' });
            }

            const scores = await prisma.score.findMany({
                where: {
                    session: {
                        photoId: photoId
                    }
                },
                select: {
                    playerName: true,
                    durationMs: true,
                }
            });

            if (scores.length === 0) {
                return res.status(404).json({ error: 'No scores found for this photoId' });
            }

            res.json(scores);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            next(error);
        }
    },

    // Create a new photo
    createPhoto: async (req, res, next) => {
        try {
            const { name, url, characters } = req.body;

            if (!name || !url || !characters || !Array.isArray(characters)) {
                return res.status(400).json({ error: 'name, url, and characters (array) are required' });
            }

            const photo = await prisma.photo.create({
                data: {
                    name,
                    url,
                    characters: {
                        create: characters.map((character) => ({
                            name: character.name,
                            x: character.x,
                            y: character.y,
                        })),
                    },
                },
            });

            res.status(201).json(photo);
        } catch (error) {
            console.error('Error creating photo:', error);
            next(error);
        }
    }
};

module.exports = photoController;