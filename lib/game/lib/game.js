var util = require('util'),
    events = require('events');

var Game = function () {
    events.EventEmitter.call(this);
    /*
     RoomId
     Player1Id,
     Player2Id
     */
    this.GamesWaiting = [],
    this.ActiveGame = {};

    this.UpdateStatus = function(data) {
        var self = this;
        self.ActiveGame[data.roomId]++;
        data.packageNo = self.ActiveGame[data.roomId];
        if (data.status == 'food') {
            data.food = self.CreateFood();
        }
        if (data.status == 'crashed') {
            console.log(data);
        }
        if (data.status == 'move') {
            data.status = 'update';
        }

        self.emit('status', {id: data.roomId, game: data});
    }

    this.StartGame = function (room, roomId) {
        var self = this;
        room.status = 'start';
        self.ActiveGame[roomId] = 0;
        room.packageNo = 0;
        room.food = self.CreateFood();
        self.emit('status', {id: roomId, game: room});
    }

    //Pair
    this.MakeGame = function (client) {
        var self = this;
        if (self.GamesWaiting.length) {
            if (self.GamesWaiting[0]) {
                var game = self.GamesWaiting[0];
                self.GamesWaiting = [];
                game.Player2Info = client;
                game.Player2Id = client.Id;
                self.emit('pair', { data: game });
            }
        } else {
            var roomId = Math.floor(Math.random() * 1000000);
            var game = {
                RoomId: roomId,
                Player1Info: client,
                Player1Id: client.Id
            }

            self.GamesWaiting.push(game);
        }
    }

    this.CreateFood = function () {
        var food = {
            x: Math.round(Math.random()*(450-10)/10),
            y: Math.round(Math.random()*(450-10)/10)
        };

        return food;
    }

    this.SendMessage = function (data) {
        var self = this;
        self.emit('messageUpdate', {id: data.roomId, message: data});
    }
};

util.inherits(Game, events.EventEmitter);
module.exports = Game;