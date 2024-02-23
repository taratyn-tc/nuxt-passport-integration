import type { SessionData as sessionSessionData} from "express-session";

export interface SessionData extends sessionSessionData {
  passport?: Record<string, string | number>
}