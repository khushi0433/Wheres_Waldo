const { PrismaClient } = require('@prisma/client');
const { COOKIE_NAME } = require('../config');

const prisma = new PrismaClient();

const completedController = {
    completedGame: async (req,res) => {
        const sessionId = req.cookies[COOKIE_NAME];
        if (!sessionId)
            return res.status(401).json({ error: 'unauthorized' });
    
        const { playerName} = req.body;
        if (!playerName) return res.status(400).json({ error: 'playerName is required' });
    
        const session = await prisma.gameSession.findUnique({ 
            where: {id: sessionId},
            include: {guesses: true  }});
            if (!session) {
                return res.status(404).json({ error: 'session not found' });
            }
            const completed = await prisma.gameSession.update({
                where: { id: session.id},
                data: { completedAt: new Date()}
            });
    
        const durationMs = Math.max(0, new Date(completed.completedAt.getTime() - new Date(completed.startedAt).getTime()));
        const score = await prisma.score.create({
            data: {
                sessionId: session.id,
                playerName: playerName.slice(0,50), durationMs
            }
        });
    
        const betterCount = await prisma.score.count({
            where: {
                durationMs: { lt: durationMs },
                session: {
                    photoId: session.photoId   // 👈 only scores from sessions with this photo
                }
            }
        });
    
                    res.json({ durationMs, rank: betterCount + 1 });
    }
};

module.exports = completedController;