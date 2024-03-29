import Axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import os from 'os'

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

async function handler(req, res) {
  const config = { ...req.body }
  if (config.headers && config.headers.contentType === 'multipart/form-data') {
    const formData = new FormData()
    for (const key of Object.keys(config.data)) {
      if (config.data[key].file) {
        fs.writeFileSync(`${os.tmpdir()}/${config.data[key].file.name}`, config.data[key].base64.split(';base64,')[1], { encoding: 'base64' })
        formData.append(key, fs.createReadStream(`${os.tmpdir()}/${config.data[key].file.name}`))
      } else {
        formData.append(key, config.data[key])
      }
    }
    config.data = formData
    config.headers = { ...config.headers, ...formData.getHeaders() }
  }

  Axios.interceptors.request.use(config => {
    config.metadata = { startTime: new Date() }
    return config
  }, () => {})

  Axios.interceptors.response.use(response => {
    response.config.metadata.endTime = new Date()
    response = {
      ...response,
      duration: response.config.metadata.endTime - response.config.metadata.startTime
    }
    return response
  }, error => {
    error.config.metadata.endTime = new Date()
    error.duration = error.config.metadata.endTime - error.config.metadata.startTime
    return Promise.reject(error)
  })

  try {
    const resp = await Axios(config)
    const data = {
      status: resp.status,
      headers: resp.headers,
      data: resp.data,
      config: resp.config,
      duration: resp.duration,
    }
    return res.status(resp.status).send(data)
  } catch (error) {
    const response = error.response ? {
      status: error.response.status,
      headers: error.response.headers,
      data: error.response.data,
      config: error.response.config,
      duration: error.response.duration,
    } : {}
    return res.send({ ...error.response ? { response } : {}, error })
  }
}

export default allowCors(handler)