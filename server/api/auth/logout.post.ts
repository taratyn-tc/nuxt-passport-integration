import {getExpressSession} from "~/server/utils/express-compat";
import {IncomingMessage} from "node:http";
import {clearSession} from "h3";


export default defineEventHandler(async (event) => {
  const {req} = event.node
  await removeExpressSession(req)
  await clearSession(event, {})
  setResponseStatus(event, 205)
})

const removeExpressSession = (req: IncomingMessage): Promise<void> => {
  return new Promise((resolve, reject): void => {
    const s = getExpressSession(req)
    s.passport = {}
    s.save((err) => {
      if (err) {
        reject(createError({
          message: 'Failed to save session',
          status: 500,
          cause: err
        }))
      } else {
        s.regenerate((err) => {
          if (err) {
            reject(createError({
              message: 'Failed to regenerate session',
              status: 500,
              cause: err
            }))
          }
          resolve()
        })
      }
    })
  })
}