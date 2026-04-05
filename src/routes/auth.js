import { Router } from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const authRouter = Router();
// someRouter.use(isAuthenticated); is how we would add authentication on other routers

authRouter.get('/login', (req, res, next) => {
  const { redirect_url } = req.query;

  // we will encode our url in a json object, similar to a json token (not signed!)
  const state = redirect_url ? Buffer.from(JSON.stringify({ redirect_url })).toString('base64') : undefined;
  // req.state = state;
  // we can pass `req`, `res`, and `next` into the middleware function like this,
  // allowing us to pass extra data from the request
  // return passport.authenticate('google', { scope: ['profile'] });
  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
  })(req, res, next);
});
//login request from the browser that needs to be sent to Google OAuth

//google oauth redirects to the following endpoint
authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/fail', session: false }), (req, res) => {
  console.log('---------------------------');
  console.log(req.user);
  //googleId, email, name, avatar
  console.log('---------------------------');

  // Decode the state parameter to get redirect_url
  let redirectUrl = '/private.html'; // default fallback
  if (req.query.state) {
    try {
      const decoded = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
      redirectUrl = decoded.redirect_url || redirectUrl;
    } catch (e) {
      // invalid state, use default
    }
  }

  const token = jwt.sign({ id: req.user.googleId, name: req.user.name, email: req.user.email, avatar: req.user.avatar }, process.env.JWT_SECRET);
  //include email, name, avatar for demo.
  //It could be just the googleId if you want
  res.cookie('token', token, { httpOnly: true });
  res.redirect(`${redirectUrl}?token=${token}`);
  // res.redirect('/success')
});

//an endpoint to call from the private web page it requires a valid token
authRouter.get('/private', isAuthenticated, (req, res) => {
  res.json({
    message: 'You are in!',
    user: req.user,
  });
});

export default authRouter;
