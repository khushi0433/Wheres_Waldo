const { PrismaClient } = require('@prisma/client');
const { COOKIE_NAME, ADMIN_SECRET } = require('../config');

const prisma = new PrismaClient();

const photoController = {
    leaderboard: async (req, res, next) => {
        try {
            const { photoId } = req.query;
            if (!photoId) {
                return res.status(400).json({ error: 'photoId is required'});
            }

            // Use Prisma relations instead of raw SQL
            const scores = await prisma.score.findMany({
                where: {
                    session: {
                        photoId: photoId
                    }
                },
                select: {
                    playerName: true,
                    durationMs: true,
                    createdAt: true
                },
                orderBy: {
                    durationMs: 'asc'
                },
                take: 10
            });

            res.json({ photoId, scores });
        } catch (error) {
            next(error);
        }
    },      

    createPhoto: async (req, res, next) => {
        try {
            if (req.headers['x-admin-secret'] !== ADMIN_SECRET) {
                return res.status(401).json({ error: 'unauthorized' });
            }
            const { title, imageUrl } = req.body;
            const p = await prisma.photo.create({ data: { title, imageUrl }});
            res.json(p);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = photoController;