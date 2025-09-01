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
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true 
}));

const PORT = process.env.PORT || 4000;

// app.get('/', (req,res) => {
  //  res.send('Is API Working?');
// })

app.use('/', sessionRoutes);
app.use('/', guessesRoutes);
app.use('/', PhotoRoute);
app.use('/', completedRoute);


app.use(errorHandler);
app.use(notFound);


app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});