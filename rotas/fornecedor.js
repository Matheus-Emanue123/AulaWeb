const express = require('express');
const fs = require('fs');
const moment = require('moment');
const connection = require("../config/database");
const { mkdirp } = require('mkdirp');

module.exports = (app) => {
  const rotas = express.Router();

  app.use("/", rotas);

  rotas.get("/fornecedor", (req, res) => {
    res.send("auau folou");
  })

  rotas.get('/fornecedor_all', function (req, res, next) {
    connection.query(
      'select * from fornecedor',
      (err, results, fields) => {
        if (err)
          console.log(err)
        res.send(results)
      }
    );
  });

  rotas.get('/fornecedor_byId/:id_fornecedor', function (req, res, next) {
    var id_fornecedor = req.params['id_fornecedor'];
    connection.query(
      `select * from fornecedor where id_fornecedor = ${+id_fornecedor}`,
      (err, results, fields) => {
        if (err)
          console.log(err)
        var resultado = {};
        resultado.id_fornecedor = results[0].id_fornecedor;
        resultado.razao = results[0].razao;
        resultado.cpf_cnpj = results[0].cpf_cnpj;
        resultado.contato = results[0].contato;
        resultado.logradouro = results[0].logradouro;
        resultado.cidade = results[0].cidade;
        resultado.uf = results[0].uf;

        res.send(resultado);
      }
    );
  });

  rotas.get('/fornecedor_contato/:contato', function (req, res, next) {
    var contato = req.params['contato'];
    var sql = `select * from fornecedor where contato = "${contato}"`;
    connection.query(
      sql,
      (err, results, fields) => {
        if (err)
          console.log(err)
        if (results.length > 0)
          res.send({ existe: true })
        else
          res.send({ existe: false })
      }
    );
  });

  rotas.post('/fornecedor', function (req, res, next) {
    var razao = req.body.razao;
    var cpf_cnpj = req.body.cpf_cnpj;
    var contato = req.body.contato;
    var logradouro = req.body.logradouro;
    var cidade = req.body.cidade;
    var uf = req.body.uf;

    var sql = `insert into fornecedor(razao, cpf_cnpj,` +
      ` contato, logradouro, cidade, uf) values ("${razao}", "${cpf_cnpj}", ` +
      `"${contato}", "${logradouro}", ${cidade}), "${uf}"`

    connection.query(
      sql, (erro, resultados, fields) => {
        if (erro)
          res.send(erro)

        var path = './uploads/fornecedor';

        if (Object.keys(req.files).length > 0) {
          mkdirp(path).then(made => {
            var caminhoTemp = req.files.logotipo.path;
            var type = req.files.logotipo.type.split('/');
            var caminhoNovo = `${path}/F${resultados.insertId}.${type[type.length - 1]}`;

            fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
              res.send(resultados)
            });
          }).catch(err => {
            console.log(err)
          });
        } else {
          res.send(resultados)
        }
      }
    )
  });

  rotas.post('/fornecedor_del/:id_fornecedor', function (req, res, next) {
    var id_fornecedor = req.params['id_fornecedor'];
    connection.query(
      `delete from fornecedor where id_fornecedor = ${+id_fornecedor}`,
      (err, results, fields) => {
        if (err)
          console.log(err)
        res.send(results)
      }
    );
  });

  rotas.patch('/fornecedor/:id_fornecedor', function (req, res, next) {
    var razao = req.body.razao;
    var cpf_cnpj = req.body.cpf_cnpj;
    var contato = req.body.contato;
    var cidade = req.body.cidade;
    var id_fornecedor = +req.params.id_fornecedor;

    var sql = `
            update fornecedor set razao = "${razao}", cpf_cnpj = "${cpf_cnpj}", ` +
      `contato = "${contato}",logradouro = ${logradouro} cidade = ${cidade}, uf = ${uf} where id_fornecedor = ${id_fornecedor}`
    connection.query(
      sql, (erro, resultados, fields) => {
        if (erro) {
          console.log(erro)
          res.send(erro)
        }
        var path = './uploads/fornecedor';

        if (Object.keys(req.files).length > 0) {
          mkdirp(path).then(made => {
            var caminhoTemp = req.files.logotipo.path;
            var type = req.files.logotipo.type.split('/');
            var caminhoNovo = `${path}/F${id_fornecedor}.${type[type.length - 1]}`;

            fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
              res.send(resultados)
            });
          }).catch(err => {
            console.log(err)
          });
        } else {
          res.send(resultados)
        }
      }
    )
  });
}