const express = require('express');
const fs = require('fs');
const moment = require('moment');
const connection = require("../config/database");
const { mkdirp } = require('mkdirp');

module.exports = (app) => {
    const rotas = express.Router();

    app.use("/", rotas);

    rotas.get("/cliente", (req, res) => {
        res.send("auau folou");
    })

    rotas.get('/cliente_all', function (req, res, next) {
        connection.query(
            'select * from cliente',
            (err, results, fields) => {
                if (err)
                    console.log(err)
                res.send(results)
            }
        );
    });

    rotas.get('/cliente_byId/:id_cliente', function (req, res, next) {
        var id_cliente = req.params['id_cliente'];
        connection.query(
            `select * from cliente where id_cliente = ${+id_cliente}`,
            (err, results, fields) => {
                if (err)
                    console.log(err)
                var resultado = {};
                resultado.id_cliente = results[0].id_cliente;
                resultado.nome = results[0].nome;
                resultado.sobrenome = results[0].sobrenome;
                resultado.email = results[0].email;
                resultado.salario = results[0].salario;
                resultado.data_cadastro = moment(results[0].data_cadastro).format("DD/MM/YYYY");

                res.send(resultado);
            }
        );
    });

    rotas.get('/cliente_email/:email', function (req, res, next) {
        var email = req.params['email'];
        var sql = `select * from cliente where email = "${email}"`;
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

    rotas.post('/cliente', function (req, res, next) {
        var nome = req.body.nome;
        var sobrenome = req.body.sobrenome;
        var email = req.body.email;
        var salario = +req.body.salario;

        var sql = `insert into cliente(nome, sobrenome,` +
            ` email, data_cadastro, salario) values ("${nome}", "${sobrenome}", ` +
            `"${email}", "${moment().format("YYYY-MM-DD")}", ${salario})`

        connection.query(
            sql, (erro, resultados, fields) => {
                if (erro)
                    res.send(erro)

                var path = './uploads/cliente';

                if(Object.keys(req.files).length > 0){
                    mkdirp(path).then(made => {
                        var caminhoTemp = req.files.avatar.path;
                        var type = req.files.avatar.type.split('/');
                        var caminhoNovo = `${path}/C${resultados.insertId}.${type[type.length - 1]}`;
        
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

    rotas.post('/cliente_del/:id_cliente', function (req, res, next) {
        var id_Cliente = req.params['id_cliente'];
        db.query(
            `delete from cliente where id_cliente = ${+id_Cliente}`,
            (err, results, fields) => {
                if (err)
                    console.log(err)
                var path = `./uploads/cliente/C${id_Cliente}.jpeg`;
                if (fs.existsSync(path)) {
                    fs.unlink(path, (err) => {
                        console.log(err)
                    })
                }
                res.send(results)
            }
        );
    });

    rotas.patch('/cliente/:id_cliente', function (req, res, next) {
        var nome = req.body.nome;
        var sobrenome = req.body.sobrenome;
        var email = req.body.email;
        var salario = req.body.salario;
        var id_cliente = +req.params.id_cliente;

        var sql = `
            update cliente set nome = "${nome}", sobrenome = "${sobrenome}", ` +
            `email = "${email}", salario = ${salario} where id_cliente = ${id_cliente}`
        connection.query(
            sql, (erro, resultados, fields) => {
                if (erro){
                    console.log(erro)
                    res.send(erro)
                }
                var path = './uploads/cliente';

                if(Object.keys(req.files).length > 0){
                    mkdirp(path).then(made => {
                        var caminhoTemp = req.files.avatar.path;
                        var type = req.files.avatar.type.split('/');
                        var caminhoNovo = `${path}/C${id_cliente}.${type[type.length - 1]}`;
        
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