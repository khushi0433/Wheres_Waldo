const { PrismaClient } = require('@prisma/client');
const { COOKIE_NAME } = require('../config');

const prisma = new PrismaClient();

const guessesController = {
    createGuess: async (req,res) => {
        const sessionId = req.cookies[COOKIE_NAME];
        if (!sessionId) return res.status(401).json({ error: 'no session cookie' });
    
        const { characterId, x, y } = req.body;
        if (!characterId || x === undefined || y === undefined) {
            return res.status(400).json({ error: 'characterId, x, and y required' });
        }
    
        const session = await prisma.gameSession.findUnique({
            where: { id: sessionId },
            include: { guesses: true }
        });
    
        if (!session || session.status !== 'CREATED') {
            return res.status(400).json({ error: 'Session not found or not active' });
        }
    
        // Check if the character has already been guessed
        const alreadyGuessed = session.guesses.find(g => g.characterId === characterId && g.isCorrect);
        if (alreadyGuessed) {
            return res.json({ alreadyFound: true, isCorrect: true, foundCount: session.foundCount });
        }
    
        const character = await prisma.character.findUnique({
            where: { id: characterId }
        });
    
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }
    
        // Check if the guess is within the character's bounding box
        const eps = 0.01;
      const inside = (x >= (character.boxX - eps) && x <= (character.boxX + character.boxW + eps))
                  && (y >= (character.boxY - eps) && y <= (character.boxY + character.boxH + eps));
    
      // Use atomic transaction for both operations
      const result = await prisma.$transaction(async (tx) => {
        const guess = await tx.guess.create({
          data: {
            sessionId: session.id,
            characterId,
            guessX: x,
            guessY: y,
            isCorrect: inside
          }
        });
      
        let updatedSession = session;
        if (inside) {
          // increment foundCount (atomic with guess creation)
          updatedSession = await tx.gameSession.update({
            where: { id: session.id },
            data: { foundCount: { increment: 1 } }
          });
        }
        
        return { guess, updatedSession };
      });
      
      const { updatedSession } = result;
      const marker = inside ? { characterId, x: character.boxX + character.boxW / 2, y: character.boxY + character.boxH / 2 } : null;
    
      res.json({ 
        isCorrect: inside,
        foundCount: updatedSession.foundCount,
        totalCharacters: (await prisma.character.count({ where: { photoId: session.photoId } })),
        alreadyFound: false,
        marker
      });
    }
};

module.exports = guessesController;