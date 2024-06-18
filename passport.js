const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('./db');
const keys = require('./config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
  passport.use(
    new Strategy(opts, async (jwt_payload, done) => {
      try {
        const owner = await db.query('SELECT * FROM owner WHERE id_owner = $1', [jwt_payload.id_owner]);
        if (owner.rows.length > 0) {
          return done(null, owner.rows[0]);
        }
        return done(null, false);
      } catch (err) {
        console.error(err);
        return done(err, false);
      }
    })
  );
};