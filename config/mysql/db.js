module.exports = function(){
    //db
var mysql = require('mysql');
var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '2488',
    database : 'dong'
});

conn.connect();
return conn;
}