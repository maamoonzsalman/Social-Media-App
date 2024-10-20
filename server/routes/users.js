const express = require('express')
const usersRouter = express.Router()

usersRouter.get('/', async (req, res) => {
    res.json('users')
});

usersRouter.post('/', async (req, res) => {
    console.log(req.body)
    console.log('heyo')
})

module.exports = usersRouter;