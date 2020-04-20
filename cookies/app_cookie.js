var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
app.use(cookieParser('2213!!@#~!@#%#!asdqwe1@!')); // 


var products = {
    1:{title: '웹의 역사 1'},
    2:{title: '웹 2'}
};
app.get('/products', function(req,res){
    var output = '';
    
    for(var i in products){
        output +=
        `
        <li><a href="/cart/${i}">${products[i].title}</a>

        
        </li>`
    }
    res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">카트</a>`);
});

app.get('/cart',function(req,res){
    var cart = req.signedCookies.cart;
    if(!cart) {
        res.send('Empty!');
    } else {
        var output = '';
        for(var id in cart){
            output += `<li>${products[id].title} (${cart[id]})</li>`;

        }
    }
    
    res.send(`
    <h1>Cart</h1>
    <ul>${output}</ul>
    <a href="/products">Products List</a>`)
})



app.get('/cart/:id', function(req,res){
    var id = req.params.id;
    if(req.cookies.cart){
        var cart = req.cookies.cart;
    }else{
        var cart = {}; // 사용자가 처음으로 진입했을때
    }
    if(!cart[id]){
        cart[id] = 0;
    }
    cart[id] = parseInt(cart[id]) + 1;
    
    res.cookie('cart', cart, {signed:true}); // 처음에 사용자의 브라우저에 쿠키가 cart라는 이름으로 심어진다.하지만 처음 심어질땐 default;
    res.redirect('/cart');
})



app.get('/count',function(req,res){
    if(req.signedCookies.count){
        var count = parseInt(req.signedCookies.count); // cookie의 값은 문자다 원래 
        count = count+1;
        
    }else{
        var count = 0;
    }
    

    res.cookie('count', count, {signed:true});
    res.send("count : "+ count); // req객체에 cookies라는게 포함되 어 있고 웹브라우저가 웹서버에게 전송한 쿠키의 값으로 바뀌게된다.
})






app.listen(3003, function(){
    console.log("Connect 3003 port !!!");
})