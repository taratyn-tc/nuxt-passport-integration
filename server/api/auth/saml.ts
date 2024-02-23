import passport from 'passport'
import {COMMON_AUTH_VIEW_CONFIG} from "~/server/utils/auth_view_config";
import {expressify} from "~/server/utils/express-compat";

const authView = passport.authenticate('saml', COMMON_AUTH_VIEW_CONFIG);


export default fromNodeMiddleware((req, res, next) => {
    const [eReq,eRes, eNext] = expressify(req, res, next);
    authView(eReq, eRes, eNext)
})
