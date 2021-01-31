import * as express from 'express'

const staticRouter = express.Router()

staticRouter.use('/hls', express.static('storage/hls', { fallthrough: false }))
staticRouter.use('/thumbnail', express.static('storage/thumbnail', { fallthrough: false }))

export {
    staticRouter
}
