//Danny Chung || chungdan@oregonstate.edu || CS340
//Hailee Hibray || hibrayh@oregonstate.edu || CS340

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'us-cdbr-east-05.cleardb.net',
  user: 'b11e17857bbf3f',
  password: '900be5f5',
  database: 'heroku_6f4acb4d859f47c'
});

module.exports.pool = pool;
