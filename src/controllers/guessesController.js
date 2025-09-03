const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const guessesController = {
    createGuess: async (req, res) => {
        try {
            const { sessionId, characterId, x, y } = req.body;

            // Validate input
            if (!sessionId) {
                return res.status(400).json({ error: 'sessionId is required' });
            }

            if (!characterId) {
                return res.status(400).json({ error: 'characterId is required' });
            }

            if (x === undefined || y === undefined) {
                return res.status(400).json({ error: 'x and y coordinates are required' });
            }

            // Fetch the session
            const session = await prisma.gameSession.findUnique({
                where: { id: sessionId },
                include: { guesses: true }
            });

            if (!session) {
                return res.status(404).json({ error: 'session not found' });
            }

            // Check if the character has already been guessed
            const alreadyGuessed = session.guesses.find(
                (g) => g.characterId === characterId && g.isCorrect
            );

            if (alreadyGuessed) {
                return res.json({
                    alreadyFound: true,
                    isCorrect: true,
                    foundCount: session.foundCount
                });
            }

            // Validate the character
            const character = await prisma.character.findUnique({
                where: { id: characterId }
            });

            if (!character) {
                return res.status(404).json({ error: 'character not found' });
            }

            // Validate the guess
            const isCorrect =
                x >= character.boxX &&
                x <= character.boxX + character.boxW &&
                y >= character.boxY &&
                y <= character.boxY + character.boxH;

            // Create the guess
            const guess = await prisma.guess.create({
                data: {
                    sessionId,
                    characterId,
                    guessX: x,
                    guessY: y,
                    isCorrect
                }
            });

            // Update session found count if the guess is correct
            if (isCorrect) {
                await prisma.gameSession.update({
                    where: { id: sessionId },
                    data: { foundCount: session.foundCount + 1 }
                });
            }

            // Return the guess result
            res.status(201).json({
                guessId: guess.id,
                isCorrect,
                foundCount: isCorrect ? session.foundCount + 1 : session.foundCount
            });
        } catch (error) {
            console.error('Error creating guess:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = guessesController;