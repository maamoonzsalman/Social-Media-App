const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const prisma = require('./prisma/prismaClient'); 

passport.use(new LocalStrategy(
    {
      usernameField: 'username', // This can be 'email' if you're using email to log in
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        // Find the user by their username
        const user = await prisma.user.findUnique({ where: { username: username } });
  
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
  
        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
  
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' });
        }
  
        // If the password matches, return the user
        return done(null, user);
      } catch (err) {
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