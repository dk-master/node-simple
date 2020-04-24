var app = require('../config/mysql/express')(app);
var passport = require('../config/mysql/passport')(app); 

var topic = require('../routes/mysql/topic')();
app.use('/topic', topic); // topic이라는 이름으로 들어오는 것들은 모두 router객체에 의해 처리가 되는데

var auth = require('../routes/mysql/auth')(passport); // 마찬가지로 auth.js파일에서 passport변수 쓸 수 있게 보내준다.
app.use('/auth/',auth);

app.listen(3000, function(){
    console.log("Connected 3000 port!!!");
});