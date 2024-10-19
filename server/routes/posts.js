const express = require('express');
const postsRouter = express.Router();

postsRouter.get('/', async (req, res) => {
    return res.json('posts')
})

module.exports = postsRouter