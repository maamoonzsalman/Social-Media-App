const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
const passport = require('./passportConfig');

const pgSession = require('connect-pg-simple')(session);


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }));

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(
    session({
      store: new pgSession({
        conString: process.env.DATABASE_URL,
      }),
      secret: process.env.SESSION_SECRET || 'your_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      },
    })
  );

app.get('/api', (req, res) => {
    res.json('hello')
})

app.use(passport.initialize());
app.use(passport.session());

app.get('/api', (req, res) => {
    res.json('hello')
})

const usersRouter = require('./routes/users')
app.use('/api/users', usersRouter)

const postsRouter = require('./routes/posts')
app.use('/api/posts', postsRouter)

const commentsRouter = require('./routes/comments')
app.use('/api/comments', commentsRouter)

const followsRouter = require('./routes/follows')
app.use('/api/follows', followsRouter)

const followingRouter = require('./routes/following')
app.use('/api/following', followingRouter)

const authorizationRouter = require('./routes/authorization')
app.use('/api/authorization', authorizationRouter)

app.listen(4000, () => {console.log('Server started on port 4000')})