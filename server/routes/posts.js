const express = require('express');
const postsRouter = express.Router();
const prisma = require('../prisma/prismaClient');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

postsRouter.post('/:userId/uploadpost', upload.single('image'), async (req, res) => {
    try {
        const userId = parseInt(req.params.userId)
        const imagePath = `/uploads/${req.file.filename}`
        const caption = req.body.caption
        console.log('user ID: ', userId, 'image: ', imagePath, 'caption: ', caption)

        const newPost = await prisma.post.create({
            data: {
                userId: userId,
                caption: caption,
                image: imagePath
            },
        });
        console.log('Post successfully created!')
        res.json({newPost: newPost})
    } catch (error) {
        console.log('error uploading post: ', error)
    }
})

postsRouter.post('/:postId/:userId/likepost', async (req, res) => {
    try {
        const postId = parseInt(req.params.postId)
        const userId = parseInt(req.params.userId)
        
        const like = await prisma.like.create({
            data: {
                userId: userId,
                postId: postId
            }
        })
        console.log('post successfully liked!')
        res.json({like: like})
    } catch (error) {
        console.log('Error liking post: ', error)
    }
})

postsRouter.delete('/:postId/:userId/unlikepost', async (req, res) => {
    try {
        const postId = parseInt(req.params.postId)
        const userId = parseInt(req.params.userId)
        
        const unlike = await prisma.like.delete({
            where: {
               userId_postId: {
                    userId: userId,
                    postId: postId
               }
            }
        })
        console.log('post successfully unliked!')
        res.json({unlike: unlike})
    } catch (error) {
        console.log('Error unliking post: ', error)
    }
})

postsRouter.get('/:postId', async (req, res) => {
    try {
        console.log(req.params)
        const postId = parseInt(req.params.postId)
        const post = await prisma.post.findUnique({
            where: {id: postId},
            select: {
                createdAt: true,
                id: true,
                caption: true,
                image: true,
                user: true,
                userId: true,
                likes: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profilePic: true
                            }
                        }
                    }
                }
            }
        })
        console.log('post retrieved successfully!')
        console.log(post)
        res.json({post: post})
    } catch (error) {
        console.log('error getting post: ', error)
    }
})


module.exports = postsRouter
