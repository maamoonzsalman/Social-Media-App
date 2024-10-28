const express = require('express');
const usersRouter = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../prisma/prismaClient');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

usersRouter.get('/', async (req, res) => {
    
});

usersRouter.get('/search', async (req, res) => {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }
  
    try {
      const users = await prisma.user.findMany({
        where: {
          username: {
            startsWith: query,  // Match only if username starts with the query
            mode: 'insensitive', // Case-insensitive search
          },
        },
        select: {
          id: true,
          username: true,
          profilePic: true, // Adjust this to whatever fields you want to return
        },
      });
  
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      return res.status(500).json({ message: 'Error searching users' });
    }
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

usersRouter.put('/:username/editprofile', upload.single('profilePic'), async (req, res) => {
    try {
        const currentUser = await prisma.user.findUnique({
            where: { username: req.body.username },
        });

        const imagePath = req.file ? `/uploads/${req.file.filename}` : currentUser.profilePic;
        const bio = req.body.bio
        
        const updatedUser = await prisma.user.update({
            where: {username: req.body.username},
            data: {
                bio: bio,
                profilePic: imagePath
            }
        })

        return res.json({redirectTo: `/${req.body.username}`})
        
    } catch (error) {
        console.log('Error updating user profile: ', error)
    }
})

module.exports = usersRouter;