const express = require('express')
const path = require('path')
const axios = require('axios')
const app = express()

const history = require('connect-history-api-fallback')

const headerConf = {
  refer: 'https://hera-daily.tuya-inc.cn:7799',
  host: 'hera-daily.tuya-inc.cn:7799',
  Cookie: 'SSO_USER_TOKEN=p_d3e1a42944ca308c8a76cf2d99b2ca5c;HERA_Token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzc29JZCI6IjIyIiwic3NvX25hbWUiOiJmdXNiIiwiYXVkIjoiMmRmaXJlIiwiaXNzIjoiaGVyYSIsImV4cCI6MTU5OTg4MTg2NCwidXNlcklkIjoiMSIsImlhdCI6MTU5OTYyMjY2NCwidXNlcm5hbWUiOiJoZXJhIn0.dVfDxMdiaQK4WOcn62LiI-WvaGwPYCd12UjyCwQtvzU'
}

let apiRoutes = express.Router()
console.log(apiRoutes)

apiRoutes.post('/scheduleCenter/init.do', (req, res) => {
  console.log(req)
  axios.post('/scheduleCenter/init.do', {}, {
    headers: headerConf
  }).then(response => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.json(response.data)
  })
})

app.use(history())
app.use('/', apiRoutes)
app.use(express.static(path.join(__dirname, 'dist')))

app.listen(3000)
console.log(app)
