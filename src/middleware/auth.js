import '../util/passport.js';
import passport from 'passport';

const isAuthenticated = (req, res, next) => {
  passport.authenticate('bearer', {
    session: false,
    failWithError: true,
  })(req, res, (err) => {
    if (err) {
      // next(new Error(err.message));
      res.status(500).json({ error: 500, message: 'Invalid bearer token.' });
      return;
    }
    next();
  });
};

export { isAuthenticated };
