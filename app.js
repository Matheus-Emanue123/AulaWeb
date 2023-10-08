const express = require('express')
const app = express()
const mysql = require('mysql2');
const port = 3012
const bodyParser = require("body-parser")
const moment = require("moment")
const formData = require("express-form-data")
const fs = require("fs")
const cors = require("cors")

app.use(formData.parse())
app.use(bodyParser.urlencoded({extended : true}))

var corsOptions = {
  origin: '192.168.48.109',
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions))

require("./rotas/cliente")(app)
require("./rotas/fornecedor")(app)

app.get('/', (req, res) => {
  res.send("Backend de Matheus Emanuel da Silva Rodando lalala..." )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})