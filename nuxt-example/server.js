const express = require('express')
const app = express()
const port = 3000
const handler = require('./.nuxt/serverless/node')

app.use(express.static('dist'))
app.use(handler)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
