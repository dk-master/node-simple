var _ = require("underscore"); // 이 모듈을 사용할 수 있게 된다.

var  arr = [3,6,9,1,12];

console.log(arr[0]);
console.log(_.first(arr));
console.log(arr[arr.length-1]);
console.log(_.last(arr));
