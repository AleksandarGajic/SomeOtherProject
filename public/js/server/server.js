/// <reference path="../common/common.js" />
window.Snake = window.Snake || {};
(function ($) {
    Snake.Server = function (model) {
        //Update package from server
        model.update = function (data) {
            switch (data.status) {
                case 'start':
                    model.food = data.food;
                    model.startGame()
                    break;
                case 'update':
                    if (data.player != model.player) {
                        if (model.player) {
                            model.snake_array = data.player1Snake;
                        } else {
                            model.snake_arrey_player_two = data.player2Snake;
                        }

                        if (data.player) {
                            model.d2 = data.dir;
                        } else {
                            model.d = data.dir;
                        }
                    }
                    break;
                case 'food':
                    model.food = data.food;
                    if (data.player != model.player) {
                        if (model.player) {
                            model.snake_array = data.player1Snake;
                        } else {
                            model.snake_arrey_player_two = data.player2Snake;
                        }

                        if (data.player) {
                            model.scoreTwo(data.score);
                        } else {
                            model.score(data.score);
                        }
                    }
                    break;
                case 'crashed':
                    if (data.player != model.player) {
                        if (model.player) {
                            model.snake_array = data.player1Snake;
                        } else {
                            model.snake_arrey_player_two = data.player2Snake;
                        }
                    }

                    if (data.player) { //Player two crashed
                        var koScoreTemp = model.koScore();
                        model.koScore(++koScoreTemp);
                    } else {
                        var koScoreTemp = model.koScoreTwo();
                        model.koScoreTwo(++koScoreTemp);
                    }
                    break;
            }
        }

        model.updateStatus = function (direction) {
            if (model.player) {
                model.d2 = direction;
            } else {
                model.d = direction;
            }

            model.socket.emit('updateStatus', { roomId: model.roomIdClient, player: model.player, dir: direction, status: 'move', player1Snake: model.snake_array, player2Snake: model.snake_arrey_player_two });
        }

        model.sendMessage = function (message) {
            if (message) {
                var message = '<strong>'+model.playersInfo.Name+':</strong> ' + message;
                model.socket.emit('sendMessage', { roomId: model.roomIdClient, message: message});
            }
        }

        model.initSocket = function () {
            model.socket.on("connect", function () {
                $('a.start-game').click(function () {
                    $(this).hide();
                    $('p.status').text('Waiting for second player...');

                    model.socket.emit("handshake", model.playersInfo);
                    if (!model.isInitiSocketCompleted) {
                        model.isInitiSocketCompleted = true;
                        model.socket.on("pair", function (gameData) {
                            model.gameData = gameData;
                            model.player1Info({});
                            model.player1Info(gameData.Player1Info);
                            model.player2Info({});
                            model.player2Info(gameData.Player2Info);
                            model.roomIdClient = gameData.RoomId;
                            model.player = gameData.Player;
                            model.socket.emit("join", {roomId: gameData.RoomId, clientId: model.playersInfo.Id});
                        });

                        model.socket.on("messageUpdate", function (data) {
                            model.chatMessages.push(data);
                            setTimeout(function () {
                                $('.chat').scrollTop($('#chat-screen').height());
                            }, 100);
                        });
                        model.socket.on("status", function (data) {
                            if (data.packageNo > model.packageNo) {
                                model.update(data);
                            }
                        });
                    }
                });
            });
        }

        return model;
    }
}($));