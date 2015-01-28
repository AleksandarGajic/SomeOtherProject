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
        if (data.status == 'food') {
            data.status = 'food';
            data.food = this.CreateFood();
        }

        data.package = self.ActiveGame[data.roomId];
        if (data.status == 'move') {
            data.status = 'update';
        }

        self.emit('status', {id: data.roomId, game: data});
    }

    this.StartGame = function (room, roomId) {
        var self = this;
        room.status = 'start';
        room.package = this.ActiveGame[roomId] = 0;
        room.food = this.CreateFood();
        self.emit('status', {id: roomId, game: room});
    }

    //Pair
    this.MakeGame = function (clientId) {
        var self = this;
        if (this.GamesWaiting.length) {
            if (this.GamesWaiting[0]) {
                var game = this.GamesWaiting[0];
                this.GamesWaiting = [];
                game.Player2Id = clientId;
                self.emit('pair', { data: game });
            }
        } else {
            var roomId = Math.floor(Math.random() * 100000);
            console.log(roomId);
            var game = {
                RoomId: roomId,
                Player1Id: clientId
            }

            this.GamesWaiting.push(game);
        }
    }

    this.CreateFood = function () {
        var food = {
            x: Math.round(Math.random()*(450-10)/10),
            y: Math.round(Math.random()*(450-10)/10)
        };

        return food;
    }
};

util.inherits(Game, events.EventEmitter);
module.exports = Game;