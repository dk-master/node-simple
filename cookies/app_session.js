var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser.urlencoded({extended: false}));


app.use(session({
    secret : '123432DAFE!SDFAf', // 우리가 만든 애플리케이션이 session id를 암호화시켜서 넣어준다. 
    resave : false,
    saveUninitialize: true
}))



app.get('/count', function(req,res){
    
    if(req.session.count){
        req.session.count++;
    } else{
        req.session.count = 1; // count값을 서버에 저장해놓고 
    }

   
    res.send('count : '+req.session.count);
})


app.get('/auth/logout',function(req,res){
    delete req.session.displayName;
    res.redirect('/welcome');
})

app.get('/welcome', function(req,res){
    if(req.session.displayName){
        res.send(`
        <h1>Hello,${req.session.displayName}<h1>
        <a href="/auth/logout">logout</a>`);
    }else
    {res.send(`<h1>welcome</h1>
                    <a href="/auth/login">Login</a>`)


    } // 유효성 검사!!!!
})

app.post('/auth/login', function(req,res){
    var user = {
        username : 'egoing',
        password : '111',
        displayName:'Egoing'
    } // db를 사용하지 않으므로 그냥 코드에다가 박는다.
    var uname = req.body.username;
    var pwd = req.body.password;

    if(uname === user.username && pwd === user.password){
        req.session.displayName = user.displayName;
        res.redirect('/welcome');
    } else{
        res.send('who are you? <a href="/auth/login">login</a>');
    }
})


app.get('/auth/login', function(req,res){
    var output = `
    <h1>Login<h1>
    <form action="/auth/login", method="post">
        <p>
            <input type="text" name = "username" placeholder="username">
        </p>
        
        <p>
            <input type="password" name = "password" placeholder="password">
        </p>
        
        <p>
        <input type= "submit">
        </p>
        </form>`;
        res.send(output);
})







app.listen(3003, function(){
    console.log("Connect 3003 port !!!");
})