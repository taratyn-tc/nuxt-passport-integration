import passport from 'passport'
import {Strategy as SAMLStrategy, type VerifyWithoutRequest, type SamlConfig} from 'passport-saml'
import {Strategy as LocalStrategy, VerifyFunction} from "passport-local";

interface MyUser {
  id: number;
  username: string;
}

declare global {
  namespace Express {
    interface User extends MyUser {
    }
  }
}

const USER: MyUser = {id: 1, username: 'admin'};

export default fromNodeMiddleware((req, res, next) => {
  console.log('setting up passport')

  const SAMLConfig: SamlConfig = {
    path: '/api/saml-callback',
    issuer: 'passport-saml',
    entryPoint: process.env.SAML_ENTRY_POINT!,
    // absolutely required or it will not work
    cert: process.env.SAML_CERT!,
    signatureAlgorithm: "sha512",
  }

  const verifySAML: VerifyWithoutRequest = (profile, done) => {
    console.log('in saml strat after auth', profile)

    // return done(new Error("test"), )
    return done(null, USER)
  };
  const samlStrategy: SAMLStrategy = new SAMLStrategy(SAMLConfig, verifySAML)
  passport.use(samlStrategy)

  const verifyLocal: VerifyFunction = function (username, password, done) {
    console.log('in strat')
    if (username === 'admin' && password === 'admin') {
      console.log('is good')
      return done(null, USER)
    }
    console.error("no good")
    return done(null, false)
  };
  const localStrategy: LocalStrategy = new LocalStrategy(verifyLocal);

  passport.use(localStrategy)

  passport.serializeUser((user, done) => {done(null, user.id)})
  passport.deserializeUser((user, done) => {done(null, USER)})


  console.log("finished setting up passport")
  return next()
})