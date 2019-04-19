function curry(fn, sum){
  return function(n){
    return fn.call(fn, n, sum);
  }
}

var ff = curry(function fc(n, sum){
  if(!n) return;
  sum = sum * n;
  if(n <= 1){
    return sum
  }
  return fc(n - 1, sum);
}, 1);

var a = ff(3);

console.log(a)