import {isExpressRequestWithSession} from "~/server/utils/express-compat";

export default defineEventHandler(async (event) => {
  console.log('Session!')
  const {req} = event.node
  if (!isExpressRequestWithSession(req)) {
    return createError({
      status: 500,
      message: 'Session not found'
    })
  }
  console.log('Session exists')
  return req.session
})
