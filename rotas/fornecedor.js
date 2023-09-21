const express = require('express')
const connection = require("../config/database")

module.exports = (app) => {
    const rotas = express.Router() 
    app.get('/fornecedor', (req, res)=>{
        connection.query(
          'select * from fornecedor',
          (err, results, fields)=>{
            if(err) console.log(err)
            res.send(results)
          }
        )
      })
      
      app.get('/fornecedor/:id_fornecedor', (req, res) => {
        var id_fornecedor = req.params.id_fornecedor
       
         connection.query(
           `select * from fornecedor where id_fornecedor = ${id_fornecedor}`,
           (err, results, fields) => {
             if(err) console.log(err)
             res.send(results)
           }
         );
       })
       
       app.post('/fornecedor_del/:id_fornecedor', (req, res) => {
         var id_fornecedor = req.params.id_fornecedor
          connection.query(
            `select * from fornecedor where id_fornecedor = ${id_fornecedor}`,
            (err, results, fields) => {
              if(err) console.log(err)
              res.send(results)
            }
          );
       })
       
       app.post('/fornecedor', (req, res)=> {
         var razao = req.body.razao
         var cpf_cnpj = req.body.cpf_cnpj
         var contato = req.body.contato
         var logradouro = req.body.logradouro
         var cidade = req.body.cidade
         var uf = req.body.uf
         console.log(req.files)
       
         var sql = `insert into fornecedor(razao, cpf_cnpj, contato, `+
               `logradouro, cidade, uf) values("${razao}", "${cpf_cnpj}", `+
               `"${contato}", "${logradouro}", "${cidade}", "${uf}")`
          connection.query(sql, (erro, resultado) =>{
             if(erro) res.send(erro)
             console.log(req.files)
              var caminhoTemp = req.files.logomarca.path
              var caminhoNovo = `./uploads/fornecedor/${resultado.insertId}.png`
              fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
                console.log(err)
                res.send(resultado)
             })
                 
                })
       })
       
       app.post('/fornecedor_up', (req, res)=> {
      
         var sql =  `update fornecedor(razao, cpf_cnpj, contato, `+
         `logradouro, cidade, uf) values("${razao}", "${cpf_cnpj}", `+
         `"${contato}", "${logradouro}", "${cidade}", "${uf}")`
      connection.query(sql, (erro, resultado) =>{
       if(erro) res.send(erro)
       console.log(req.files)
        var caminhoTemp = req.files.logomarca.path
        var caminhoNovo = `./uploads/fornecedor/${resultado.insertId}.png`
        fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
          console.log(err)
          res.send(resultado)
       })
           
          })
      })
    }