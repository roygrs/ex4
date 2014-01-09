//server = requier('server.js');
FindRequest=require("./FindRequest");
var net = require('net');
var httpHandler = require('./HttpHandler.js');
var RESPONSE_STATUS =require('./responseTypes')
var Response = require("./Response");


var _usecaseArray = [];
var _clients = {};
miniHttp = function(){



    function server(handler){
        myServer = net.createServer(initServer);
//        function(socket){
//        //TODO
//            socket.send("hello");
//
//        });
//        myServer.Event['request'] = handler;//TODO

        function listen(port,callback){
            myServer.listen(port);
            if(callback!==undefined){
                callback();
            }

        };
        return myServer;
    };



    function req(){

        this.params = {};

        function query(){
            this.q;
            this.order;

        }

        function body(){
            user={name:"", email:""};
            name;

        }

        function cookies(){
            mane;

        }
        function get(headerName){

        };

        function param(paramName){
            if(params[paramName]!== undefined){
                return params[paramName];
            }
            if(body[paramName]!==undefined){
                return body[paramName];
            }
            if(query[paramName]!==undefined){
                return query[paramName];
            }

        }
        function is(type){
            if(query.type===type){
                return true;//TODO rejex
            }
        }

        this.path ;
        this.host ;
        this.protocol;
    }



    function initServer(socket){

        var timeOutOccured = false;
        var result;

        socket.setEncoding('utf8');
        socket.setTimeout(2000, function() {
            console.log("SERVER: Connection Timeout: socket "+socket);
            timeOutOccured  = true;
            socket.end();

        });// .listen(socket);

        socket.on("data", function(data){
            console.log("SERVER: receiving message:\r\n >"+data.toString() + "<");

            if (_clients[socket.remoteAddress] == null)
            {
                _clients[socket.remoteAddress] = "";
            }

            var finder = FindRequest();
            result = finder.httpRequestFinder(_clients, socket.remoteAddress, data);

            // for debugging.
            if(result != null)
            {
                console.log("SERVER: processing request:\r\n "+result);
            }
            else
            {
                console.log("request is not full");
            }


            if (result == null) return; //No complete message yet. wait for further data.

            for (j=0; j<result.length && !timeOutOccured; j++)
            {
//                if(timeOutOccured)
//                {
//                    console.log("time out occurred, should exit loop");
//                    console.log(result);
//                    break;
//                }
                //var req = httpHandler.parseHttpRequest(data);
                var req = httpHandler.parseHttpRequest(result[j]);
                //console.log(req.toString());

                if(!req.isValidHttp)
                {
                    if(req.status == RESPONSE_STATUS.PARSEERROR)
                    {
                        //console.log("2");
                        Response(req, socket, RESPONSE_STATUS.PARSEERROR, null);

                    }
                    else
                    {

                        //console.log("1");
                        Response(req, socket, RESPONSE_STATUS.NONGETREQUEST, null);
                    }
                    continue;
                }

                var foundUseCase = false;
                //search the use cases to find a mapping to resourceRoot
                for (var i = 0; i < _usecaseArray.length; i++) {
                    var usecase = _usecaseArray[i];
                    //console.log(_usecaseArray);
                    //console.log("usecase " +usecase.toString());
                    var res = usecase.res;
                    if (doesMatch(req, usecase))
                    {
                        usecase.func(req, res, socket);
                        foundUseCase = true;
                        break;
                    }
                }
                if(!foundUseCase)
                {
                    //in case usecase was not found
                    Response(req, socket, RESPONSE_STATUS.RESNOTFOUND, null);
                }

                if(req.keepAlive === false)
                {
                    console.log("keep alive is false, exiting the loop");
                    break;
                }
            }
        });


        socket.on("end", function(){
            console.log("SERVER: ends connection to socket: "+socket.toString());
            socket.end();
        });

    }
    return {
        createServer:function(handler){
            server = server(handler);
            return server;
        },
        hello:function(){
            console.log("hello");
        }
    }
};
