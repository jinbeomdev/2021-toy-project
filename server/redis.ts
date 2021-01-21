import { Job, Queue, Worker } from 'bullmq'
import { transcode } from './ffmpeg'
import { VideoModel } from './models/video'

const queue = new Queue('transcode')
const worker = new Worker('transcode', async (job: Job) => {
    transcode(job.data)
    const videoModel = await VideoModel.findOne({
        where: {
            uuid: job.data.uuid
        }
    }) as VideoModel
    videoModel.update({
        waitTranscoding: false
    })
})

export {
    queue
}