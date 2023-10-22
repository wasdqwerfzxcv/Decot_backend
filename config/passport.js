const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    let user = await User.findOne({ where: { email: profile.emails[0].value } });

    if (!user) {
      user = await User.create({
        googleId: profile.id, //tentatively database dont have this column
        username: profile.displayName,
        email: profile.emails[0].value,
        password: 'defaultGooglePassword',
        registeredVia: 'Google'
      });
    }

    return cb(null, user);
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  done(null, user);
});

module.exports = passport;