import GoogleStrategy from 'passport-google-oauth20';
import BearerStrategy from 'passport-http-bearer';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { createSession, verifySession } from '../db/sessions.js';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;
const googleClient = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
};

// google strategy
passport.use(
  new GoogleStrategy(googleClient, async (_accessToken, _refreshToken, profile, complete) => {
    try {
      // here, we will look up a user by the googleId, and either
      const user = {
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos[0]?.value,
      };
      // create sessions entry
      const u = await createSession(user);

      return complete(null, user);
    } catch (error) {
      return complete(error);
    }
  }),
);

//bearer strategy
passport.use(
  // the strategy gets the token for us from the headers.
  new BearerStrategy(async function (token, done) {
    try {
      // we decoded the token using the verify method. This will throw an error if the signature cannot be verified
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = decodedToken;
      // next, we use the id from our token to lookup the user in Postgres
      const u = await verifySession(user);

      // finally, we either throw an error, or pass on the user to passports callback function
      if (!user) {
        throw new Error('Unauthorized');
      }
      done(null, user);
    } catch (error) {
      done(new Error('Unauthorized'));
    }
  }),
);
