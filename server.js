var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    Game = require('./lib/game');

var cors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if ('OPTIONS' == req.method) return res.send(200);

    next();
};

io.configure(function() {
    io.set('transports', [ 'xhr-polling', 'websocket' ]);
    if (process.env.IISNODE_VERSION) {
        io.set('resource', '/socket.io');
    }
});

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('ver', '0.1');
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(cors);
    app.use(app.router);

    app.get("/*", function(req, res, next) {
        if (app._router && app._router.stack) {
             for (var i = 0; i < app._router.stack.length; i++) {
                var route = app._router.stack[i].route;
                if (route && route.path == req.path)
                    return next();
            }
        };

        res.sendFile(__dirname + '/public/index.html');
    });
});

if ('production' == app.get('env')) {
    app.use(express.errorHandler());
} else {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

var config = {
        facebook: {
            client_id: '131051383772578',
            client_secret: 'b535c76f81d6adc1dd3af813fbeafc94',
            grant_type: 'client_credentials'
        }
    }
    game = new Game();


app.post('/', function(req, res, next){
    res.sendfile(__dirname + '/public/index.html')
});

server.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

var clients = {};
var rooms = {};

game.on('pair', function (data) {
    if (data && data.data) {
        data = data.data;
        if (data.Player1Id && data.Player2Id && data.RoomId && clients[data.Player1Id] && clients[data.Player2Id]) {
            data.Player = 0;
            clients[data.Player1Id].emit('pair', data);
            data.Player = 1;
            clients[data.Player2Id].emit('pair', data);
        }
    }
});

game.on('status', function (data) {
    if (data && data.id) {
        io.sockets.in(data.id).emit('status', data.game);
    }
});

game.on('messageUpdate', function (data) {
    if (data && data.id) {
        io.sockets.in(data.id).emit('messageUpdate', data.message);
    }
});

io.sockets.on('connection', function (socket) {
    socket.on('handshake', function (client) {
        if (client) {
            this.store.data.clientId = client.Id;
            clients[client.Id] = this;
            game.MakeGame(client);
        }
    });

    socket.on('updateStatus', function (data) {
        game.UpdateStatus(data);
    })

    socket.on('sendMessage', function (data) {
        console.log(data);
        game.SendMessage(data);
    })

    socket.on('join', function (data) {
        if (data.roomId && data.clientId) {
            if (clients[data.clientId]) {
                clients[data.clientId].join(data.roomId);
                if (!rooms[data.roomId]) {
                    rooms[data.roomId] = {};
                    rooms[data.roomId].player1 = data.clientId;
                } else {
                    if (!rooms[data.roomId].player2)
                        rooms[data.roomId].player2 = data.clientId;
                        game.StartGame(rooms[data.roomId], data.roomId);
                }
            }
        }
    });
})
.on('disconnect', function (socket) {
    var id = socket.store.data.clientId;
    console.log(id);
    if (id && clients[id]) {
        clients[id] = null;
        delete clients[id];
    }
});