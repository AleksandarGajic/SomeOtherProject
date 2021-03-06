window.Snake = window.Snake || {};
(function ($) {
    Snake.Game = function () {
        var model = {
            game_loop: null,
            playerMoved: false,
            statusText: ko.observable(''),
            messageText: ko.observable(''),
            chatMessages: ko.observableArray([]),
            player1Info: ko.observable({}),
            player2Info: ko.observable({}),
            countDownText: ko.observable(''),
            cw: 10,
            gameData: {},
            gameStartTimer: null,
            playersInfo: null,
            box_size: 45,
            startSpeed: 150,
            speed: 150,
            speedDelta: 25, //speed delta change
            timeDelta: 24 * 1000, //evry 24 seconds change game speed
            roomIdClient: null,
            gamePlayTimeMinutes: 2,
            countDown: 3,
            timer: ko.observable(0),
            d: 0,
            d2: 0,
            player: 0,
            food: 0,
            score: ko.observable(0),
            scoreTwo: ko.observable(0),
            koScore: ko.observable(0),
            koScoreTwo: ko.observable(0),
            packageNo: -1,
            socket: io.connect("https://snake-wars.herokuapp.com/", { resources: "socket.io" }),
            //socket: io.connect("http://192.168.0.87:3000", { resources: "socket.io" }),
            snake_array: [], //an array of cells to make up the snake
            snake_arrey_player_two: []
        }

        $.extend(model, new Snake.Social(model));
        $.extend(model, new Snake.Server(model));

        model.getTime = ko.computed({
            read: function(){
                var time = model.timer();
                var minutes = Math.floor(time / 60000);
                time -= minutes * 60000;
                var seconds = Math.floor(time / 1000);
                return minutes + ":" + (seconds < 10 ? ('0' + seconds) : seconds);
            }
        })

        model.init = function () {
            model.speed = model.startSpeed;
            //finally lets display the score
            model.timer(model.gamePlayTimeMinutes * 60 * 1000 + model.startSpeed); //2 minutes plus start speed for first paint
            model.score(0);
            model.scoreTwo(0);
            model.koScore(0);
            model.koScoreTwo(0);
            model.timeChange = model.timer() - model.timeDelta;
            model.create_snakes();
            //Lets move the snake now using a timer which will trigger the paint function
            model.paint();
        }

        model.startLoop = function () {
            if (model.game_loop) clearInterval(model.game_loop);
            model.game_loop = setInterval(model.paint, model.speed);
        }

        model.create_snakes = function () {
            model.createP1Snake();
            model.createP2Snake();
        }

        model.createP1Snake = function () {
            model.d = "right"; //default direction
            var length = 5; //Length of the snake
            model.snake_array = []; //Empty array to start with
            for (var i = length - 1; i >= 0; i--) {
                //This will create a horizontal snake starting from the top left
                model.snake_array.push({ x: i, y: 0 });
            }
        }

        model.createP2Snake = function () {
            model.d2 = "left"; //default direction second player
            var length = 5; //Length of the snake
            model.snake_arrey_player_two = []; //Empty array to start with
            for (var i = model.box_size - length; i < model.box_size; i++) {
                //This will create a horizontal snake starting from the top left
                model.snake_arrey_player_two.push({ x: i, y: 0 });
            }
        }

        model.paint = function () {
            //check for update
            model.playerMoved = false;
            var time = model.timer();
            time -= model.speed;

            if (time <= 0 && model.game_loop) { //Game OVer
                clearInterval(model.game_loop);
                ctx.fillStyle = "black";
                if (model.koScore() == model.koScoreTwo) {
                    if (model.score() == model.scoreTwo()) {
                        ctx.fillText("Game Over!! Draw!", 10, 50);
                    } else {
                        if (model.score() > model.scoreTwo()) {
                            ctx.fillText("Game Over!! Player 1 Wins!", 10, 50);
                        } else {
                            ctx.fillText("Game Over!! Player 2 Wins!", 10, 50);
                        }
                    }
                } else {
                    if (model.koScore() > model.koScoreTwo()) {
                        ctx.fillText("Game Over!! Player 1 Wins!", 10, 50);
                    } else {
                        ctx.fillText("Game Over!! Player 2 Wins!", 10, 50);
                    }
                }

                ctx.fill();
                $('.status').text('');
                $('.start-game').show();
                $('.main-screen').show();
                return;
            }

            model.timer(time);
            if (time < model.timeChange) {
                model.timeChange -= model.timeDelta;
                model.speed -= model.speedDelta;
                clearInterval(model.game_loop);
                model.game_loop = setInterval(model.paint, model.speed);
            }

            var crashedP1 = 0;
            var crashedP2 = 0;
            //To avoid the snake trail we need to paint the BG on every frame
            //Lets paint the canvas now
            //ctx.fillStyle = "#eee";
            ctx.fillStyle = "#EEE";
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

            //Check for crash P1
            if (nx == -1 || nx == w / model.cw || ny == -1 || ny == h / model.cw || model.check_collision(nx, ny, model.snake_array) || model.check_collision(nx, ny, model.snake_arrey_player_two)) {
                crashedP1 = 1;
            }

            //Check for crash P2
            if (nx2 == -1 || nx2 == w / model.cw || ny2 == -1 || ny2 == h / model.cw || model.check_collision(nx2, ny2, model.snake_arrey_player_two) || model.check_collision(nx2, ny2, model.snake_array)) {
                crashedP2 = 2;
            }

            if (crashedP1) {
                model.createP1Snake();
                if (!model.player) {
                    model.emitMessage('updateStatus', {status: 'crashed'});
                }
            }

            if (crashedP2) {
                model.createP2Snake();
                if (model.player) {
                    model.emitMessage('updateStatus', {status: 'crashed'});
                }
            }

            if (crashedP1 && crashedP2) {
                model.paint_cell(model.food.x, model.food.y, "#000");
                return;
            }


            //Player 2 eats food
            var tail, tail2, eaten;
            if (model.player) {
                if (!crashedP2) {
                    if (nx2 == model.food.x && ny2 == model.food.y) {
                        var tail2 = {x: nx2, y: ny2};
                        var score = model.scoreTwo();
                        model.scoreTwo(++score);
                        eaten = true;
                    } else {
                        tail2 = model.snake_arrey_player_two.pop();
                        tail2.x = nx2;
                        tail2.y = ny2;
                    }
                }

                if (!crashedP1) {
                    tail = model.snake_array.pop(); //pops out the last cell
                    tail.x = nx;
                    tail.y = ny;
                }
            } else {
                if (!crashedP1) {
                    if (nx == model.food.x && ny == model.food.y) {
                        var tail = {x: nx, y: ny};
                        var score = model.score();
                        model.score(++score);
                        eaten = true;
                    }
                    else {
                        tail = model.snake_array.pop(); //pops out the last cell
                        tail.x = nx;
                        tail.y = ny;
                    }
                }

                if (!crashedP2) {
                    tail2 = model.snake_arrey_player_two.pop();
                    tail2.x = nx2;
                    tail2.y = ny2;
                }
            }

            if (!crashedP1) {
                model.snake_array.unshift(tail);
            }

            if (!crashedP2) {
                model.snake_arrey_player_two.unshift(tail2);
            }

            if (eaten) {
                model.emitMessage('updateStatus', {status: 'food', score: model.player ? model.scoreTwo() : model.score()});
            }

            for (var i = 0; i < model.snake_arrey_player_two.length; i++) {
                var c = model.snake_arrey_player_two[i];
                model.paint_cell(c.x, c.y, "red");
            }

            for (var i = 0; i < model.snake_array.length; i++) {
                var c = model.snake_array[i];
                model.paint_cell(c.x, c.y, "blue");
            }

            model.paint_cell(model.food.x, model.food.y, "#000");
        }

        model.startGame = function () {
            Snake.Common.showGameRoom();
            model.countDownText(model.countDown)
            if (model.player) {
                $('.count-down').addClass('red');
            } else {
                $('.count-down').removeClass('red');
            }

            if (model.gameStartTimer) {
                clearTimeout(model.gameStartTimer);
            }

            model.gameStartTimer = setTimeout(function () {
                model.countDown--;
                model.countDownText(model.countDown)
                if (model.countDown == 0) {
                    clearTimeout(model.gameStartTimer);
                    model.countDownText('Go!');
                    setTimeout(function () {
                        model.countDown = 3;
                        model.countDownText('');
                        model.startLoop();
                    }, 1000);

                } else {
                    model.startGame();
                }
            }, 1000);
        };

        model.paint_cell = function (x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * model.cw, y * model.cw, model.cw, model.cw);
            //ctx.strokeStyle = "white";
            //ctx.strokeRect(x * model.cw, y * model.cw, model.cw, model.cw);
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

        model.sendMessageClick = function () {
            model.sendMessage(model.messageText());
            model.messageText('');
        }

        return model;
    }

    $(document).ready(function () {
        var model = new Snake.Game();
        ko.applyBindings(model, $('.body')[0]);

        var canvas = $("#canvas")[0];
        w = 450;
        h = 450;
        ctx = canvas.getContext("2d"),

        model.initSocket();
        $(document).keydown(function (e) {

            var key = e.which;
            var status = '';
            if (model.player) {
                status = model.d2;
            } else {
                status = model.d;
            }

            if (model.game_loop && !model.playerMoved) {
                model.playerMoved = true;
                if (key == "37" && status != "right") {
                    model.updateStatus("left");
                    e.preventDefault();
                } else if (key == "38" && status != "down") {
                    model.updateStatus("up");
                    e.preventDefault();
                } else if (key == "39" && status != "left") {
                    model.updateStatus("right");
                    e.preventDefault();
                } else if (key == "40" && status != "up") {
                    model.updateStatus("down");
                    e.preventDefault();
                }
            }

            if (key =="13") {
                $('.chat-wrap input').blur();
                model.sendMessageClick();
                $('.chat-wrap input').focus();
            }
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