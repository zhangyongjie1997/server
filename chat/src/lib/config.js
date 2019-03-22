let baseUrl = '//39.107.88.223/api/';
if(process.env.NODE_ENV != 'production'){
  baseUrl = '//localhost:3000/api/'
}

export {baseUrl}