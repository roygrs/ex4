/**
 * Created by roy on 12/16/13.
 */




function test()
{
    //GET /players/mJordan/icontent-Length: 8\r\nnfo.html HTTP/1.0\r\n\r\nsdfsdfdfdfsdfdfsdsfsdfsdf\r\nsdfdsf\r\ndsfdsf
    //aaa\r\naaa\r\naaa\r\ncontent-Length: 3\r\naaa\r\n\r\nbbbbbb
    //GET /static/test.js HTTP/1.1\r\nHost: localhost:3000\r\n"+
//    "Connection: keep-alive\r\nCache-Control: max-age=0\r\nAccept: text/html,application/xhtml+xml," +
//        "application/xml;q=0.9,image/webp,*/*;q=0.8\r\nUser-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64)" +
//        " AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36\r\nAccept-Encoding:" +
//    " gzip,deflate,sdch\r\nAccept-Language: en-US,en;q=0.8,he;q=0.6
    //



    //aa\r\ncontent-length: 2\r\naa\r\n\r\nbbbb

    var a = RequestFinder().httpRequestFinder("GET /static/test.js HTTP/1.1\r\nHost: localhost:3000\r\n"+
    "Connection: keep-alive\r\nCache-Control: max-age=0\r\nAccept: text/html,application/xhtml+xml," +
        "application/xml;q=0.9,image/webp,*/*;q=0.8\r\nUser-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64)" +
        " AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36\r\nAccept-Encoding:" +
    " gzip,deflate,sdch\r\nAccept-Language: en-US,en;q=0.8,he;q=0.6\r\n\r\n","");
//    var b = RequestFinder().httpRequestFinder("aa\r\ncontent-length: 2\r\naa\r\n\r\nbbbb","");

//    alert("requests:\r\n" + a);
}




var RequestFinder = function()
{

    return {

        httpRequestFinder:function(clientsArray, socketAddress, newString)
        {
            var dynamicString = clientsArray[socketAddress];

            var charsToReduce = 16;
            var requestArray = new Array();
            var currentPosition = 0;
            var request = "";

            if(dynamicString == undefined) dynamicString = "";
            if(newString == undefined) newString = "";

            dynamicString += newString;
            clientsArray[socketAddress] = dynamicString;
            while(true)
            {
                var blankLineIndex = dynamicString.search("\r\n\r\n");
                if(blankLineIndex === -1)
                {
//                    alert("no blank line");
                    if(requestArray.length === 0)
                    {
                        return null;
                    }
                    return requestArray;
                }

                var startIndexOfContentLength = dynamicString.search(/content-length/i); //case insensitive search.
                if(startIndexOfContentLength === -1 || blankLineIndex < startIndexOfContentLength)
                {
                    request = dynamicString.substring(0, blankLineIndex + 2);
                    dynamicString = dynamicString.substring(blankLineIndex + 4);
                    clientsArray[socketAddress] = dynamicString;
                    requestArray[currentPosition] = request;
                    currentPosition++;
                    continue;
                }

                var endIndexOfContentLength = dynamicString.indexOf("\r\n", startIndexOfContentLength);
                var length = Number(dynamicString.substring(startIndexOfContentLength + charsToReduce, endIndexOfContentLength));

                if(length == undefined || isNaN(length))
                {
//                    alert("length undefined");
                    //need to decide what to do (when and where to fail the request)
                    break;
                }



                if(length === 0)
                {
                    request = dynamicString.substring(0, blankLineIndex + 2);
                    dynamicString = dynamicString.substring(blankLineIndex + 4);
                    clientsArray[socketAddress] = dynamicString;
                    requestArray[currentPosition] = request;
                    currentPosition++;
                    continue;
                }

                var startOfBody = Number((dynamicString.indexOf("\r\n\r\n")) + 4);
                var endOfBody = Number(startOfBody + length);
                request = dynamicString.substring(0, endOfBody);

                if(dynamicString.length < endOfBody)
                {
                    if(requestArray.length === 0)
                    {
                        return null;
                    }
                    return requestArray;
                }

                requestArray[currentPosition] = request;
                dynamicString = dynamicString.substring(endOfBody);
                clientsArray[socketAddress] = dynamicString;
                currentPosition++;
            }

        }

    }

};


module.exports = RequestFinder;