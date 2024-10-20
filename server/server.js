const express = require('express');
const cors = require('cors');
const session = require('express-session');
const prisma = require('./prisma/prismaClient');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }));

app.use(express.json());

app.get('/api', (req, res) => {
    res.json('hello')
})

const usersRouter = require('./routes/users')
app.use('/api/users', usersRouter)

const postsRouter = require('./routes/posts')
app.use('/api/posts', postsRouter)

const commentsRouter = require('./routes/comments')
app.use('/api/comments', commentsRouter)

const followersRouter = require('./routes/followers')
app.use('/api/followers', followersRouter)

const followingRouter = require('./routes/following')
app.use('/api/following', followingRouter)

app.listen(4000, () => {console.log('Server started on port 4000')})