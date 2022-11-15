import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3333

app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  return res.json({ test: 'hello world' })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
