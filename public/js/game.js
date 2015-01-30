window.Snake = window.Snake || {};
(function ($) {
    Snake.Game = function () {
        var model = {
            cw: 10,
            gameData: {},
            gameStartTimer: null,
            playersInfo: null,
            box_size: 45,
            speed: 150,
            roomIdClient: null,
            countDown: 3,
            d: 0,
            d2: 0,
            player: 0,
            food: 0,
            score: 0,
            packageNo: -1,
            //socket: io.connect("https://snake-wars.herokuapp.com/", { resources: "socket.io" }),
            socket: io.connect("http://192.168.0.87:3000", { resources: "socket.io" }),
            snake_array: [], //an array of cells to make up the snake
            snake_arrey_player_two: []
        }

        $.extend(model, new Snake.Social(model));

        model.init = function () {
            model.d = "right"; //default direction
            model.d2 = "left"; //default direction second player

            model.create_snakes();
            //finally lets display the score
            model.score = 0;

            //Lets move the snake now using a timer which will trigger the paint function
            //every 60ms
            if (typeof game_loop != "undefined") clearInterval(game_loop);
            game_loop = setInterval(model.paint, model.speed);
        }

        model.create_snakes = function () {
            var length = 5; //Length of the snake
            model.snake_array = []; //Empty array to start with
            for (var i = length - 1; i >= 0; i--) {
                //This will create a horizontal snake starting from the top left
                model.snake_array.push({ x: i, y: 0 });
            }

            model.snake_arrey_player_two = []; //Empty array to start with
            for (var i = model.box_size - length; i < model.box_size; i++) {
                //This will create a horizontal snake starting from the top left
                model.snake_arrey_player_two.push({ x: i, y: 0 });
            }
        }

        //Lets paint the snake now
        model.paint = function () {
            //To avoid the snake trail we need to paint the BG on every frame
            //Lets paint the canvas now
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, w, h);

            //The movement code for the snake to come here.
            //The logic is simple
            //Pop out the tail cell and place it infront of the head cell
            var ny = model.snake_array[0].y;
            var nx = model.snake_array[0].x;

            var nx2 = model.snake_arrey_player_two[0].x;
            var ny2 = model.snake_arrey_player_two[0].y;
            //These were the position of the head cell.
            //We will increment it to get the new head position
            //Lets add proper direction based movement now
            if (model.d == "right") nx++;
            else if (model.d == "left") nx--;
            else if (model.d == "up") ny--;
            else if (model.d == "down") ny++;

            if (model.d2 == "right") nx2++;
            else if (model.d2 == "left") nx2--;
            else if (model.d2 == "up") ny2--;
            else if (model.d2 == "down") ny2++;

            if (nx == -1 || nx == w / model.cw || ny == -1 || ny == h / model.cw || model.check_collision(nx, ny, model.snake_array) || model.check_collision(nx, ny, model.snake_arrey_player_two)) {
                clearInterval(game_loop);
                ctx.fillStyle = "black";
                ctx.fillText("Game Over Player 2 wins!!", 10, 50);
                ctx.fill();
                $('.status').text('');
                $('.start-game').show();
                $('.main-screen').show();
            }

            if (nx2 == -1 || nx2 == w / model.cw || ny2 == -1 || ny2 == h / model.cw || model.check_collision(nx2, ny2, model.snake_arrey_player_two) || model.check_collision(nx2, ny2, model.snake_array)) {
                //restart game
                clearInterval(game_loop);
                ctx.fillStyle = "black";
                ctx.fillText("Game Over. Player 1 wins!!", 10, 50);
                ctx.fill();
                $('.status').text('');
                $('.start-game').show();
                $('.main-screen').show();
            }

            //Player 1 eats food


            //Player 2 eats food
            var tail, tail2, eaten;
            if (model.player) {
                if (nx2 == model.food.x && ny2 == model.food.y) {
                    var tail2 = { x: nx2, y: ny2 };
                    model.score++;
                    eaten = true;
                } else {
                    tail2 = model.snake_arrey_player_two.pop();
                    tail2.x = nx2; tail2.y = ny2;
                }
                tail = model.snake_array.pop(); //pops out the last cell
                tail.x = nx; tail.y = ny;
            } else {
                tail2 = model.snake_arrey_player_two.pop();
                tail2.x = nx2; tail2.y = ny2;
                if (nx == model.food.x && ny == model.food.y) {
                    var tail = { x: nx, y: ny };
                    model.score++;
                    eaten = true;
                }
                else {
                    tail = model.snake_array.pop(); //pops out the last cell
                    tail.x = nx; tail.y = ny;
                }
            }

            model.snake_array.unshift(tail);
            model.snake_arrey_player_two.unshift(tail2);

            if (eaten) {
                model.socket.emit('updateStatus', { roomId: model.roomIdClient, player: model.player, status: 'food', player1Snake: model.snake_array, player2Snake: model.snake_arrey_player_two });
            }

            for (var i = 0; i < model.snake_arrey_player_two.length; i++) {
                var c = model.snake_arrey_player_two[i];
                model.paint_cell(c.x, c.y, "red");
            }

            for (var i = 0; i < model.snake_array.length; i++) {
                var c = model.snake_array[i];
                model.paint_cell(c.x, c.y, "blue");
            }

            model.paint_cell(model.food.x, model.food.y, "black");
            var score_text = "Score: " + model.score;
            ctx.fillText(score_text, 5, h - 5);
        }

        model.startGame = function () {
            $('.status').text(model.countDown).css({ fontSize: '50px', color: model.player ? 'Red' : 'Blue' });
            if (!$('.player1 h1').length) {
                $('.player1').append('<h1>'+model.gameData.Player1Info.Name+'</h1>');
                $('.player2').append('<h1>'+model.gameData.Player2Info.Name+'</h1>');
                $('.player1').append('<img src="'+model.gameData.Player1Info.Image+'" />');
                $('.player2').append('<img src="'+model.gameData.Player2Info.Image+'" />');
            }
            if (model.gameStartTimer) {
                clearTimeout(model.gameStartTimer);
            }

            model.gameStartTimer = setTimeout(function () {
                model.countDown--;
                $('.status').text(model.countDown);
                if (model.countDown == 0) {
                    clearTimeout(model.gameStartTimer);
                    $('.status').text('Go...');
                    setTimeout(function () {
                        $('.main-screen').hide();
                        $(".game-screen").show();
                        model.countDown = 3;
                        model.init();
                    }, 1000);

                } else {
                    model.startGame();
                }
            }, 1000);
        };

        //Lets first create a generic function to paint cells
        model.paint_cell = function (x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * model.cw, y * model.cw, model.cw, model.cw);
            ctx.strokeStyle = "white";
            ctx.strokeRect(x * model.cw, y * model.cw, model.cw, model.cw);
            ctx.fillStyle = "black";
        }

        model.check_collision = function (x, y, array) {
            //This function will check if the provided x/y coordinates exist
            //in an array of cells or not
            for (var i = 0; i < array.length; i++) {
                if (array[i].x == x && array[i].y == y)
                    return true;
            }
            return false;
        }


        model.update = function (data) {
            model.snake_array = data.player1Snake;
            model.snake_arrey_player_two = data.player2Snake;

            if (data.status == 'start') {
                model.food = data.food;

                if (data.player1 == model.playersInfo.Id) {
                    model.player = 0;
                } else {
                    model.player = 1;
                }

                model.startGame()

            }


            if (data.status == 'update') {
                if (data.player != model.player) {
                    if (data.player) {
                        model.d2 = data.dir;
                    } else {
                        model.d = data.dir;
                    }
                }
            }

            if (data.status == 'food') {
                model.food = data.food;
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

        model.initSocket = function () {
            model.socket.on("connect", function () {
                $('a.start-game').click(function () {
                    $(this).hide();
                    $('p.status').text('Waiting for second player...');

                    model.socket.emit("handshake", model.playersInfo);

                    model.socket.on("pair", function (gameData) {
                        model.gameData = gameData;
                        model.roomIdClient = gameData.RoomId;
                        model.socket.emit("join", { roomId: gameData.RoomId, clientId: model.playersInfo.Id });
                    });

                    model.socket.on("messageUpdate", function (data) {
                        $('#chat-screen').append($('<li>').html(data));

                    });
                    model.socket.on("status", function (data) {
                        if (data.packageNo > model.packageNo) {
                            model.update(data);
                        }
                    });
                });
            });
        }

        model.sendMessage = function (message) {
            if (message) {
                var message = '<strong>'+model.playersInfo.Name+':</strong> ' + message;
                model.socket.emit('sendMessage', { roomId: model.roomIdClient, message: message});
            }
        }

        return model;
    }

    $(document).ready(function () {
        var model = new Snake.Game();

        var canvas = $("#canvas")[0];
        ctx = canvas.getContext("2d"),
        w = $("#canvas").width(),
        h = $("#canvas").height();
        $(".game-screen").hide();
        model.initSocket();
        $(document).keydown(function (e) {
            var key = e.which;
            var status = '';
            if (model.player) {
                status = model.d2;
            } else {
                status = model.d;
            }

            if (key == "37" && status != "right") model.updateStatus("left");
            else if (key == "38" && status != "down") model.updateStatus("up");
            else if (key == "39" && status != "left") model.updateStatus("right");
            else if (key == "40" && status != "up") model.updateStatus("down");
        });

        $('.send-message').click(function () {
            var message = $(this).prev().val();
            model.sendMessage(message);
            $(this).prev().val('');
        });
        function facebookReady(){
            FB.init({
                appId  : '131051383772578',
                status : true,
                cookie : true,
                xfbml  : true,
                version: 'v2.2'
            });

            FB.Event.subscribe('auth.authResponseChange', model.onAuthResponseChange);
            FB.Event.subscribe('auth.statusChange', model.onStatusChange);
        }

        if(window.FB) {
            facebookReady();
        } else {
            window.fbAsyncInit = facebookReady;
        }
    });
}(jQuery));