const express = require('express');
const postsRouter = express.Router();
const prisma = require('../prisma/prismaClient');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

postsRouter.post('/:userId/uploadpost', upload.single('image'), async (req, res) => {
    try {
        const userId = parseInt(req.params.userId)
        const imagePath = `uploads/${req.file.filename}`
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


module.exports = postsRouter
