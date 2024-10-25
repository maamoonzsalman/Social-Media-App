const express = require('express');
const authorizationRouter = express.Router();
const passport = require('passport')

authorizationRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err); // Handle error
      }
      if (!user) {
        return res.status(401).json({ message: info.message || 'Invalid credentials' });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error logging in' });
        }
        // Respond with a success message and the redirect URL
        return res.status(200).json({ message: 'Login successful', redirectTo: '/', user: user });
      });
    })(req, res, next);
  });

authorizationRouter.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) {return next(err); }
      console.log('logging user out')
      return res.status(200).json({message: 'Logout successful', redirectTo: '/login'})
    });
  });

module.exports = authorizationRouter;