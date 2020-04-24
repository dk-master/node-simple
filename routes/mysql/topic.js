module.exports = function(){
    var router = require("express").Router();
    var conn = require("../../config/mysql/db")();
    
    router.get('/add',function(req,res){ // add페이지로 들어갈때
        console.log("들어왔다.");
        var sql ='SELECT id,title FROM topic';// id랑 title을 sql문으로 찾는이유는 메인부분이랑 윗부분은 같게 고정시키기 위해서
        conn.query(sql,function(err,topics,fields){ // topics안에 sql문 데이터가 담겨져 있다.
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            res.render('topic/add',{topics:topics, user:req.user}); // 데이터를 보낼때
    });
    });
    
    
    
    
    router.get(['/','/:id'], function(req,res){
        console.log("메인화면에서 데이터가 잘 보이네.")
        var sql ='SELECT id,title FROM topic';
        conn.query(sql,function(err,topics,fields){
            var id = req.params.id; // 사용자가 id를 물고 들어왔는지 알 수 있다.
            if(id){
                    var sql = 'SELECT * FROM topic WHERE id=?';
                    conn.query(sql,[id], function(err,topic,fields){
                        if(err){
                            console.log(err);
                            res.status(500).send('Internal Server Error');
                        }else{
                            res.render('topic/view',{topics:topics, topic:topic[0], user:req.user})
                            
                        }
                    })
            }else{
                res.render('topic/view',{topics:topics, user:req.user}); // topic디렉토리 안에 있는 view.jade파일..
    
            }
            
        })
    })
    
    
    
    router.post('/add', function(req,res){ //add해서 다시 메인화면으로 넘어갈때
    
        var title = req.body.title; // 제목과 내용 저자를 클라이언트가 요청한것을 변수에 받는다.
        var description = req.body.description;
        var author = req.body.author;
        console.log("데이터 요청이 잘 되었군.")
        var sql = 'INSERT INTO topic (title,description,author) VALUES(?,?,?)'; // ?가 있는것은 데이터를 넣기 위해
        conn.query(sql, [title,description,author],function(err,result,fields){ //sql문을 적용시키기 위해 query 매개변수 첫번째에 sql문담고 두번째매개변수 ?에 해당하는 값 넣고 익명함수 두번째 매개변수로 쿼리의 결과값이 들어감
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }else{
                console.log(result);
                console.log("데이터베이스에 잘 저장 되었군.")
                res.redirect('/topic/'+result.insertId); //쿼리결과값의 id값에 해당하는것을 미리만들어진 url에 매핑시켜 redirect시킨다.
                console.log("데이터베이스 갱신 후 다시 메인화면으로 ")
            }
        })
    })
    
    router.get('/:id/delete', function(req,res){
        var sql ='SELECT id,title FROM topic'; 
        var id = req.params.id; // id값으로 찾아 지워야하기 때문에 페이지 들어갈때 id값 받아놓는다.
        conn.query(sql,function(err,topics,fields){ // sql문 받고 적용
            var sql1 = 'SELECT * FROM topic WHERE id =?'; // 
            conn.query(sql1,[id],function(err,topic){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else{
                    if(topic.length === 0){
                        console.log('There is no record.');
                        res.status(500).send('Internal Server Error');
                    } else{
                            res.render('topic/delete', {topics:topics, topic:topic[0], user:req.user})// id에 해당하는 삭제할 데이터값 다시 응답해줌 그럼 삭제버튼 누르게 되는 post방식 delete로 넘어감 
                    }
                
                }
            });
    
        });
    });
    
    router.post('/:id/delete', function(req,res){ 
        var id = req.params.id; // 요청한 데이터의 id값을 받아온다.
        var sql = 'DELETE FROM topic WHERE id=?';
        conn.query(sql,[id],function(err,result){ // sql문 적용하고
            res.redirect('/topic/'); // 다시 메인화면으로 이동.
        });
    });
    
    router.get('/:id/edit', function(req,res){ //edit페이지 들어왔을때
        var sql ='SELECT id,title FROM topic'; //왜냐하면 메인이랑 화면 같게 할라고
        conn.query(sql,function(err,topics,fields){
            var id = req.params.id; // 사용자가 id를 물고 들어왔는지 알 수 있다.
            if(id){
                    var sql = 'SELECT * FROM topic WHERE id=?'; //id에 해당하는 select결과 sql 변수에 담는다.
                    conn.query(sql,[id], function(err,topic,fields){
                        if(err){
                            console.log(err);
                            res.status(500).send('Internal Server Error');
                        }else{
                            res.render('topic/edit',{topics:topics, topic:topic[0], user:req.user});// 다시 클라이언트측에 응답 topics,topic데이터를 가지고
                            
                        }
                    });
            }else{
                console.log('There is no id.');
                res.status(500).send('Internal Server Error')
            }
            
        });
    });
    
    
    router.post(['/:id/edit'], function(req,res){
        var title = req.body.title; // 수정된 데이터를 요청해서 변수에 저장
        var description = req.body.description;
        var author = req.body.author;
        var id = req.params.id; // 수정하려는 데이터를 id값으로 찾아야하기 때문에
        var sql = 'UPDATE topic SET title=?, description=?, author=? where id=?'
        conn.query(sql,[title,description,author,id], function(err,topics,fiedls){ // sql문 적용.
            if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            }else{
                res.redirect('/topic/'+id);//id는 변화시키지 않으므로 id값을 붙혀 그 url로 다시  이 url은 위에서 이미 만들어줬기때문에 redirect 가능
            }
        });
    });

    return router;
}

