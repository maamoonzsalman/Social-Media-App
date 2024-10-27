const express = require('express')
const followsRouter = express.Router()
const prisma = require('../prisma/prismaClient');

followsRouter.post('/addfollow/:followingId/:followerId', async(req, res) => {
    
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

followsRouter.delete('/removefollow/:followingId/:followerId', async (req, res) => {

    try {
        const followingId = parseInt(req.params.followingId);
        const followerId = parseInt(req.params.followerId);

        const unfollow = await prisma.follows.delete({
            where: {
                followerId_followingId: {
                    followerId: followerId,
                    followingId: followingId
                }
            },
        });
        console.log('Removal of follow successful: ', unfollow)
        return res.json(unfollow)
    } catch (error) {
        console.log('error removing follow: ', error)
    }

})

followsRouter.get('/:userId/followers', async (req, res) => {
    try {
        const userId = parseInt(req.params)

        const followers = await prisma.follows.findMany({
            where: {
                followingId: userId,
            },
            include: {
                follower: true,
            },
        });
        console.log('Success retrieving followers list')
        return res.json(followers)
    } catch (error) {
        console.log('error retrieving followers list')
    }
});

module.exports = followsRouter;