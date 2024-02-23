import {type NextFunction, type Request, request, type Response, response} from "express";
import {IncomingMessage, ServerResponse} from "node:http";
import session from "express-session";

export const expressifyRequest = (req: IncomingMessage): Request => {
  if (Object.getPrototypeOf(req) !== request) {
    Object.setPrototypeOf(req, request)
  }
  const eReq = req as Request
  return eReq;
}

type ExpressifyT = (req: IncomingMessage, res: ServerResponse<IncomingMessage>, next: (err?: any) => void) => [Request, Response, NextFunction];
export const expressify: ExpressifyT = (req: IncomingMessage, res: ServerResponse<IncomingMessage>, next): [Request, Response, NextFunction] => {
  const eReq = expressifyRequest(req);
  if (Object.getPrototypeOf(res) !== response) {
    Object.setPrototypeOf(res, response)
  }
  const eRes = res as Response
  const eNext = next as NextFunction
  return [eReq, eRes, eNext]
};

interface SessionData extends session.SessionData {
  passport?: Record<string, string | number>
}

const isOurSessionData = (data: session.SessionData): data is SessionData => !!data


/**
 * Roughly looking for a session object in the request
 * @param req
 */
export const isExpressRequestWithSession = (req: IncomingMessage): req is Request => {
  const eReq = req as Request
  return !!eReq.session && !!eReq.session.cookie
}

export const getExpressSession = (req: IncomingMessage) => {
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
  return sessionData;
};