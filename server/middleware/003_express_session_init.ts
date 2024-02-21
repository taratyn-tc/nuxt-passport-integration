import session from 'express-session'
import {expressify} from "~/server/util/express-compat";

const sessionMiddleware = session({
  secret: process.env.NUXT_SECRET!,
  saveUninitialized: false,
  resave: true,
  store: new session.MemoryStore(),
})

export default fromNodeMiddleware((req, res, next) => {
  const [eReq, eRes, eNext] = expressify(req, res, next)
  sessionMiddleware(eReq, eRes, eNext)
})
