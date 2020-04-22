module.exports = function(app){
    var express = require('express')
    var router = express.Router();

    router.get('/rl', function(req,res){
    res.send('Hello /p1/r1');
    })

    router.get('/r2', function(req,res){
    res.send('Hello /p1/r2');
    })
    return router;

}