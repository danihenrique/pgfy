const passport = require('passport');
const oauthPlugin = require('fastify-oauth2');
const FacebookTokenStrategy = require('passport-facebook-token');

function main(api, plugin) {
  const userTable = process.env.PGFY_AUTH_USER_TABLE || 'user';
  const persistProfile = process.env.PGFY_FACEBOOK_PERSIST_PROFILE || false;
  plugin.options.name = 'facebookOAuth2';
  plugin.options.credentials = {
    client: {
      id: process.env.FACEBOOK_CLIENT_ID,
      secret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    auth: oauthPlugin.FACEBOOK_CONFIGURATION,
  };
  passport.use(new FacebookTokenStrategy({
    clientID: process.env.PGFY_FACEBOOK_CLIENT_ID,
    clientSecret: process.env.PGFY_FACEBOOK_CLIENT_SECRET,
    passReqToCallback: true,
    profileFields: ['name', 'email', 'gender', 'location', 'friends'],
  }, ((request, accessToken, refreshToken, profile, done) => {
    request.profile = profile;
    return done(null, profile);
  })));
  api.addHook('onRequest', (request, reply, next) => {
    const urlAllowed = request.req.originalUrl.split('/');
    if (urlAllowed.includes('v1')) {
      passport.authenticate('facebook-token', async (error, profile, info) => {
        const { db } = api;
        if (error || profile === false) return next('Token Invalid');
        if (persistProfile) {
          const userFound = await db[userTable].findOne({
            email: profile._json.email,
          });
          if (!userFound) {
            const newUser = {
              name: `${profile.name.givenName} ${profile.name.familyName}`,
              email: profile._json.email,
              gender: profile._json.gender,
              location: profile._json.location && profile._json.location.name,
              picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
              facebook: profile.id,
              total_friends: profile._json.friends.summary.total_count,
            };
            db[userTable].save(newUser);
            request.user = newUser;
          } else {
            request.user = userFound;
          }
        }
        next();
        return true;
      })(request, reply);
    } else {
      next();
    }
  });
}

module.exports = main;
