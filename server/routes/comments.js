const express = require('express')
const commentsRouter = express.Router()

commentsRouter.get('/', async (req, res) => {
    return res.json('comments')
});

module.exports = commentsRouter