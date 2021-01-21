import * as ffmpeg from 'fluent-ffmpeg'
import { ensureDir } from 'fs-extra'
import { join } from 'path'

type TranscodeOptions = {
    inputPath: string,
    outputPath: string,
    uuid: string
}

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

export {
    transcode
}