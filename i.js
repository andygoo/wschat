var WebSocketServer = require('ws').Server, 
    wss = new WebSocketServer({port: 10089});
var uuid = require('node-uuid');
	
var http = require('http');
var querystring=require('querystring');
var opts = {
	host: '127.0.0.1',
	port: '10010',
	method: 'get'
};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
		if (ws.status == null) {
			ws.status = setTimeout(function() {
				wss.reply(ws, data);
				ws.status = null;
			}, 2000);
		}
    });
	ws.on('close', function() {
        clearTimeout(ws.status);
    });
	ws.uid = uuid.v4();
	ws.status = null;
});

wss.reply = function reply(ws, data) {
	data = JSON.parse(data);
	var q = querystring.stringify({'q': data.msg, 'uid': ws.uid});
	opts.path = '/reply?'+q;
	var req = http.request(opts, function(res) {
		res.setEncoding('utf8');  
		res.on('data', function(chunk) {
			//console.log(chunk);
			chunk = JSON.parse(chunk);
			if (chunk.data) {
				var data = {
					msg: chunk.data
				};
				ws.send(JSON.stringify(data));
			}
		});
	});
	req.end();
};
