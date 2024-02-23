import passport, {type Strategy} from 'passport'
import consola from 'consola'
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
  console.log('AAA setting up passport')
  consola.log('AAA setting up passport')

  const SAMLConfig: SamlConfig = {
    path: '/api/saml-callback',
    issuer: 'passport-saml',
    entryPoint: process.env.SAML_ENTRY_POINT!,
    // absolutely required or it will not work
    cert: process.env.SAML_CERT!,
    signatureAlgorithm: "sha512",
  }
  console.log('BBB', SAMLConfig)
  consola.log(`BBB ${SAMLConfig}`)

  const samlStrategy: AbstractStrategy = new SAMLStrategy(SAMLConfig, verifySAML)
  console.log('CCC', samlStrategy)
  passport.use(samlStrategy as Strategy)
  console.log('DDD')

  const localStrategy: LocalStrategy = new LocalStrategy(verifyLocal);
  console.log('EEE', localStrategy)
  passport.use(localStrategy)
  console.log('FFF')

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  console.log('GGG')
  passport.deserializeUser((user, done) => {
    done(null, USER)
  })
  console.log('HHH')


  console.log("finished setting up passport")
  consola.log("finished setting up passport")
  return next()
})