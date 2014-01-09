var httpHeader = require("./HttpHeader");
var RESPONSE_STATUS = require("./responseTypes");

/**
 * Created by igor on 20/9/13.
 */

/*//testing
function testParser()
 {

var text = "GET /players/mJordan/info.html HTTP/1.0\r\nHost: localhost:3000\r\nConnection: Keep-Alive\r\n";
     //var test1 = HttpHandler().parseHttpRequest(text);
 }*/


var HttpHandler = function(){

}


//static methods

HttpHandler.parseHttpRequest = function(/*err,*/ data)
{
    var lines = data.toString().split("\r\n"); //split the lines
    var requestMethod = (lines[0].split(' '))[0];

    switch(requestMethod)
    {
        case 'GET':
            return GetParser(lines);
        //case 2:
        //   execute code block 2
        //  break;
        default:
            return IllegalFormatParser(lines);
    }
}



HttpHandler.buildHttpBody = function(httpHeader, status)
{

    switch(status){

        case RESPONSE_STATUS.RESNOTFOUND:
             var b = ("404 File Not FoundERROR 404"+'"Sorry, file was not found"').length;
            return returnHTMLpage("404 File Not Found", "ERROR 404", '"Sorry, file was not found"');
            break;
        case RESPONSE_STATUS.PARSEERROR:
            return returnHTMLpage("500 Parse Http Error", "ERROR 500", httpHeader.errorMessage);
            break;
        case RESPONSE_STATUS.NONGETREQUEST:
            return returnHTMLpage("405 Not Get Request", "ERROR 405", '"Sorry, GET request was not identified"');
            break;
        default :
            return returnHTMLpage("500 Parse Http Error", "ERROR 500", '"Sorry, parse http problem"');
    }
    /*return  "<html>"+
     "<head> <title>404 File Not Found</title></head>"+
     "<body><h1><u><b>ERROR 404</b></u></h1>" +'"Sorry, file was not found"'+ "</body>"+
     "</html>";
     */


    //return buildHeaderString(httpHeader, status);
}


var returnHTMLpage = function(title, header, body){

    var body = String("<html>"+
        "<head> <title>"+title+"</title></head>"+
        "<body><h1><u><b>"+header+"</b></u></h1>" +body+ "</body>"+
        "</html>");

   //var a =  body.length;

   return body;
}


HttpHandler.buildHttpHeader = function(httpHeader, status)
{
    return buildHeaderString(httpHeader, status);
}


var GetParser = function(lines)
{

    //console.log("httpObject: ");
    //console.log(lines);
    var httpObject = new httpHeader();
    httpObject.operationType = 'GET';
    try {
        var requestLine = lines[0].split(' ');
        httpObject.resource = requestLine[1].trim();
        httpObject.httpVersion = requestLine[2].trim();
        if(httpObject.httpVersion != 'HTTP/1.0' && httpObject.httpVersion != 'HTTP/1.1')
        {
            httpObject.errorMessage = "invalid status line";
            httpObject.status = 500;
            //httpObject.reasonPhrase = "BAD STATUS LINE";
            httpObject.isValidHttp = false;
            return httpObject;
        }
    }
    catch (e) {
        httpObject.errorMessage = "invalid status line";
        httpObject.status = 500;
        //httpObject.reasonPhrase = "BAD STATUS LINE";
        httpObject.isValidHttp = false;
        return httpObject;
    }

    for (var i = 1; i < lines.length; i++)
    {
        if(lines[i] === "")
        {
            if(httpObject.operationType === 'GET' && lines[i+1] !== undefined)
            {
                break;
            }
        }
        else
        {
            try {
                var row = lines[i].split(':');
                //console.log("line " + i + " " + row);
                var rowName = row[0].trim().toLowerCase();
                if(rowName === 'host')
                {
                    httpObject.localHost = lines[i].substring(lines[i].lastIndexOf(':')+1).trim();
                }
                if(rowName === 'connection')
                {
                    httpObject.connection = row[1].trim();
                    //.log("httpObject.connection " + httpObject.connection)
                }
            }
            catch (e) {
                httpObject.errorMessage = "invalid header";
                //httpObject.reasonPhrase = "BAD HEADER";
                httpObject.status = 500;
                httpObject.isValidHttp = false;
                return httpObject;
            }

        }

    }

    if(shouldCloseConnection(httpObject))
    {
        httpObject.keepAlive = false;
    }
    httpObject.isValidHttp = true;
    return httpObject;

};


var IllegalFormatParser = function(lines)
{
    var httpObject = new httpHeader();

    try {
        var requestLine = lines[0].split(' ');
        httpObject.resource = requestLine[1].trim();
        httpObject.httpVersion = requestLine[2].trim();
    }
    catch (e) {
        httpObject.errorMessage = "invalid status line";
        httpObject.status = 500;
        //httpObject.reasonPhrase = "BAD STATUS LINE";
        httpObject.isValidHttp = false;
        return httpObject;
    }

    httpObject.status = 405;
    //httpObject.reasonPhrase = "UNSUPPORTED NON GET REQUEST";
    httpObject.errorMessage = "request is not GET";
    httpObject.isValidHttp = false;

    return httpObject;
};

var shouldCloseConnection = function(httpObject)
{
//    console.log("aaaaaaaaaaaaaaaaaaaaaa         shouldCloseConnection");
//    console.log(httpObject.httpVersion + " " + ">"+httpObject.connection+"<");
//    if(httpObject.httpVersion === 'HTTP/1.0')
//    {
//        console.log("httpVersion === 'HTTP/1.0'");
//    }
//    if(httpObject.connection != 'keep-alive')
//    {
//        console.log("httpObject.connection !== 'keep-alive'");
//    }
    return (httpObject.httpVersion === 'HTTP/1.0' && httpObject.connection.toLowerCase() !== 'keep-alive') ||
        httpObject.connection.toLowerCase() === 'close';
};


var buildHeaderString = function(httpHeader, status)
{

    switch (status){

        case RESPONSE_STATUS.SUCCESS:
            httpHeader.status = '200';
            httpHeader.reasonPhrase= 'OK';
            break;
        case RESPONSE_STATUS.RESNOTFOUND:
            httpHeader.status = '404';
            httpHeader.contentLength = 132;
            break;
        case RESPONSE_STATUS.PARSEERROR:
            httpHeader.status = '500';
            httpHeader.contentLength = httpHeader.errorMessage.length + 78+29;
            break;
        case RESPONSE_STATUS.NONGETREQUEST:
            //httpHeader.status = '404';
            httpHeader.contentLength = 145;
            break;
        default:
            httpHeader.status = '500';
            httpHeader.contentLength = 126;
            break;

    }
   // if(status = RESPONSE_STATUS.NONGETREQUEST)

    var responseAsString = "";
    var breakRow = "\r\n";
    var space = " ";
    httpHeader.date = new Date();

    if(httpHeader.httpVersion !== null)
    {
        responseAsString += httpHeader.httpVersion + space;
    }
    if(httpHeader.status !== null)
    {
        responseAsString += httpHeader.status + space;
    }
    if(httpHeader.reasonPhrase !== null)
    {
        responseAsString += httpHeader.reasonPhrase;
    }
    responseAsString += breakRow + "Date: " + httpHeader.date;

    if(httpHeader.contentType !== null)
    {
        responseAsString += breakRow + "Content-Type: " + httpHeader.contentType;
    }
    if(httpHeader.contentLength !== null)
    {
        responseAsString += breakRow + "Content-Length: " + httpHeader.contentLength;
    }
    if(httpHeader.connection !== null)
    {
        responseAsString += breakRow + "Connection: " + httpHeader.connection;
    }

    responseAsString += breakRow;
    //responseAsString += breakRow + "Allow: GET";

    return String(responseAsString + breakRow);
};





module.exports = HttpHandler;

