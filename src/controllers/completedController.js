const { PrismaClient } = require('@prisma/client');
const { COOKIE_NAME } = require('../config');

const prisma = new PrismaClient();

const completedController = {
    completedGame: async (req, res) => {
        try {
            // Retrieve session ID from cookies
            const sessionId = req.cookies[COOKIE_NAME];
            console.log('Session ID from cookies:', sessionId);
            if (!sessionId) {
                return res.status(401).json({ error: 'unauthorized' });
            }

            // Validate player name
            const { playerName } = req.body;
            if (!playerName) {
                return res.status(400).json({ error: 'playerName is required' });
            }

            // Fetch the session
            const session = await prisma.gameSession.findUnique({
                where: { id: sessionId },
                include: { guesses: true }
            });

            if (!session) {
                return res.status(404).json({ error: 'session not found' });
            }

            // Mark the game as completed
            const completed = await prisma.gameSession.update({
                where: { id: session.id },
                data: {
                    completedAt: new Date(),
                    playerName: playerName
                }
            });

            // Return the updated session
            res.status(200).json({
                message: 'Game marked as completed',
                session: {
                    id: completed.id,
                    completedAt: completed.completedAt,
                    playerName: completed.playerName
                }
            });
        } catch (error) {
            console.error('Error completing game:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = completedController;