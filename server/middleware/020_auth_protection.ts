import {expressifyRequest, getExpressSession} from "~/server/utils/express-compat";
import {IncomingMessage} from "node:http";

const ALLOWED_PATH_PREFIXES: string[] = [
  '/__nuxt_error',
  '/api/public',
  '/api/auth',
]

function checkIfAllowed(req: IncomingMessage) {
  const {path} = expressifyRequest(req);
  const sessionData = getExpressSession(req);
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

export default defineEventHandler((event) => {
  const {req, res} = event.node
  checkIfAllowed(req);
  // go ahead!
})