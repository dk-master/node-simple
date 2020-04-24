module.exports = function(){
var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
var app = express();
var MySQLStore = require('express-mysql-session')(session);
//var sha256 = require('sha256');
app.set('views', '../views/mysql')
app.set('view engine', 'jade');
app.use(express.static('public'));  // public 디렉토리 안에서 이 파일을 찾게된다.
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret : '123432DAFE!SDFAf', // 우리가 만든 애플리케이션이 session id를 암호화시켜서 넣어준다. 
    resave : false,
    saveUninitialized: true,
    store:new MySQLStore({
        host :'localhost',
        port: 3306,
        user: 'root',
        password: '2488',
        database: 'dong'
    })
}));

    return app;
}