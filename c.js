var WebSocketServer = require('ws').Server, 
    wss = new WebSocketServer({ port: 10089 });
var uuid = require('node-uuid');

wss.on('connection', function connection(ws) {
    ws.on('message', function(data) {
        data = JSON.parse(data);
        if (data.type == 'join') {
            ws.nick = data.nick;
            wss.broadcast({
                nick: ws.nick,
                uid: ws.uid,
                type: 'join'
            });
        } else {
            wss.broadcast({
                nick: ws.nick,
                uid: ws.uid,
                time: new Date().getTime(),
                msg: data.msg,
                type: 'msg'
            });
        }
    });

	ws.on('close', function() {
        wss.broadcast({
            nick: ws.nick,
            uid: ws.uid,
            type: 'exit'
        });
    });
	
    ws.uid = uuid.v4();
    ws.nick = 'guest';
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.uid != data.uid) {
            client.send(JSON.stringify(data));
        }
    });
};

