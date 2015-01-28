(function ($) {
	var cw = 10,
		box_size = 45,
		speed = 50,
		roomIdClient = null,
		countDown = 3,
		d,
		d2,
		player = 0,
		food,
		score,
		package = -1,
		details = {resources:"socket.io"}, 
		socket = io.connect("http://192.168.0.87:3000/", details),
		facebookId = Math.floor(Math.random() * 10000),
		snake_array, //an array of cells to make up the snake
		snake_arrey_player_two;
		
	function init()
	{
		d = "right"; //default direction
		d2 = "left"; //default direction second player
		
		create_snakes();
		//finally lets display the score
		score = 0;
		
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, speed);
	}
	
	function create_snakes()
	{
		var length = 5; //Length of the snake
		snake_array = []; //Empty array to start with
		for(var i = length-1; i>=0; i--)
		{
			//This will create a horizontal snake starting from the top left
			snake_array.push({x: i, y:0});
		}
		
		snake_arrey_player_two = []; //Empty array to start with
		for(var i = box_size - length; i < box_size; i++)
		{
			//This will create a horizontal snake starting from the top left
			snake_arrey_player_two.push({x: i, y:0});
		}
	}
		
	//Lets paint the snake now
	function paint()
	{
		//To avoid the snake trail we need to paint the BG on every frame
		//Lets paint the canvas now
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
		
		//The movement code for the snake to come here.
		//The logic is simple
		//Pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
		
		var nx2 = snake_arrey_player_two[0].x;
		var ny2 = snake_arrey_player_two[0].y;
		//These were the position of the head cell.
		//We will increment it to get the new head position
		//Lets add proper direction based movement now
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		if(d2 == "right") nx2++;
		else if(d2 == "left") nx2--;
		else if(d2 == "up") ny2--;
		else if(d2 == "down") ny2++;
		
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array) || check_collision(nx, ny, snake_arrey_player_two))
		{
			clearInterval(game_loop);
			ctx.fillStyle = "black";
			ctx.fillText("Game Over Player 2 wins!!", 10, 50);
			ctx.fill();
		}
		
		if(nx2 == -1 || nx2 == w/cw || ny2 == -1 || ny2 == h/cw || check_collision(nx2, ny2, snake_arrey_player_two) || check_collision(nx2, ny2, snake_array))
		{
			//restart game
			clearInterval(game_loop);
			ctx.fillStyle = "black";
			ctx.fillText("Game Over. Player 1 wins!!", 10, 50);
			ctx.fill();
		}
		
		//Player 1 eats food

		
		//Player 2 eats food
		var tail, tail2, eaten;
		if (player) {
			if(nx2 == food.x && ny2 == food.y) {
				var tail2 = {x: nx2, y: ny2};
				score++;
				eaten = true;
			} else {
				tail2 = snake_arrey_player_two.pop();
				tail2.x = nx2; tail2.y = ny2;
			}
			tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		} else {
			tail2 = snake_arrey_player_two.pop();
			tail2.x = nx2; tail2.y = ny2;
			if(nx == food.x && ny == food.y) {
				var tail = {x: nx, y: ny};
				score++;
				eaten = true;
			}
			else
			{
				tail = snake_array.pop(); //pops out the last cell
				tail.x = nx; tail.y = ny;
			}
		}
				
		snake_array.unshift(tail);
		snake_arrey_player_two.unshift(tail2);
		
		if (eaten) {
			socket.emit('updateStatus', { roomId: roomIdClient, player: player, status: 'food', player1Snake: snake_array, player2Snake: snake_arrey_player_two});
		}
		
		for (var i = 0; i < snake_arrey_player_two.length; i++) {
			var c = snake_arrey_player_two[i];
			paint_cell(c.x, c.y, "red");
		}
		
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
			paint_cell(c.x, c.y, "blue");
		}
		
		paint_cell(food.x, food.y, "black");
		var score_text = "Score: " + score;
		ctx.fillText(score_text, 5, h-5);
	}
	
	function startGame() {
		$('.status').text(countDown).css({fontSize: '50px', color: player ? 'Blue' : 'Red'});
		setTimeout(function () {
			countDown--;
			$('.status').text(countDown);
			if (countDown == 0) {
				$('.status').text('Go...');
				setTimeout(function () {
					$('.main-screen').hide();
					$("#canvas").show();
					init();
				}, 1000);
				
			} else {
				startGame();
			}
		}, 1000);
	};
	
	//Lets first create a generic function to paint cells
	function paint_cell(x, y, color)
	{
		ctx.fillStyle = color;
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
		ctx.fillStyle = "black";
	}
	
	function check_collision(x, y, array)
	{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	
	function update(data) {
		snake_array = data.player1Snake;
		snake_arrey_player_two = data.player2Snake;
		
		if (data.status == 'start') {
			food = data.food;
			if (data.player1 == facebookId) {
				player = 0;
			} else {
				player = 1;
			}
			
			startGame()
			
		}
		
	
		if (data.status == 'update') {
			if (data.player != player) {
				if (data.player) {
					d2 = data.dir;
				} else {
					d = data.dir;
				}
			}
		}
		
		if (data.status == 'food') {
			food = data.food;
		}
	}
	
	function updateStatus(direction) {
		if (player) {
			d2 = direction;
		} else {
			d = direction;
		}
		
		socket.emit('updateStatus', { roomId: roomIdClient, player: player, dir: direction, status: 'move', player1Snake: snake_array, player2Snake: snake_arrey_player_two});
	}
	
$(document).ready(function(){		
	var canvas = $("#canvas")[0];
		ctx = canvas.getContext("2d"),
		w = $("#canvas").width(),
		h = $("#canvas").height();
	$("#canvas").hide();
	  socket.on("connect", function() {        
		$('a.start-game').click(function () {
			$(this).hide();
			$('p.status').text('Waiting for second player...');
		
			socket.emit("handshake", facebookId);
				
			socket.on("pair", function(roomId) {
				roomIdClient = roomId;
				socket.emit("join", {roomId: roomId, clientId: facebookId} );
			});
			
			socket.on("status", function(data) {
				if (data.package > package) {
					update(data);
				}
			});
		});
      });
    	

	
	$(document).keydown(function(e){
		var key = e.which;
		var status = '';
		if (player) {
			status = d2;
		} else {
			status = d;
		}
		
		if(key == "37" && status != "right") updateStatus("left");
		else if(key == "38" && status != "down") updateStatus("up");
		else if(key == "39" && status != "left") updateStatus("right");
		else if(key == "40" && status != "up") updateStatus("down");	
	});
})
}(jQuery));