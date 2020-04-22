/*module.exports = function(a,b){
    return a+b;
}*/
function _sum(a,b){
    return a+b;
}
module.exports = function(a,b){
    return _sum(a,b);
}