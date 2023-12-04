const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const GOOGLE_CLIENT_ID =process.env.GOOGLE_Client_ID;
const GOOGLE_CLIENT_SECRET =process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL=process.env.GOOGLE_CALLBACK_URL 

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };
      return done(null, user); 
    }
  )
);

// Serialize and Deserialize user 
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
