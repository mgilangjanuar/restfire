const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const path = require('path')
const { default: handler } = require('../api/proxy')

const app = express()

app.use(cors())
app.use(bodyParser.json({ limit: '100mb' }))

app.post('/proxy', handler)

app.use(express.static(path.join(__dirname, '..', 'build')))
app.use((_, res) => res.sendFile(path.join(__dirname, '..', 'build', 'index.html')))

const server = app.listen(4002, () => console.log('started...'))

module.exports = { server }