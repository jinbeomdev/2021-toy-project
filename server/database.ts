import { join } from 'path'
import { Sequelize } from 'sequelize-typescript'

const sequelize = new Sequelize({
    database: '2021-toy-project',
    dialect: 'postgres',
    username: '2021-toy-project',
    password: '2021-toy-project',
    models: [join(__dirname, 'models')],
    modelMatch: (filename: string, member: string): boolean => {
        return filename + 'model' === member.toLowerCase();
    }
})

export {
    sequelize
}