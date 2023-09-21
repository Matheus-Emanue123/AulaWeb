const express = require('express')
const connection = require("../config/database")

module.exports = (app) => {
    const rotas = express.Router()

    rotas.get("/novarota", (req, res)=>{
        res.send("Nova rota para clientes")
    })

    
rotas.get('/cliente', (req, res) => {
    connection.query(
      'select * from cliente',
      (err, results, fields) => {
        if(err) console.log(err)
        res.send(results)
      }
    );
  })
  
  rotas.get('/cliente/:id_cliente', (req, res) => {
   var id_cliente = req.params.id_cliente
    connection.query(
      `select * from cliente where id_cliente = ${id_cliente}`,
      (err, results, fields) => {
        if(err) console.log(err)
        res.send(results)
      }
    );
  })
  
  rotas.get('/cliente_email/:email', (req, res) => {
    var email = req.params.email
     connection.query(
       `select * from cliente where email = "${email}"`,
       (err, results, fields) => {
         if(err) console.log(err)
         console.log(results)
        if(results.lenght > 0) res.send({existe : true})
        else res.send({existe : false})
       }
     );
   })
   
  rotas.post('/cliente_del/:id_cliente', (req, res) => {
    var id_cliente = req.params.id_cliente
     connection.query(
       `select * from cliente where id_cliente = ${id_cliente}`,
       (err, results, fields) => {
         if(err) console.log(err)
         res.send(results)
       }
     );
  })
  
  rotas.post('/cliente', (req, res)=> {
    var nome = req.body.nome
    var sobrenome = req.body.sobrenome
    var email = req.body.email
    var data_cadastro = moment().format("YYYY-MM-DD")
    var salario = req.body.salario
    console.log(req.files)
  
    var sql = `insert into cliente(nome, sobrenome, email, `+
          `data_cadastro,salario) values("${nome}", "${sobrenome}", `+
          `"${email}", "${data_cadastro}", ${salario})`
     connection.query(sql, (erro, resultado) =>{
        if(erro) res.send(erro)
        console.log(req.files)
         var caminhoTemp = req.files.avatar.path
         var caminhoNovo = `./uploads/cliente/${resultado.insertId}.png`
         fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
           console.log(err)
           res.send(resultado)
        })
            
           })
  })
  
  rotas.post('/cliente_up/:id_cliente?', (req, res)=> {
    var sql = `update cliente set nome = "${nome}", sobrenome = "${sobrenome}", email = "${email}", salario = ${salario} `
     + `where id_cliente = ${id_Cliente}`
     
    connection.query(sql, (erro, resultado)=>{
           connection.query(sql, (erro, resultado)=>{
            if(erro) res.send(erro)
            res,send(resultado)
           })
  })
  });

  app.use("/", rotas)
}
