const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const prisma = require('./prisma/prismaClient'); 

passport.use(new LocalStrategy(
    {
      usernameField: 'email', 
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Find the user
        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        
        // If no user is found, return an error
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }
  
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
  
        // If the password does not match, return an error 
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        // If the password matches, return the user
        return done(null, user);
      } catch (err) {
        // Handle any errors
        return done(err);
      }
    }
  ));

passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id);  // Log user serialization
    done(null, user.id);  // Store only the user ID in the session
  });
  
  // Deserialize the user by their ID stored in the session
passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: id },
      });
      if (user) {
        done(null, user);
      } else {
        done(new Error("User not found"), null);
      }
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(error, null);
    }
  });

module.exports = passport;