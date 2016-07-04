var WebSocketServer = require('ws').Server, 
    wss = new WebSocketServer({port: 10089});
var uuid = require('node-uuid');

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        data = JSON.parse(data);
		if (data.nick) {
			ws.nick = data.nick;
		}
		data.nick = ws.nick;
		data.uid = ws.uid;
		data.time = new Date().getTime();
		wss.broadcast(data);
    });
	ws.on('close', function() {
        wss.broadcast({
            nick: ws.nick,
            uid: ws.uid,
            type: 'exit'
        });
    });
    ws.nick = 'guest';
    ws.uid = uuid.v4();
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.uid != data.uid) {
            client.send(JSON.stringify(data));
        }
    });
};

