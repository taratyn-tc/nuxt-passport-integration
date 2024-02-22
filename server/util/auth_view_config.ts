import type {AuthenticateOptions} from "passport";

export const COMMON_AUTH_VIEW_CONFIG: AuthenticateOptions = {
    successRedirect: '/success',
    failureRedirect: '/api/public/failure',
    session: true,
};