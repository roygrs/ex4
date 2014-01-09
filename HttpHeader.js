/**
 * Created by ILapshun on 12/20/13.
 */


var httpHeader = function() {

    this.request =  null;
    this.contentLength = null;
    this.httpVersion = null;
    this.contentType = null;
    this.resource = null;
    this.localHost = null;
    this.date = null;
    this.status =  null;
    this.reasonPhrase = null;
    this.connection = null;

    //internal usage fields
    this.keepAlive = true;
    this.isValidHttp = null;
    this.errorMessage = null;
}


//for debugging
httpHeader.prototype.toString = function()
{
    return String("http version: " + this.httpVersion + "\r\n status:" + this.status +
        "\r\n operationType: " + this.operationType + "\r\n resource: " + this.resource +
        "\r\n local host: " + this.localHost + "\r\n valid: " + this.isValidHttp +
        "\r\n error message: " + this.errorMessage + "\r\n keep alive: " + this.keepAlive +
        "\r\n connection: " + this.connection + "\r\n reason phrase: " + this.reasonPhrase +
        "\r\n" + "\r\n");
}


module.exports = httpHeader;