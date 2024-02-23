import {expressifyRequest, getExpressSession} from "~/server/utils/express-compat";
import {IncomingMessage} from "node:http";
import {H3Event} from "h3";
import consola from 'consola'
import {ALLOWED_PATH_PREFIXES, PATHS_TO_401, UNAUTHORIZED_FORWARD_TO_PATH} from "~/utils/authz/config";



function checkIfAllowed(req: IncomingMessage): boolean {
  const {path} = expressifyRequest(req);
  const allowedPath = ALLOWED_PATH_PREFIXES.some(prefix => {
    const startsWith = path.startsWith(prefix)
    consola.log('startsWith', startsWith, prefix, path)
    return startsWith
  });
  if (allowedPath) {
    return true
  }
  const sessionData = getExpressSession(req);
  const user = sessionData?.passport?.user
  if (user) {
    console.log("no user")
    return true
  }
  return false
}

enum AuthProtectionResponse {
  Unauthorized,
  Forward,
}

const forwardOrUnauthorized = (event: H3Event<Request>): AuthProtectionResponse => {
  const path = getRequestPath(event)
  if (PATHS_TO_401.some(prefix => path.startsWith(prefix))) {
    return AuthProtectionResponse.Unauthorized
  }
  return AuthProtectionResponse.Forward
}

export default defineEventHandler(async (event: H3Event<Request>) => {
  console.log("Auth protection middleware")
  const {req, res} = event.node
  const isAllowed = checkIfAllowed(req);
  console.log('isAllowed', isAllowed, getRequestPath(event))
  if (!isAllowed) {
    switch (forwardOrUnauthorized(event)) {
      case AuthProtectionResponse.Forward:
        await setResponseStatus(event, 301)
        await setResponseHeader(event, 'Location', UNAUTHORIZED_FORWARD_TO_PATH)
        break
      case AuthProtectionResponse.Unauthorized:
        throw createError({
          status: 401,
          message: 'Unauthorized'
        })
    }
  }
})