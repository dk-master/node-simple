module.exports = function(app){

var conn = require('./db')(); // return값을 받아오려면 뒤에 ()를 붙혀줘야한다.
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
app.use(passport.initialize());
app.use(passport.session());


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

return passport;

}