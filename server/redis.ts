import { Job, Queue, Worker } from 'bullmq'
import { transcode } from './ffmpeg'

const queue = new Queue('transcode')
const worker = new Worker('transcode', async (job: Job) => {
    transcode(job.data)
})
worker.on('completed', (job: Job, returnValue: any) => {
})
worker.on('progress', (job: Job, progress: number | object) => {
})
worker.on('failed', (job: Job, failedReason: string) => {
})

export {
    queue
}