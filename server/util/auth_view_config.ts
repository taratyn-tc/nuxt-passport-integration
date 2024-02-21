import type {AuthenticateOptions} from "passport";

export const COMMON_AUTH_VIEW_CONFIG: AuthenticateOptions = {
    successRedirect: '/success',
    failureRedirect: '/failure',
    session: true,
};