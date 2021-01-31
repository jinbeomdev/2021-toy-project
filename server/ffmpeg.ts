import * as ffmpeg from 'fluent-ffmpeg'
import { ensureDir } from 'fs-extra'
import { join } from 'path'

type TranscodeOptions = {
    inputPath: string,
    outputPath: string,
    uuid: string
}

type ThumbnailOption = TranscodeOptions 

function transcode(options: TranscodeOptions) {
    ensureDir(options.outputPath)
    ffmpeg(options.inputPath)
    .audioCodec('copy')
    .videoCodec('copy')
    .addOption(`-hls_segment_filename ${join(options.outputPath, 'out.mp4')}`)
    .addOption('-hls_segment_type fmp4')
    .addOption('-hls_flags single_file')
    .addOption('-hls_playlist_type vod')
    .output(join(options.outputPath, 'out.m3u8'))
    .on('end', function() {
        console.info('transcoding finished')
    })
    .run()
}

function createThumbnail(option: ThumbnailOption) {
    ensureDir(option.outputPath)
    ffmpeg(option.inputPath)
    .thumbnail({
        count: 1,
        folder: option.outputPath,
        filename: `${option.uuid}.jpg`,
    })
}

export {
    transcode,
    createThumbnail
}