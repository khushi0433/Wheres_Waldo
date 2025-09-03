const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const errorHandler = require('./middleware/errorhandler');
const notFound = require('./middleware/notFound');

const sessionRoutes = require('./routes/sessionRoute');
const guessesRoutes = require('./routes/guessesRoute');
const PhotoRoute = require('./routes/PhotoRoute');
const completedRoute = require('./routes/completedRoute');

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:4000"],
  credentials: true
}));


app.get('/', (req,res) => {
   res.send('Is API Working?');
});

app.use('/v1/sessions', sessionRoutes);
app.use('/v1/guesses', guessesRoutes);
app.use('/v1/photos', PhotoRoute);
app.use('/v1/completed', completedRoute);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use(errorHandler);
app.use(notFound);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});