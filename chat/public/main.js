$(function() {
    var COLORS = ['#e21400','#91580f','#f8a700','#f78b00','#58dc00','#287b00','#a8f07a','#4ae8c4','#3b88eb','#3824aa','#a700ff','#d300e7'];

    var $window = $(window);
    var $usernameInput = $('.usernameInput');
    var $messages = $('.messages');
    var $inputMessage = $('.inputMessage');

    var $loginPage = $('.login.page'); 
    var $chatPage = $('.chat.page'); 

    var username;
    var connected = false;

    var socket = io();

    function addParticipantsMessage (data) {
        var message = "there are " + data.numUsers + " participants";
        log(message);
    }

    function setUsername () {
        username = cleanInput($usernameInput.val().trim());

        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();

            socket.emit('add user', username);
        }
    }

    function sendMessage () {
        var message = $inputMessage.val();
        message = cleanInput(message);

        if (message && connected) {
            $inputMessage.val('');
            addChatMessage({
                username: username,
                message: message
            });
            socket.emit('new message', message);
        }
    }

    function log (message, options) {
        var $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }

    function addChatMessage (data, options) {
        var options = options || {};

        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    function addMessageElement (el, options) {
        var $el = $(el);

        if (!options) {
            options = {};
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    function cleanInput (input) {
        return $('<div/>').text(input).text();
    }

    function getUsernameColor (username) {
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    $window.keydown(function (event) {
        if (event.which === 13) {
            if (username) {
                sendMessage();
            } else {
                setUsername();
            }
        }
    });

    socket.on('login', function (data) {
        connected = true;
        var message = "Welcome to Socket.IO Chat";
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
    });

    socket.on('new message', function (data) {
        addChatMessage(data);
    });

    socket.on('user joined', function (data) {
        log(data.username + ' joined');
        addParticipantsMessage(data);
    });

    socket.on('user left', function (data) {
        log(data.username + ' left');
        addParticipantsMessage(data);
    });
});
