const mysql = require('mtsql2');
const connection = mysql.createConnection({
    host: 'aulascefet.c8tuthxylqic.sa-east-1.rds.amazonaws.com',
    user: 'aluno',
    database: 'aulas_web',
    password : 'alunoc3f3t',
  });

  module.exports = connection