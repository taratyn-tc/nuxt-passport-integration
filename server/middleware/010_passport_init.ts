import passport, {type Strategy} from 'passport'
import {Strategy as SAMLStrategy, type VerifyWithoutRequest, type SamlConfig, AbstractStrategy} from 'passport-saml'
import {Strategy as LocalStrategy, VerifyFunction} from "passport-local";
import {Profile} from "passport-saml/lib/passport-saml/types";

interface MyUser extends Record<string, string | number> {
  id: number;
  username: string;
}

declare global {
  namespace Express {
    interface User extends MyUser {
    }
    interface Request {
    }
  }
}

const USER: MyUser = {id: 1, username: 'admin'};

const verifySAML: VerifyWithoutRequest = (profile, done) => {
  console.log('in saml strategy after auth', profile)
  return done(null, USER)
};

const verifyLocal: VerifyFunction = function (username, password, done) {
  if (username === 'admin' && password === 'admin') {
    return done(null, USER)
  }
  return done(null, false)
};

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

  const samlStrategy: AbstractStrategy = new SAMLStrategy(SAMLConfig, verifySAML)
  passport.use(samlStrategy as Strategy)

  const localStrategy: LocalStrategy = new LocalStrategy(verifyLocal);
  passport.use(localStrategy)

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((user, done) => {
    done(null, USER)
  })


  console.log("finished setting up passport")
  return next()
})