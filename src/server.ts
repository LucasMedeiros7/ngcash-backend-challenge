import express from 'express'
import cors from 'cors'
import { routes } from './routes/index'

const app = express()
const port = 3333

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
