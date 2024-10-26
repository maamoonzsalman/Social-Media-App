const express = require('express')
const followersRouter = express.Router()
const prisma = require('../prisma/prismaClient');

followersRouter.get('/', async (req, res) => {
    return res.json('followers')
});

followersRouter.get('/:username/followers', async (req, res) => {

})

followersRouter.post('/addfollow/:followingId/:followerId', async(req, res) => {
    
    try {
        const followingId = parseInt(req.params.followingId);
        const followerId = parseInt(req.params.followerId);
        console.log(followingId, followerId)

        const existingFollow = await prisma.follows.findUnique({
            where: {
            followerId_followingId: {
                followerId,
                followingId
            }
            }
        });

        if (existingFollow) {
            console.log('User already follows this profile')
            return existingFollow;
        }

        const newFollow = await prisma.follows.create({
            data: {
                followerId: followerId,
                followingId: followingId
            }
        });

        console.log('Follow success! ', newFollow)
        
        return res.json(newFollow)
    } catch (error) {
        console.log('Error adding follower ', error)
    }
})

module.exports = followersRouter;