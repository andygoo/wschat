<!DOCTYPE html>
<html lang="zh-cn">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet" href="http://cdn.bootcss.com/bootstrap/3.3.5/css/bootstrap.min.css" media="screen" type="text/css" />
<link rel="stylesheet" href="/c.css" media="screen" type="text/css" />
<body>
<div class="chat">
	<ul class="chat-thread" id="msgs"></ul>
	<div id="msg-input" class="form-group" style="background: #fff; position: fixed; left:0; bottom:0; padding: 8px 6px; margin-bottom: 0; border-top: 1px solid #ddd">
	<div class="input-group">
		<input type="text" class="form-control" id="msg_content" name="title" value="" placeholder="" autofocus>
		<span class="input-group-btn">
			<button class="btn btn-info" type="button" id="send_btn" style="outline:none">发送</button>
		</span>
	</div>
   </div>
</div>
<script src="http://cdn.bootcss.com/jquery/1.11.3/jquery.min.js"></script>

<script>
//var ws = new WebSocket("ws://192.168.1.106:10089/");
//var ws = new WebSocket("ws://127.0.0.1:10089/");
var ws = new WebSocket("ws://192.168.2.56:10089/");
ws.onopen = function() {
	var nickname = '<?= $user_info['nickname']?>';
	var data = {
		'type': 'join',
		'nick': nickname,
	};
	ws.send(JSON.stringify(data));
	welcome(nickname);
};
ws.onclose = function() {
	var data = {
		'type': 'sysmsg',
		'msg': 'sys closed',
	};
	addsysmsg(data);
};
ws.onmessage = function (evt) {
	var data = JSON.parse(event.data);
	console.log(data);
	if (data.type == 'msg') {
		addmsg(data, 'left');
	} else {
		addsysmsg(data);
	}
};
function addmsg(data, direction) {
	if (direction == 'left') {
		$('#msgs').append('<li class="'+direction+'"><div class="avatar glyphicon glyphicon-user"></div>'+data.msg+'<div class="nick">'+data.nick+'</div></li>');
	} else if (direction == 'right') {
		$('#msgs').append('<li class="'+direction+'"><div class="avatar glyphicon glyphicon-user"></div>'+data.msg+'</li>');
	}
	//$('#msgs')[0].scrollTop = $('#msgs')[0].scrollHeight;
	$('body')[0].scrollTop = $('body')[0].scrollHeight;
}

function addsysmsg(data) {
	if (data.type == 'join') {
		data.msg = data.nick + ' joined';
	} else if (data.type == 'exit') {
		data.msg = data.nick + ' exited';
	}
	$('#msgs').append('<li class="mid"><span>'+data.msg+'</span></li>');
}
function welcome(nick) {
	var data = {
		'type': 'sysmsg',
		'msg': 'welcome! ' + nick,
	};
	addsysmsg(data);
}
$(function() {
	$('#send_btn').click(function() {
		var msg = $('#msg_content').val();
		if ($.trim(msg) == '') {
			return false;
		}
		var data = {
			'type': 'msg',
			'msg': msg,
		};
		addmsg(data, 'right');
		ws.send(JSON.stringify(data));
		$('#msg_content').val('').focus();
	});
});
</script>

</body>
</html>