var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
var app = express();
var MySQLStore = require('express-mysql-session')(session);
//var sha256 = require('sha256');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

//db
var mysql = require('mysql');
var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '2488',
    database : 'dong'
});

conn.connect();

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

app.use(passport.initialize());
app.use(passport.session());


app.get('/welcome', function(req,res){
    console.log("들어왔다.");
    if(req.user && req.user.displayName){
        res.send(`
        <h1>Hello,${req.user.displayName}<h1>
        <a href="/auth/logout">logout</a>`);
    }else
    {   console.log("여기가아닌디..");
        res.send(`<h1>welcome</h1>
                    <a href="/auth/login">Login</a>`)


    } // 유효성 검사!!!!
})



passport.serializeUser(function(user,done){

    console.log('serializeUser', user);
    done(null,user.authId); //세션스토어 안에 authId값으로 저장이 된다.
})

passport.deserializeUser(function(id,done){  //authid로 들어오는 값은 이미 local:이 포함되어있어서 local 쓰지않는다.
    console.log('deserializeUser', id);
    var sql = "SELECT * FROM users where authId=?";
    conn.query(sql,[id],function(err,results){
        if(err){
            console.log(err);
            done('There is no user.');

        } else{
            done(null,results[0]);
        }
    })
    // for(var i =0; i<users.length; i++){
    //     var user = users[i];
    //     if(user.authId===id){ // id는 저장된  id
    //         return done(null,user);
    //     }
    // }
    // done('There is no user.');
})

passport.use(new LocalStrategy(
    function(username,password,done){ //callback 함수를 가지고 있다.
        var uname = username;
        var pwd = password;
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, ['local:'+uname], function(err,results){
            console.log(results);
            if(err){
                return done('There is no user.');
            }
            var user = results[0];
                return hasher({password:pwd, salt:user.salt}, function(err,pass,salt,hash){
                    if(hash === user.password){
                        console.log('LocalStrategy', user);
                        done(null,user);
                    } else {
                        done(null,false);
                    }
                });
            
            
        });
    }
))
// 


app.post(
    '/auth/login',
    passport.authenticate(
        'local',
        {
    successRedirect: '/welcome',
    failureRedirect: '/auth/login',
    failureFlash: false,
    
}));



app.get('/auth/logout',function(req,res){
    req.logout();
    //delete req.session.displayName; //리다이랙션을 하는경우엔 문제가 생길 수 있다.그래서 save 시켜줘야한다.
    req.session.save(function(){

        res.redirect('/welcome');
    })
    
})


app.post('/auth/register',function(req,res){
    hasher({password:req.body.password}, function(err,pass,salt,hash){

        var user = {
            authId:'local:'+req.body.username,
            username: req.body.username,
            password:hash,
            salt:salt,
            displayName:req.body.displayName
        };
        var sql = 'INSERT INTO users SET ?';
        conn.query(sql,user,function(err,results){
            if(err){
                console.log(err);
                res.status(500);
            }else{
                res.redirect('/welcome');
                // api만드는 경우는 json으로 postman에 성공했다고 보여주면 댐
            }

        });
        // req.session.displayName = req.body.displayName;
        // req.session.save(function(){
        //     res.redirect('/welcome'); 회원가입 한 후 바로 로그인 되게하는 코드임 . 이걸 위에 else문에 집어넣으면 적용 가능.
        // })
    })
})



// app.post('/auth/login', function(req,res){
      
//     var uname = req.body.username;
//     var pwd = req.body.password;

//     for(var i=0; i<users.length; i++){
//         var user = users[i];

//         if(uname === user.username){
//             return hasher({password: pwd, salt: user.salt}, function(err,pass,salt,hash){
                
//                 if(hash === user.password){
//                     req.session.displayName = user.displayName
//                     req.session.save(function(){
//                         res.redirect('/welcome');
//                     })
//                 }else{
//                     res.send('who are you? <a href="/auth/login">login</a>');

//                 }

//             })
//         }
//         /*if(uname === user.username && sha256(pwd+user.salt) === user.password){
//             req.session.displayName = user.displayName;
//             req.session.save(function(){
//                 res.redirect('/welcome');
//             });
            
//         } */
//     }

// })

app.get('/auth/register', function(req,res){
    var output = `
    <h1>Register<h1>
    <form action="/auth/register", method="post">
        <p>
            <input type="text" name = "username" placeholder="username">
        </p>
        
        <p>
            <input type="password" name = "password" placeholder="password">
        </p>
        <p>
        <input type="text" name = "displayName" placeholder="displayName">
    </p>
        <p>
        <input type= "submit">
        </p>
        </form>
        `
        ;
        res.send(output);

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
        </form>
        <a href = "/auth/facebook">facebook</a>`;
        res.send(output);
})



app.listen(3003, function(){
    console.log("Connect 3003 port !!!");
})