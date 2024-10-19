const express = require('express')
const followersRouter = express.Router()

followersRouter.get('/', async (req, res) => {
    return res.json('followers')
});

module.exports = followersRouter;