import type {Request} from 'express'

const isExpressRequestWithSession = (req: any): req is Request => {
  return !!req.session && !!req.session.cookie
}

export default defineEventHandler(async (event) => {
  console.log('Session!')
  const {req} = event.node
  if (isExpressRequestWithSession(req)) {
    console.log('Session exists')
    return req.session

  }
  return createError({
    status: 500,
    message: 'Session not found'
  })

})