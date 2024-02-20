import {urlencoded } from 'express'
const urlencodedParser = urlencoded({extended: true})
export default fromNodeMiddleware((req, res, next) => {
    urlencodedParser(req, res, next)
})
