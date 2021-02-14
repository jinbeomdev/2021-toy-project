import * as express from 'express'
import { parse, join } from 'path'
import { storeVideo } from '../../express'
import { VideoModel } from '../../models/video'
import { queue } from '../../redis'
import { createThumbnail } from '../../ffmpeg'
import { VideoCommentModel } from '../../models/video-comment'

const videoRouter = express.Router()

const videoStorer = storeVideo()
videoRouter.post('/video/upload', videoStorer, uploadVideo)
videoRouter.get('/video/list', getVideoList)
videoRouter.get('/video/:uuid', getVideo)
videoRouter.post('/video/:uuid/comment', reply)
videoRouter.get('/video/comment/list', listComments)
videoRouter.post('/video/:uuid/comment/:commentId', replyComment)
export {
    videoRouter
}

function uploadVideo(req: express.Request, res: express.Response) {
    const videoModel = new VideoModel({ uuid: parse(req.file.filename).name, waitTranscoding: true })
    videoModel.save()
    createThumbnail({
        inputPath: req.file.path,
        outputPath: 'storage/thumbnail',
        uuid: parse(req.file.filename).name
    })
    queue.add('job', {
       inputPath: req.file.path, 
       outputPath: join('storage/hls', parse(req.file.filename).name),
       uuid: parse(req.file.filename).name
    })
    res.sendStatus(200)
}

async function getVideoList(req: express.Request, res: express.Response) {
    const video = await VideoModel.findAll()
    return res.json(video)
}

async function getVideo(req: express.Request, res: express.Response) {
    const uuid: string = req.params.uuid
    const video = await VideoModel.findOne({
        include: [
            {
                model: VideoCommentModel,
                required: false
            }
        ],
        where: {
            uuid: uuid
        }     
    })
    return res.json(video)
}

async function reply(req: express.Request, res: express.Response) {
    console.log(req.body)
    const videoComment = new VideoCommentModel(
        req.body
    )
    videoComment.save()
    res.sendStatus(200)
}

async function listComments(req: express.Request, res: express.Response) {
   const comments = await VideoCommentModel.findAll()
   res.json(comments)
}

async function replyComment(req: express.Request, res: express.Response) {
    console.log(req.body)
    const videoComment = new VideoCommentModel(
        req.body
    )
    res.sendStatus(200)
}