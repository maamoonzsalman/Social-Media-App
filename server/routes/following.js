const express = require('express');
const followingRouter = express.Router();

followingRouter.get('/', async (req, res) => {
    return res.json('followers')
})

module.exports = followingRouter;