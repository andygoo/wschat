var WebSocketServer = require('ws').Server, 
    wss = new WebSocketServer({port: 10089});
	
var http = require('http');
var querystring=require('querystring');
var opts = {
	host: '127.0.0.1',
	port: '10010',
	method: 'get'
};

wss.on('connection', function connection(ws) {
    ws.on('message', function(data) {
		data = JSON.parse(data);
		var q = querystring.stringify({'q': data.msg});
		opts.path = '/reply?'+q;
		var req = http.request(opts, function(res) {
			res.setEncoding('utf8');  
			res.on('data', function(chunk) {
				console.log(chunk);
				chunk = JSON.parse(chunk);
				var data = {
					msg: chunk.data,
					type: 'msg'
				};
				ws.send(JSON.stringify(data));
			});
		});
		req.end();
    });
});

