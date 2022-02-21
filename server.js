const express = require('express')
const path = require('path')
const dotEnv = require('dotenv')

const app = express()

dotEnv.config()

app.use(express.static(path.join(__dirname, 'dist')))
app.set('port', process.env.PORT || 3000)

const server = app.listen(app.get('port'), () => {
  console.log(`Listening on port ${server.address().port}`)
})