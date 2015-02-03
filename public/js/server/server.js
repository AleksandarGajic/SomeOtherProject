/// <reference path="../common/common.js" />
window.Snake = window.Snake || {};
(function ($) {
    Snake.Server = function (model) {
        //Update package from server
        model.update = function (data) {
            switch (data.status) {
                case 'start':
                    model.food = data.food;
                    model.init();
                    model.startGame()
                    break;
                case 'update':
                    if (data.player != model.player) {
                        if (data.player1Snake) {
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
                        if (data.player1Snake) {
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
                        if (data.player1Snake) {
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

            model.emitMessage('updateStatus', {status: 'move', dir: direction});
        }

        model.sendMessage = function (message) {
            if (message) {
                //var message = '<strong>'+model.playersInfo.Name+':</strong> ' + message;
                model.emitMessage('sendMessage', {message: message});
            }
        }

        model.initSocket = function () {
            model.socket.on("connect", function () {
                $('a.start-game').click(function () {
                    $(this).hide();
                    model.statusText('Waiting for second player...');
                    Snake.Common.hideGameRoom();
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
                            var message = '';
                            if (data.player) {
                                message = '<strong class="red">'+model.player2Info().Name+': </strong>';
                            } else {
                                message = '<strong class="blue">'+model.player1Info().Name+': </strong>';
                            }

                            message += data.message;
                            model.chatMessages.push(message);
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

        model.emitMessage = function (status, data) {
            data.roomId = model.roomIdClient;
            data.player = model.player;
            if (status == 'crashed') {
                if (model.player) {
                    data.player1Snake = model.snake_array;
                } else {
                    data.player2Snake = model.snake_arrey_player_two;
                }
            } else {
                if (model.player) {
                    data.player2Snake = model.snake_arrey_player_two;
                } else {
                    data.player1Snake = model.snake_array;
                }
            }


            model.socket.emit(status, data);
        }

        return model;
    }
}($));