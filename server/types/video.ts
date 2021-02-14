import { VideoModel } from "../models/video";

type MVideo = Omit<VideoModel, 'id'>

export {
    MVideo
}