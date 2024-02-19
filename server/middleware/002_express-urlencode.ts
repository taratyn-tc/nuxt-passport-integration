import {urlencoded } from 'express'
let urlencodedParser = urlencoded({})
export default fromNodeMiddleware((req, res, next) => {
    urlencodedParser(req, res, next)
})
