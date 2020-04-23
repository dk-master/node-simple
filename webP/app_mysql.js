var express = require('express');
var app = express(); // 모듈은 사실 함수 
var bodyParser = require('body-parser'); //body-parser모듈을 가져온다.
app.use(express.static('public'));  // public 디렉토리 안에서 이 파일을 찾게된다.

app.use(bodyParser.urlencoded({extended:false})) // 모든 요청기능들은 bodyparser을 통과한 후 라우터를 통과한다.
app.set('view engine', 'jade');
app.set('views','../views/mysql');

var topic = require('../routes/mysql/topic')();
app.use('/topic', topic); // topic이라는 이름으로 들어오는 것들은 모두 router객체에 의해 처리가 되는데



app.listen(3000, function(){
    console.log("Connected 3000 port!!!");
});