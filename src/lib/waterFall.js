var waterfall = (function() {

  var isArray = Array.isArray;    // 把数组的isArray赋给isArray变量

  // 是否支持Symbol
  var supportsSymbol = typeof Symbol === 'function';

  var setImmediate$1 = wrap(_defer);

  function wrap(defer) {
      return function (fn/*, ...args*/) {
          var args = slice(arguments, 1);
          defer(function () {
              fn.apply(null, args);
          });
      };
  };

  // 是否是异步
  function isAsync(fn) {
      return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
  };

  // 空函数
  function noop() {
      // No operation performed.
  };

  // 一次(偏函数)
  function once(fn) {    // fn: waterfall的第二个参数(回调函数)
      return function () {
          if (fn === null) return;
          var callFn = fn;
          fn = null;    // 把上级函数作用域中的fn置空
          callFn.apply(this, arguments);    // 调用回调函数
      };
  };

  // 包装成异步
  function wrapAsync(asyncFn) {
      return isAsync(asyncFn) ? asyncify(asyncFn) : asyncFn;
  };

  function asyncify(func) {
      return initialParams(function (args, callback) {
          var result;
          try {
              result = func.apply(this, args);
          } catch (e) {
              return callback(e);
          }
          // if result is Promise object
          if (isObject(result) && typeof result.then === 'function') {
              result.then(function(value) {
                  invokeCallback(callback, null, value);
              }, function(err) {
                  invokeCallback(callback, err.message ? err : new Error(err));
              });
          } else {
              callback(null, result);
          }
      });
  };

  function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
  };

  function invokeCallback(callback, error, value) {
      try {
          callback(error, value);
      } catch (e) {
          setImmediate$1(rethrow, e);
      }
  };

  // 重写数组中的slice方法
  function slice(arrayLike, start) {    // arrayLike: 类数组对象  start: 开始位置
      start = start|0;
      var newLen = Math.max(arrayLike.length - start, 0);    // 长度
      var newArr = Array(newLen);    // 创建一个长度为newLen的数组
      for(var idx = 0; idx < newLen; idx++)  {
          newArr[idx] = arrayLike[start + idx];
      };
      return newArr;    // 返回数组
  };

  // 执行一次
  function onlyOnce(fn) {
      return function() {
          if (fn === null) throw new Error("Callback was already called.");    // 回调已被调用
          var callFn = fn;
          fn = null;
          callFn.apply(this, arguments);    //调用callFn 参数就是用户回调函数中的参数
      };
  };

  var waterfall = function(tasks, callback) {    // tasks: 异步函数数组容器, callback: 回调
      callback = once(callback || noop);    // 回调函数
      if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));    // 第一个参数必须是数组(函数数组)!
      if (!tasks.length) return callback();    // 空数组的话直接调用回调函数(无参数)
      var taskIndex = 0;    // 任务索引

      function nextTask(args) {    // 参数数组
          var task = wrapAsync(tasks[taskIndex++]);    // 数组中的任务
          args.push(onlyOnce(next));    // 把next方法添加到args数组中去
          task.apply(null, args);    // 调用数组中task函数(参数是数组)
      };

      function next(err/*, ...args*/) {    // 其实就是函数参数中的回调函数callback
          if (err || taskIndex === tasks.length) {    // 只要有错误或者函数数组任务都完成了
              return callback.apply(null, arguments);    // 就执行回调
          };
          nextTask(slice(arguments, 1));    // 数组中的函数没循环完且没出错,那就继续调用
      };

      nextTask([]);    // 调用
  };
}());