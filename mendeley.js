var http = require('http');
var EventEmitter = require('events').EventEmitter;
var util = require("util");

function MendeleyRequest(endpoint, method, params) {
    EventEmitter.call(this);
    var me = this; // TODO: is there a better way to do this?
    
    var options = {
        host: endpoint.host,
        port: endpoint.port,
        path: '/oapi/' + method + '/' + params + '?consumer_key=' + endpoint.apikey
    };
    
    var req = http.get(options, function (res) {
        res.setEncoding('utf8');
        var data = "";
        
        res.on('data', function (chunk) {
            data += chunk;
        });
        
        res.on('end', function () {
            var json = JSON.parse(data);
            me.emit('end', json);
        });
    });
}
util.inherits(MendeleyRequest, EventEmitter);

function MendeleyAPI(apikey) {
    EventEmitter.call(this);
    // TODO: add error checking for the apiKey and other options
    
    var endpoint = {
        host: 'api.mendeley.com',
        port: 80,
        apikey: apikey
    };
    
    this.tagged = function(tag) {
        var req = new MendeleyRequest(endpoint, 'documents/tagged', tag);
        
        req.on('end', function (tagged) {
            req.emit('success', tagged.documents);
        });
        
        return req;
    }
    
    this.related = function(documentId) {
        var req = new MendeleyRequest(endpoint, 'documents/related', documentId);
        
        req.on('end', function(related) {
            req.emit('success', related.documents);
        });
        
        return req;
    }
}

util.inherits(MendeleyAPI, EventEmitter);

module.exports = MendeleyAPI;
