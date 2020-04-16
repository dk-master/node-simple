const http = require('http'); // nodejs가 가지고 있는 모듈

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => { // http객체가 가지고 있는 createServer라는 함수 
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});


