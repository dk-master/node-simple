var mysql = require('mysql');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '2488',
    database : 'dong'
});

connection.connect();

/*var sql = 'SELECT * FROM topic';
connection.query(sql,function(err,rows,fields){
    if(err){
        console.log(err);
    }
    else{
        for(var i = 0; i<rows.length;i++){
            console.log(rows[i].author);
        }
    }
});*/

/*var sql = 'INSERT INTO topic (title,description,author) VALUES(?,?,?)'; //치환자
var params = ['Supervisor','Watcher','graphittie']; // 값들을 배열로 생성하고

connection.query(sql,params,function(err,rows,fields){ // 쿼리의 두번째 인자값에 params 추가 해서 
    if(err){
        console.log(err);
    }else{
        console.log(rows.insertId);
    }
})*/

/*var sql = 'UPDATE topic SET title=?, author=? where id=?'; //치환자
var params = ['pomu','dongkwan', 1]; // 값들을 배열로 생성하고

connection.query(sql,params,function(err,rows,fields){ // 쿼리의 두번째 인자값에 params 추가 해서 
    if(err){
        console.log(err);
    }else{
        console.log(rows);
    }
}) */

var sql = 'DELETE FROM topic WHERE id=?'; //치환자
var params = [1]; // 값들을 배열로 생성하고

connection.query(sql,params,function(err,rows,fields){ // 쿼리의 두번째 인자값에 params 추가 해서 
    if(err){
        console.log(err);
    }else{
        console.log(rows);
    }
})
connection.end();