const express = require('express')
const app = express()
const mysql = require('mysql2');
const port = 3012
const bodyParser = require("body-parser")
const moment = require("moment")

app.use(bodyParser.urlencoded({extended : true}))

const connection = mysql.createConnection({
  host: 'aulascefet.c8tuthxylqic.sa-east-1.rds.amazonaws.com',
  user: 'aluno',
  database: 'aulas_web',
  password : 'alunoc3f3t',
});

app.get('/', (req, res) => {
  res.send("Backend Matheus Emanuel da Silva Rodando..." )
})

app.get('/cliente', (req, res) => {
  connection.query(
    'select * from cliente',
    (err, results, fields) => {
      if(err) console.log(err)
      res.send(results)
    }
  );
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})