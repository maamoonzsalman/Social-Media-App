const express = require('express')
const prisma = require('../prisma/prismaClient');

const commentsRouter = express.Router()

commentsRouter.get('/', async (req, res) => {
    return res.json('comments')
});

commentsRouter.post('/:postId', async (req, res) => {
    console.log(req.body)
    console.log(req.params)
    try {
        const {text, userId} = req.body.commentData
        const postId = parseInt(req.params.postId)
        const newComment = await prisma.comment.create({
            data: {
                postId: postId,
                userId: userId,
                text: text
            }
        })
        console.log('Successfully created comment', newComment)
        return (res.json({comment: newComment}))
    } catch(error) {
        console.log('Error posting comment: ', error)
    }
})

module.exports = commentsRouter