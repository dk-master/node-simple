module.exports = function(passport){ // passport를 app_passport_mysql에 있는것을 매개변수에 넣어줌으로써 가져올 수 있다.
    var router = require('express').Router();
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var conn = require('../../config/mysql/db')();

router.post(
    '/login',
    passport.authenticate(
        'local',
        {
    successRedirect: '/topic',
    failureRedirect: '/auth/login',
    failureFlash: false,
    
}));


router.post('/register',function(req,res){
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
                res.redirect('/topic');
                // api만드는 경우는 json으로 postman에 성공했다고 보여주면 댐
            }

        });
        // req.session.displayName = req.body.displayName;
        // req.session.save(function(){
        //     res.redirect('/welcome'); 회원가입 한 후 바로 로그인 되게하는 코드임 . 이걸 위에 else문에 집어넣으면 적용 가능.
        // })
    })
})



// router.post('/auth/login', function(req,res){
      
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

router.get('/register', function(req,res){
    var sql ='SELECT id,title FROM topic'; // 로그인 화면할때도 게시판이 보일 수 있게 하기위해 데이터를 가져온다.
    conn.query(sql,function(err,topics,fields){
    res.render('auth/register',{topics:topics});
});

});

router.get('/login', function(req,res){
    var sql ='SELECT id,title FROM topic'; // 로그인 화면할때도 게시판이 보일 수 있게 하기위해 데이터를 가져온다.
    conn.query(sql,function(err,topics,fields){
    res.render('auth/login',{topics:topics});
});
});



router.get('/logout',function(req,res){
    req.logout();
    //delete req.session.displayName; //리다이랙션을 하는경우엔 문제가 생길 수 있다.그래서 save 시켜줘야한다.
    req.session.save(function(){

        res.redirect('/topic');
    })
    
})
    return router;
}