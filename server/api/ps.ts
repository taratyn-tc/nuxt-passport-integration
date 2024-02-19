import passport from 'passport'
import {type VerifyFunction, Strategy as LocalStrategy} from 'passport-local'
import {response, request} from 'express'

const verify: VerifyFunction = function(username, password, done) {
    console.log('in strat')
    if (username === 'admin' && password === 'admin') {
        console.log('is good')
        return done(null, {id: 1, username: 'admin'})
    }
    console.error("no good")
    return done(null, false)
};
const localStrategy: LocalStrategy = new LocalStrategy(verify);
passport.use(localStrategy)
const authView = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: false,
});


export default fromNodeMiddleware((req, res, next) => {
    Object.setPrototypeOf(res, response)
    Object.setPrototypeOf(req, request)
    console.log('about to auth')
    authView(req, res, next)
})