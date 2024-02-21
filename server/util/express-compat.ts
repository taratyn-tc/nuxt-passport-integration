import {request, response, type Request, type Response, type NextFunction} from "express";
import type {IncomingMessage, ServerResponse} from "node:http";
import {NodeMiddleware} from "h3";

type ExpressifyT = (req: IncomingMessage, res: ServerResponse<IncomingMessage>, next: (err?: any) => void) => [Request, Response, NextFunction];
export const expressify: ExpressifyT = (req: IncomingMessage, res: ServerResponse<IncomingMessage>, next): [Request, Response, NextFunction] => {
  if (Object.getPrototypeOf(req) !== request) {
    Object.setPrototypeOf(req, request)
  }
  const eReq = req as Request
  if (Object.getPrototypeOf(res) !== response) {
    Object.setPrototypeOf(res, response)
  }
  const eRes = res as Response
  const eNext = next as NextFunction
  return [eReq, eRes, eNext]
};