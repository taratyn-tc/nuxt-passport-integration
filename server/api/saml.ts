import passport from 'passport'
import {response, request} from 'express'
import {COMMON_AUTH_VIEW_CONFIG} from "~/server/util/auth_view_config";

const authView = passport.authenticate('saml', COMMON_AUTH_VIEW_CONFIG);


export default fromNodeMiddleware((req, res, next) => {
    Object.setPrototypeOf(res, response)
    Object.setPrototypeOf(req, request)
    console.log('about to auth')
    authView(req, res, next)
})
