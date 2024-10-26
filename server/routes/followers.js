const express = require('express')
const followersRouter = express.Router()
const prisma = require('../prisma/prismaClient');

followersRouter.get('/', async (req, res) => {
    return res.json('followers')
});

followersRouter.get('/:username/followers', async (req, res) => {
    
})

module.exports = followersRouter;