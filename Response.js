/**
 * Created by ILapshun on 12/9/13.
 */

var fs = require("fs");
var CONTENT_TYPES = require("./contentTypes");
var RESPONSE_STATUS = require("./responseTypes");
var httpHandler = require("./HttpHandler");



var Response = function(req, socket, status ,filePath){

    //console.log("SERVER RESPONSE");

    try{

        if(status != RESPONSE_STATUS.SUCCESS)
        {
//            req.connection = "close";
            write(httpHandler.buildHttpHeader(req, status), httpHandler.buildHttpBody(req, status), req, socket);
        }
        else{

            fs.readFile(filePath, function (err, data) {
                if (err){
                    console.log("SERVER: Error reading requested resource");
                    return Response(req, socket, RESPONSE_STATUS.RESNOTFOUND, null);
                }
                var pathSplit = filePath.split('.');
                req.contentType = CONTENT_TYPES[pathSplit[(pathSplit.length)-1]];
                req.contentLength = data.length;

                var httpHeaderString = httpHandler.buildHttpHeader(req, status);
                //console.log("**httpHeaderString**");
                //console.log(httpHeaderString);

                write(httpHeaderString, data, req, socket);

                //console.log("write completed!");
            });
        }
    }
    catch(err) {
        console.log("SERVER: "+err);
        throw  err;
    }
}


var write = function(header, body, req, socket)
{
    //console.log("&&&&&&&&&&&");
//    console.log(">" + header + "<---in Response 54");

   // socket.write("HTTP/1.1 405\r\nDate: Sat Dec 21 2013 21:13:46 GMT+0200 (Jerusalem Standard Time)\r\nContent-Length: 145\r\nConnection: close", function(){
    socket.write(header, function(){
        socket.write(body, function(){

            if (!req.keepAlive){
                socket.end();
            }
        });
    });

}


module.exports = Response;