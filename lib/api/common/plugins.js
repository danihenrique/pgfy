function plugins(api) {
  try {
    if (api.config.plugins) {
      api.config.plugins.forEach((plugin) => {
        api.spinner.text = `Loading plugin ${plugin.name}`;
        if (plugin.name === 'fastify-oas') {
          plugin.options = api.config.swagger;
        }
        if (plugin.name === 'fastify-oauth2'
          && process.env.FACEBOOK_CLIENT_ID
          && process.env.FACEBOOK_CLIENT_SECRET) {
          const passport = require('passport');
          const oauthPlugin = require('fastify-oauth2');
          const FacebookTokenStrategy = require('passport-facebook-token');
          plugin.options.name = 'facebookOAuth2';
          plugin.options.credentials = {
            client: {
              id: process.env.FACEBOOK_CLIENT_ID,
              secret: process.env.FACEBOOK_CLIENT_SECRET,
            },
            auth: oauthPlugin.FACEBOOK_CONFIGURATION,
          };
          passport.use(new FacebookTokenStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
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
                const userFound = await db.user.findOne({ email: profile._json.email });
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
                  db.user.save(newUser);
                  request.user = newUser;
                } else {
                  request.user = userFound;
                }
                next();
                return true;
              })(request, reply);
            } else {
              next();
            }
          });
        }
        if (!plugin.env) {
          api.register(require(plugin.name), plugin.options);
        } else if (plugin.env === process.env.NODE_ENV) {
          api.register(require(plugin.name), plugin.options);
        }
      });
    }
    return true;
  } catch (e) {
    console.log('Error Loading plugin: ', e.message);
    return false;
  }
}

module.exports = plugins;
