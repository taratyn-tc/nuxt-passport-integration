import session from 'express-session'
import {expressify} from "~/server/util/express-compat";
import {PrismaSessionStore} from "@quixo3/prisma-session-store";
import {PrismaClient} from "@prisma/client";

const sessionMiddleware = session({
  secret: process.env.NUXT_SECRET!,
  saveUninitialized: false,
  resave: true,
  store: new PrismaSessionStore(
    new PrismaClient(),
    {
      checkPeriod: 2 * 60 * 1000,  //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }
  ),
})

export default fromNodeMiddleware((req, res, next) => {
  const [eReq, eRes, eNext] = expressify(req, res, next)
  sessionMiddleware(eReq, eRes, eNext)
})
