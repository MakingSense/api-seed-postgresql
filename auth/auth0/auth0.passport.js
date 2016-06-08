import passport from 'passport';
import Auth0Strategy from 'passport-auth0';

exports.setup = function(UserService, config) {
  
  passport.use(new Auth0Strategy({
      domain:       config.jwt.domain,
      clientID:     config.jwt.clientId,
      clientSecret: config.jwt.secretUtf8,
      callbackURL:  '/auth/auth0/callback'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      //find by id, if does not exist, create
      var id = profile.id;

      UserService
        .findByAuth0Id(id)
        .then(user => {
          if (!user) {
            const newUser = {
              name: profile.name.familyName || profile.emails[0].value,
              email: profile.emails[0].value,
              type: 'broker'
            };
            return UserService
              .create(newUser, {provider: 'auth0', authId: profile.id})
              .tap
          }
          return user;
        })
        .then(user => {
          done(null, user);
        })
        .catch(done);
    }
  ));
};

