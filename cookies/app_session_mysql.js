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


app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret : '123432DAFE!SDFAf', // 우리가 만든 애플리케이션이 session id를 암호화시켜서 넣어준다. 
    resave : false,
    saveUninitialize: true,
    store:new MySQLStore({
        host :'localhost',
        port: 3306,
        user: 'root',
        password: '2488',
        database: 'dong'
    })
}));


passport.serializeUser(function(user,done){

    console.log('serializeUser', user);
    done(null,user.authId);
})

passport.deserializeUser(function(id,done){
    console.log('deserializeUser', id);
    for(var i =0; i<users.length; i++){
        var user = users[i];
        if(user.authId===id){ // id는 저장된  id
            return done(null,user);
        }
    }
    done('There is no user.');
})
passport.use(new FacebookStrategy({
    clientID: '218207626293486',
    clientSecret: '42c34c8ed2a4f8461d8f7d0a51b19ff8',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id','email','gender','link','locale','name','timezone','updated_time','verified','displayName']
  },
  function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      var authId = 'facebook:'+profile.id;
      //이미 존재하는 사용자인지 확인하고 push
      for(var i = 0; i<users.length;i++){
        var user = users[i];
        if(user.authId === authId){
           return done(null,user);
        }

     var newuser = { 
          'authId':authId,
          'displayName':profile.displayName,
          'email':profile.emails[0].value // 
      };

      users.push(newuser);
      done(null,newuser);
    }   

  }
  
));

app.get('/count', function(req,res){
    
    if(req.session.count){
        req.session.count++;
    } else{
        req.session.count = 1; // count값을 서버에 저장해놓고 
    }

   
    res.send('count : '+req.session.count);
})


app.get(
    '/auth/facebook',
    passport.authenticate(
        'facebook',
        {scope : 'email'} // 이메일정보가 필요 scope의 정보가 필요하면 facebook scope정보를 봐봐라.
        ));

app.get('/auth/facebook/callback',

    passport.authenticate(
        'facebook', 
        { successRedirect: '/welcome', failureRedirect: '/auth/login' }));  


app.get('/auth/logout',function(req,res){
    delete req.session.displayName; //리다이랙션을 하는경우엔 문제가 생길 수 있다.그래서 save 시켜줘야한다.
    req.session.save(function(){

        res.redirect('/welcome');
    })
    
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


app.post('/auth/register',function(req,res){
    hasher({password:req.body.password}, function(err,pass,salt,hash){

        var user = {
            authId:'local:'+req.body.username,
            username: req.body.username,
            password:hash,
            salt:salt,
            displayName:req.body.displayName
        };

        users.push(user); // users 배열에 push한다.
        req.session.displayName = req.body.displayName;
        req.session.save(function(){
            res.redirect('/welcome');
        })
    })
})



app.post('/auth/login', function(req,res){
      
    var uname = req.body.username;
    var pwd = req.body.password;

    for(var i=0; i<users.length; i++){
        var user = users[i];

        if(uname === user.username){
            return hasher({password: pwd, salt: user.salt}, function(err,pass,salt,hash){
                
                if(hash === user.password){
                    req.session.displayName = user.displayName
                    req.session.save(function(){
                        res.redirect('/welcome');
                    })
                }else{
                    res.send('who are you? <a href="/auth/login">login</a>');

                }

            })
        }
        /*if(uname === user.username && sha256(pwd+user.salt) === user.password){
            req.session.displayName = user.displayName;
            req.session.save(function(){
                res.redirect('/welcome');
            });
            
        } */
    }

})
var users = [{
    authId: 'local:egoing',
    username : 'egoing',
    password : 'g8BkdM7pZhVp4A5o3FrUOpq0YR14ZXG84SVeCYjK/YBW5hPbTmguaZvc4u817aw8FAS2dyUWBieXp9j01KEni/Q+/do/DsqRyGu4rtfLt3Xpx/V6fHXiNKUuaehBsgleJhZEJKv5QerJtcHoRJpZENWCznvFb95b6z68ff9oEA=', // 평문으로 비밀번호가 저장되어있다.
    salt : "YythG/9ScnZbOTtvx9U3NAavaJDoywcbRw630KjX9flFQsFTaKvV+zZFY+fGJtQaxJljipR5PDIhK1Gbte4bOg==",
    displayName:'Egoing'
}]; // db를 사용하지 않으므로 그냥 코드에다가 박는다.



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