const express = require('express');
const usersRouter = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../prisma/prismaClient');

usersRouter.get('/', async (req, res) => {
    res.json('users')
});

usersRouter.get('/loggedinuser', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            console.log('Authenticated user:', req.user);
            const username = req.user.username
            console.log('This is the username of the loggedin user: ', username)
            const userProfile = await prisma.user.findUnique({
                where: {
                    username: username.toLowerCase()
                }
            })
            res.json({userProfile: userProfile})
        } else {
            res.status(401).json({message: 'Not authenticated'});
        }
    } catch (error) {
        console.log('Failure authenticating user')
        console.log(error)
    }   
        
});

usersRouter.get('/:username', async (req, res) => {
    try {
        const {username} = req.params
        const userProfile = await prisma.user.findUnique({
            where: {
                username: username.toLowerCase(), 
            },
            select: {
                id: true,
                createdAt: true,
                username: true,
                firstName: true,
                lastName: true,
                profilePic: true,
                bio: true,
                posts: {
                    include: {
                        comments: true,
                        likes: true,
                    },
            },
            followers: {
            include: {
                follower: true, // Includes follower details for each follower
            },
            },
            following: {
            include: {
                following: true, // Includes following details for each followed user
            },
            },
            comments: true, // Includes all comments made by the user
            likes: true, // Includes all likes made by the user
        },
        });

        console.log(userProfile)
        return res.json({userProfile: userProfile})
    } catch(error) {
        console.log('error retrieving user from database', error)
    }
})

usersRouter.post('/', async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body.formData

    const existingUserName = await prisma.user.findUnique({
        where: {
            username: username.toLowerCase()
        }
    })

    const existingEmail = await prisma.user.findUnique({
        where: {
            email: email.toLowerCase()
        }
    })

    if (existingUserName) {
        console.log('User with this username already exists')
        return res.json({message: 'User with this username already exists'})
    } else if (existingEmail) {
        console.log('User with this email already exists')
        return res.json({message: 'User with this email already exists'})
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName: firstName,
                lastName: lastName
            }
        })
        console.log(newUser)

        req.login(newUser, function(err) {
            if (err) {
                console.error('Error logging in after registration:', err);
                return res.json({ message: 'Error logging in after register'})
            }
            return res.json({message: 'Login successful', redirectTo: '/', userProfile: newUser})
        })

    } catch(error) {
        console.log('error creating user: ', error)
    }

    
})

module.exports = usersRouter;