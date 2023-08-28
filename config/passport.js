const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../db'); 
module.exports = function(passport) {
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret_key'
    }, async (payload, done) => {
        console.log('Payload received:', payload);
        try {
            
            const user = await db.query('SELECT * FROM owner WHERE id_owner = $1', [payload.id_owner]);
            console.log('User found:', user.rows[0]);
            if (user.rows[0]) {
                return done(null, user.rows[0]);
            } else {
                return done(null, false);
            }
        } catch (error) {
            console.error('Error in JwtStrategy:', error);
            return done(error, false);
        }
    }));
};


