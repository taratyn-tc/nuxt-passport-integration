import {IncomingMessage, ServerResponse} from "node:http";

import {type NextFunction, type Request, request, type Response, response} from "express";
import session from "express-session";

export const expressifyRequest = (req: IncomingMessage): Request => {
  if (Object.getPrototypeOf(req) !== request) {
    Object.setPrototypeOf(req, request)
  }
  const eReq = req as Request
  return eReq;
}

type ExpressifyT = (req: IncomingMessage, res: ServerResponse<IncomingMessage>, next: (err?: any) => void) => [Request, Response, NextFunction];

export const expressifyResponse = (res: ServerResponse<IncomingMessage>): Response => {
  if (Object.getPrototypeOf(res) !== response) {
    Object.setPrototypeOf(res, response)
  }
  const eRes = res as Response
  return eRes;
}

export const expressify: ExpressifyT = (req: IncomingMessage, res: ServerResponse<IncomingMessage>, next): [Request, Response, NextFunction] => {
  const eReq = expressifyRequest(req);
  const eRes = expressifyResponse(res);
  const eNext = next as NextFunction
  return [eReq, eRes, eNext]
};

interface SessionData extends session.SessionData {
  passport?: Record<string, string | number >
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

type SessionWithData = session.Session & Partial<SessionData>;
export const getExpressSession = (req: IncomingMessage): SessionWithData => {
  if (!isExpressRequestWithSession(req)) {
    throw createError({
      status: 500,
      message: 'Session not found'
    })
  }
  const currentSession: SessionWithData = req.session;
  if (!isOurSessionData(currentSession)) {
    throw createError({
      status: 500,
      message: 'Session data not found'
    })
  }
  return currentSession;
};