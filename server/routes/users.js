const express = require('express')
const usersRouter = express.Router()

usersRouter.get('/', async (req, res) => {
    return res.json('users')
});

module.exports = usersRouter;