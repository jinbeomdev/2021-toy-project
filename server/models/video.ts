import { Column, Model, Table } from 'sequelize-typescript';

@Table
class VideoModel extends Model<VideoModel> {
    @Column
    uuid: string

    @Column
    waitTranscoding: boolean
}

export {
    VideoModel
}