import consola from 'consola'

import {ALLOWED_PATH_PREFIXES, UNAUTHORIZED_FORWARD_TO_PATH} from "~/utils/authz/config";
import {$fetch} from "ofetch";
import type {SessionData} from "~/utils/session-data";

async function getSessionData(): Promise<SessionData> {
  if (process.server) {
    consola.log("AAA we're on the server")
    const event = useRequestEvent()
    consola.log("BBB", event)
    // use a dyanmic import so tha we don't try to load express on the clientside.
    // trying to load expresson the clientside leads to a lot of warnings in the console.
    const {getExpressSession} = await import('~/server/utils/express-compat')
    const sessionData = getExpressSession(event.node.req)
    consola.log("CCC", sessionData)
    return sessionData
  } else {
    const sessionData = await $fetch('/api/auth/session')
    consola.log("DDD", sessionData)
    return sessionData
  }
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const {path} = to
  consola.log('AAA', to)
  if (ALLOWED_PATH_PREFIXES.some(prefix => path.startsWith(prefix))) {
    return
  }
  const session = await getSessionData();
  const user = session?.passport?.user
  if (!user) {
    consola.log('EEE', 'no user')
    return navigateTo(UNAUTHORIZED_FORWARD_TO_PATH)
  }
})