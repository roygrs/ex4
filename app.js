var http = require('./miniHttp');

var express = require('./miniExpress.js');

var path = require('path');

console.log('in app');

var app = express();
var port =3000;
var http = miniHttp();
http.hello();
http.hello();
s=http.createServer(app);
s.listen(port, function(){
  console.log('Express server listening on port ' + port);
});
