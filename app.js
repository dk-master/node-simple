var express = require('express'); // express라는 모듈을 우리의 프로젝트에 로드
var app = express(); // 모듈은 사실 함수 
var bodyParser = require('body-parser'); //body-parser모듈을 가져온다.
app.use(express.static('public'));  // public 디렉토리 안에서 이 파일을 찾게된다.

app.use(bodyParser.urlencoded({extended:false})) // 모든 요청기능들은 bodyparser을 통과한 후 라우터를 통과한다.
app.set('view engine', 'jade');

app.set('views','./views');

app.get('/topic/:id', function(req,res){var topics = ['javascript', 'nodejs','express'];

var output = `<a href = "/topic?id=0">javascript</a><br>
<a href = "/topic?id=1">nodejs</a><br>
<a href = "/topic?id=2">express</a><br>
${topics[req.parmas.id]}`
    res.send(output);
})
 
app.get('/form',function(req,res){
    res.render('form');
})

app.get('/form_receiver',function(req,res){
    var title = req.query.title; // 쿼리를 통해 받아옴
    var description = req.query.description; // 쿼리를 통해 받아옴.
    res.send(title+','+description);
})

app.post('/form_receiver', function(req,res){
    var title = req.body.title; 
    var description = req.body.description;
    res.send(title+','+description);
})
app.get('/topic/:id/:mode', function(req, res){
    res.send(req.params.id+','+req.params.mode)
})

app.get('/template',function(req,res){
    res.render('temp', {time: Date(), _title: 'jade'});
})
app.get('/',function(req, res){   
        res.send('Hello home page'); // 이 값을 응답할것이다.
}); // 사용자가 웹서버에 접속했다는 것을 알 수 있게 작성. 일반적으로 url로 접속하는것은 get방식으로 접속하는 것.
// /로 접속하면 두번째 인자 함수가 실행된다.

app.get('/route', function(req,res){
    res.send('Hello Router, <img src = "/me.jpg">');
})

app.get('/dynamic', function(req,res){
    var lis = '';
    for(var i=0; i<5; i++){

        lis = lis + '<li>coding</li>'
    }
    var output = `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset='utf-8'>
        <title>
        </title>
    </head>
    
    <body>
        hello, Dynamic!
        ${lis} 
    </body>
    </html>`
    res.send(output);
})

app.get('/login', function(req,res){
    res.send("Login please");
})

app.listen(3000, function(){
    console.log("Connected 3000 port!!!");
});

// req : 사용자가 요청한것의 정보를 담고 있음. 
// res : 사용자가 요청한것의 응답에 대한 객체를 전달해주도록 약속

// get은 라우터라고 부른다. Routing -> 길을 찾는다. 즉 어떤 요청이 들어왔을때 요청이 길을 찾을 수 있게 도와주는것 Get이 하는 역할(Router)'

//