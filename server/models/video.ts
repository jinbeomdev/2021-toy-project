import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { VideoCommentModel } from './video-comment';

@Table
class VideoModel extends Model<VideoModel> {
    @Column
    uuid: string

    @Column
    title: string

    @Column
    description: string

    @Column
    like: number

    @Column
    dislike: number

    @Column
    view: number

    @Column
    waitTranscoding: boolean

    @HasMany(() => VideoCommentModel)
    videoComments: VideoCommentModel[] 
}

export {
    VideoModel
};
