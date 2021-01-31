import * as express from 'express'
import * as morgan from 'morgan'
import * as cors from 'cors'
import { staticRouter } from './server/controllers/api/static'
import { videoRouter } from './server/controllers/api/video'
import { sequelize } from './server/database'

sequelize.authenticate()
.then(() => {
    sequelize.sync({ force: true })
    console.info('database successfully is connected')
})
.catch(() => {
    process.exit(1)
})
const app = express()
const port = 3000
app.use(morgan('combined'))
app.use(cors())
app.use('/api/v1', videoRouter)
app.use('/static', staticRouter) 
app.listen(port, () => {
    console.info('express successfully started')
})
