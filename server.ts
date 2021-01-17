import * as express from 'express'

const app = express()
const port = 3000
app.get('/api/v1/video/upload', (req: express.Request, res: express.Response) => {
    res.json('hello world')
})
app.listen(port, () => {
    console.log('express successfully started')
})