



require('../config/mysql/express')(app);
var passport = require('../config/mysql/passport')(app); // 매개변수를 통해서 passport.js파일에 app이라는 변수를 쓸 수 있게 보내준다.



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




var auth = require('../routes/mysql/auth')(passport); // 마찬가지로 auth.js파일에서 passport변수 쓸 수 있게 보내준다.
app.use('/auth/',auth);

app.listen(3003, function(){
    console.log("Connect 3003 port !!!");
})


