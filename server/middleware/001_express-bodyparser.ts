import {json} from 'express'

let jsonParser = json({})
export default fromNodeMiddleware((req, res, next) => {
  jsonParser(req, res, next)
})
