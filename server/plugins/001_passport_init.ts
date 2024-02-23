import passport, {type Strategy} from 'passport'
import {AbstractStrategy, type SamlConfig, Strategy as SAMLStrategy, type VerifyWithoutRequest} from 'passport-saml'
import {Strategy as LocalStrategy, VerifyFunction} from "passport-local";

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

export default defineNitroPlugin((def) => {
  const SAMLConfig: SamlConfig = {
    path: '/api/auth/saml-callback',
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

})