import {isExpressRequestWithSession} from "~/server/util/express-compat";
import session from 'express-session'

const ALLOWED_PATH_PREFIXES: string[] = [
  '/__nuxt_error',
  '/api/ps',
  '/api/public',
  '/api/saml',
  '/api/session',
]

interface SessionData extends session.SessionData {
  user?: Record<string, string | number>
}

const isOurSessionData = (data: session.SessionData): data is SessionData => !!data

function checkIfAllowed<Request>(req) {
  const {path} = req
  if (!isExpressRequestWithSession(req)) {
    throw createError({
      status: 500,
      message: 'Session not found'
    })
  }
  const currentSession = req.session;
  if (!isOurSessionData(currentSession)) {
    throw createError({
      status: 500,
      message: 'Session data not found'
    })
  }
  const sessionData: SessionData = currentSession
  const user = sessionData?.passport?.user
  if (user) {
    return
  }
  // if it's not any of the allowed paths, then it's unauthorized
  if (ALLOWED_PATH_PREFIXES.every(prefix => !path.startsWith(prefix))) {
    console.error("Unauthorized access to", path)
    throw createError({
      status: 401,
      message: 'Unauthorized'
    })
  }
}

export default fromNodeMiddleware((req, res, next) => {
  checkIfAllowed(req)
  next()
})
// export default defineEventHandler(async (event) => {
//   console.log('Session!')
//   const {req, res} = event.node
//   console.log('FFF before set header', res.getHeaders())
//   res.setHeader('X-FOO-FFF', 'BAR')
//   console.log('FFF after set header')
//   checkIfAllowed(req, event.path);
//   // go ahead!
// })