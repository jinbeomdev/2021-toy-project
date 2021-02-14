import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { VideoModel } from "./video";

@Table
class VideoCommentModel extends Model<VideoCommentModel> {
    @Column
    description: string

    @Column
    like: number

    @Column
    dislike: number
    
    @ForeignKey(() => VideoModel)
    @Column
    videoId: number

    @BelongsTo(() => VideoModel)
    Video: VideoModel

    @ForeignKey(() => VideoCommentModel)
    @Column
    originVideoCommentId: number

    @BelongsTo(() => VideoCommentModel)
    originVideoComment: VideoCommentModel

    @HasMany(() => VideoCommentModel)
    nestedComments: VideoCommentModel[]
}

export {
    VideoCommentModel

};
