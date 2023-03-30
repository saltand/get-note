const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const dataStoreFile = 'dataStore.json'

// 读取已有数据
let dataStore = new Map()
if (fs.existsSync(dataStoreFile)) {
  const rawData = fs.readFileSync(dataStoreFile, 'utf-8')
  const jsonData = JSON.parse(rawData)
  dataStore = new Map(Object.entries(jsonData))
}

// 将数据存储到本地文件
function saveData() {
  const jsonData = JSON.stringify(Object.fromEntries(dataStore))
  fs.writeFileSync(dataStoreFile, jsonData, 'utf-8')
}

// 第一个接口：接受两个参数 path 和 content
app.post('/store', (req, res) => {
  const { path, content } = req.body

  if (!path || !content) return res.status(400).json({ error: '参数 path 和 content 均不能为空' })

  dataStore.set(path, content)
  saveData() // 将数据存储到本地文件
  res.status(200).json({ message: '数据已存储' })
})

// 第二个接口：根据 path 返回 content
app.get('/retrieve/:path', (req, res) => {
  const { path } = req.params

  if (!path) return res.status(400).json({ error: '参数 path 不能为空' })

  const content = dataStore.get(path)

  if (!content) return res.status(200).json({ message: '找不到与此 path 对应的内容' })

  res.status(200).json({ content })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.warn(`服务器已启动，监听端口：${PORT}`)
})
