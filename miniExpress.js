var net = require("net");
var fs = require("fs");
var httpHandler = require("./HttpHandler");
var Response = require("./Response");
var RESPONSE_STATUS = require("./responseTypes");
var FindRequest = require("./FindRequest");


var _server;
var _usecaseArray = [];

var _rootFolder;

//-------------------------------
var miniHttp = require('./miniHttp.js');



miniExpress =function(){

    //_httpHandler = httpHandler();

    function listen(port, callback){
        var server=  miniHttp.createServer(this);
        server.listen(port , callback);
        return server;
    };


    return{

        use:function (res, func){

            var useCase = {
                res: res,
                func: func
            }

            _usecaseArray.push(useCase);
        },

//        listen:function(port){
//            _server.listen(port);
//
//        },

        close:function(){
            _server.stop(function(){
             console.log("SERVER: Closed for new connections");
            //make closing operations....
            });
        }

        //more functions to come..

    }

}



miniExpress.static =  function(rootFolder)
{
    _rootFolder = rootFolder;

    return function (req, res, socket){

        var resource = req.resource;
        var replaceIndex = resource.indexOf(res);
        var resAbsPath = resource.substring(0, replaceIndex) + _rootFolder +
        resource.substring(replaceIndex+res.length, resource.length);

        Response(req, socket, RESPONSE_STATUS.SUCCESS, resAbsPath);
    }
}



var doesMatch = function(htmlObject, usecase){

    if((htmlObject.resource).indexOf(usecase.res) != -1)
        return true;
    else
        return false;
}



module.exports = miniExpress;