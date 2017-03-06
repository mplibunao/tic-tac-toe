'use strict';

/*	@ Global variables
	@ Game object contains the details about the game
		@ turnNumber - current turn
		@ playerTurn - whose turn is it (1 or 2)
		@ numberOfPlayers - whether one player or two player
		@ roundNumber - how many rounds/games have you played
		@ grid property contains an object of each grid number from 0 - 8 and whether it is already marked by an X, O or is empty
	@ playerOne and playerTwo object contains the details about the players
		@ role - determines whether player plays the X or O
		@ score - determines the score of that particular player
		@ name - display name of player or ai
		
*/	

var game = {
	'turnNumber': 0,
	'playerTurn': 2,
	//'numberOfPlayers'
	'roundNumber': 0,
	'grid': {
		'0': 'empty',
		'1': 'empty',
		'2': 'empty',
		'3': 'empty',
		'4': 'empty',
		'5': 'empty',
		'6': 'empty',
		'7': 'empty',
		'8': 'empty'
	}

};

var playerOne = {
	'score': 0,
	'name': 'Player 1'
	//role
};

var playerTwo = {
	'score': 0,
	'name': 'Player 2'
};


/*	@ Reset the board and all variables and start a new game
	@ Reset all the grid slots in game.grid
	@ Remove all markings in the grid (class="move")
	@ Clear results-display and status display
	@ Reset game.turnNumber to 0
*/
var newGame = function(){
	for (var i=0; i<9; i++){
		game.grid[i] = 'empty';
	}
	$('.move').remove();
	$('.results-display').html('Tic Tac Toe');
	$('#status-display').html('');
	game.turnNumber = 0;
	updateScoreBoard();
	nextTurn();
}

/*	@ increment turn number and display it in #turn-number
	@ change playerturn and display it

*/
var nextTurn = function(){
	console.log('starting next turn');
	game.turnNumber++;
	$('#turn-number').html('Turn # '+game.turnNumber);
	if (game.playerTurn === 1){
		game.playerTurn = 2;
		$('.turnIndicator').html(playerTwo.name +"'s Turn");
	} else{
		game.playerTurn = 1;
		$('.turnIndicator').html(playerOne.name +"'s Turn");
	}
}


/*	@ Wraps the parameters into a jQuery object and adds an effect to it
	@ If a current animation is already running, then simply exit the function and return;
	@ Id is the name of the object including the . for classes and # for ids
	@ effect is the name of the effect
	@ number is the number of times the effect will be used
	@ timing is the duration of the effect
*/
var addEffect = function(id, effect, number, timing){
	var jqueryObject = $(id);
	if (jqueryObject.is(':animated')){
		//do nothing and end function
		return;
	}
	jqueryObject.effect(effect, {times:number}, timing);
}

/*	@ Uses array every function to check for all the values of game.grid
	@ Since game.grid is an object and the every function is an array function transfer the values of game.grid to gridArray
	@ Returns true if all grid boxes have been marked, and true if some or all of the grids are still empty
	//if all is empty = false
	//if all x or o = true
	//if mix = false
*/
var checkForTies = function(){
	var gridArray = [];
	for (var i=0; i<9; i++){
		gridArray[i] = game.grid[i];
	}

	return gridArray.every(function(current){
		return current !== 'empty';
	});
}


/*	@ Checks if a combination of winning moves has been made in the grid
	@ winningCombinations is an array of arrays containing a combination of the grid ids needed to be occupied to win
	@ Uses filter to traverse through the array and compares with the game.grid object if any combination is present
	@ Use pulsate effect when a combination is found and return the array
	@ winningMove is the array returned; Array contains an array when a winning combination is found; Else, return an empty array
	@ If all the grid boxes have already been marked and still no winner emerges, then pulsate all the grids and return string tie
*/
var checkForWinner = function(marker){
	var winningCombinations = [];
	winningCombinations.push([0,4,8]);
	winningCombinations.push([2,4,6]);
	winningCombinations.push([1,4,7]);
	winningCombinations.push([3,4,5]);
	winningCombinations.push([0,1,2]);
	winningCombinations.push([0,3,6]);
	winningCombinations.push([6,7,8]);
	winningCombinations.push([2,5,8]);



	var winningMove = winningCombinations.filter(function(current){
		if (game.grid[current[0]] === marker && game.grid[current[1]] === marker && game.grid[current[2]] === marker){
			current.map(function(id){
				addEffect('#'+id, 'pulsate', 3, 1200);
			});
			return current;
		}
	});

	var isTie = checkForTies();
	if (isTie === true){
		for (var i=0; i<9; i++){
			addEffect('#'+i, 'pulsate', 3, 1200);
		}
		return 'tie';
	}
	return winningMove;
}

/*	@ Updates scoreboard header and score

*/
var updateScoreBoard = function(){
	$('#scoreboard-header').html(playerOne.name +" vs "+ playerTwo.name);
	$('#player1-score').html(playerOne.score);
	$('#score-divider').html('-');
	$('#player2-score').html(playerTwo.score);
}

//	@ Changes the modal interface to X or O
var xoInterface = function(){
	//fadeout and remove elements
	$('.settings').children().slideUp()
	.delay(400).closest('.settings').find('.settings-button').remove();

	//set new interface
	setTimeout(function(){
		$('.settings-text').html('Would you like to be X or O');
		var xButton = '<a href="#" class="settings-button x">X</a>';
		var oButton = '<a href="#" class="settings-button o">O</a>';
		var backButton = '<a href="#" class="settings-back"><i class="fa fa-chevron-left" aria-hidden="true"></i> Go Back</a>';
		$('.settings').append($(xButton).hide())
		.append($(oButton).hide())
		.append($(backButton).hide())
		.children().slideDown();
	}, 600);
	

}
//	@ Changes modal interface to player1/2
var playerNumInterface = function(){
	$('.settings').children().slideUp()
	.delay(400).closest('.settings').find('.settings-button, .settings-back').remove();

	setTimeout(function(){
		$('.settings-text').html('How do you want to play?');
		var onePlayerButton = '<a href="#" class="settings-button one-player"><i class="fa fa-user-o" aria-hidden="true"></i> One Player</a>';
		var twoPlayerButton = '<a href="#" class="settings-button two-player"><i class="fa fa-user-o" aria-hidden="true"></i><i class="fa fa-user-o" aria-hidden="true"></i> Two Player</a>';

		$('.settings').append($(onePlayerButton).hide())
		.append($(twoPlayerButton).hide())
		.children().slideDown();
	}, 600);
}

/*	@ Style the grid with borders
	@ Use id as selector for the grids || For loop and switch to iterate through each grid block
*/
var createGrid = function(){
	var borderStyle = "3px solid #000";

	var addTopBorder = function(id){
		$('#'+id).css('border-top', borderStyle);
	}

	var addRightBorder = function(id){
		$('#'+id).css('border-right', borderStyle);
	}

	var addLeftBorder = function(id){
		$('#'+id).css('border-left', borderStyle);
	}

	var addBottomBorder = function(id){
		$('#'+id).css('border-bottom', borderStyle);
	}

	for (var i=0; i<9; i++){
		switch(i){
			case 0:
				addRightBorder(i);
				addBottomBorder(i);
				break;
			case 1:
				addLeftBorder(i);
				addBottomBorder(i);
				addRightBorder(i);
				break;
			case 2:
				addLeftBorder(i);
				addBottomBorder(i);
				break;
			case 3:
				addTopBorder(i);
				addRightBorder(i);
				addBottomBorder(i);
				break;
			case 4:
				$('#'+i).css('border', borderStyle);
				break;
			case 5:
				addTopBorder(i);
				addLeftBorder(i);
				addBottomBorder(i);
				break;
			case 6:
				addTopBorder(i);
				addRightBorder(i);
				break;
			case 7:
				addTopBorder(i);
				addRightBorder(i);
				addLeftBorder(i);
				break;
			case 8:
				addTopBorder(i);
				addLeftBorder(i);
				break;
		}
	}
}


$(document).ready(function(){
	/*	@ Onload open settings modal and set interface for choosing how many players
	*/
	$('#new-game').modal("show");
	playerNumInterface();

	//	@ Event listener for clicking how many players, set player number and change interface to choose x or o
	$('.settings').on('click', '.one-player',function(){
		game.numberOfPlayers = 1;
		playerTwo.name = 'Computer'
		xoInterface();
	});

	$('.settings').on('click', '.two-player', function(){
		game.numberOfPlayers = 2;
		playerTwo.name = 'Player 2'
		xoInterface();
	});

	//	@ Event listener for back button in x or o interface
	$('.settings').on('click', '.settings-back', function(){
		playerNumInterface();
	});

	/*	@ Event listener for x or o button. Sets player one and player two roles
		@ Closes modal and creates grid
		@ Calls newGame
	*/
	$('.settings').on('click', '.x', function(){
		playerOne.role = 'x';
		playerTwo.role = 'o';
		$('#new-game').modal('hide');
		createGrid();
		playerOne.score = 0;
		playerTwo.score = 0;
		newGame();
	});

	$('.settings').on('click', '.o', function(){
		playerOne.role = 'o';
		playerTwo.role = 'x';
		$('#new-game').modal('hide');
		createGrid();
		playerOne.score = 0;
		playerTwo.score = 0;
		newGame();
	});

	/*	@ Event Listener for clicking on the grid
		@ Checks if that grid is already marked by referencing to game.grid[id]
		@ Marks the grid if still free and changes the corresponding property in game.grid
		@ Calls winningMove to check if a winning combination has been made every after move
		@ Display the winner if a winner has emerged or start next turn if none yet
		@ If a grid is already marked, display error in upper right else clear the html of that element
		@ Update score when a winner has been declared and start a new game after animation
	*/
	$('.grid').on('click', function(){
		if (game.grid[this.id] === 'empty'){
			$('#status-display').html('');
			if (game.playerTurn === 1){
				$(this).html('<h1 class="move">'+playerOne.role.toUpperCase()+'</h1>');
				game.grid[this.id] = playerOne.role;
				var winningMove = checkForWinner(playerOne.role);
				if (Array.isArray(winningMove[0]) ===true){
					console.log('we have a winner');
					$('.results-display').html(playerOne.name +" Wins!");
					playerOne.score++;
					updateScoreBoard();
					addEffect('.results-display', 'pulsate', 3, 1200);
					setTimeout(function(){
						newGame();
					}, 1500);
				} else if (winningMove === 'tie'){
					$('.results-display').html('It\'s a tie!');
					addEffect('.results-display', 'pulsate', 3, 1200);
					//ADD NEW GAME
					setTimeout(function(){
						newGame();
					}, 1500);
				} else{
					console.log('keep playing');
					nextTurn();	
				}
			} else{
				$(this).html('<h1 class="move">'+playerTwo.role.toUpperCase()+'</h1>');
				game.grid[this.id] = playerTwo.role;
				var winningMove = checkForWinner(playerTwo.role);
				if (Array.isArray(winningMove[0]) ===true){
					console.log('we have a winner');
					$('.results-display').html(playerTwo.name +" Wins!");
					playerTwo.score++;
					updateScoreBoard();
					addEffect('.results-display', 'pulsate', 3, 1200);
					setTimeout(function(){
						newGame();
					}, 1500);
				} else if (winningMove === 'tie'){
					$('.results-display').html('It\'s a tie!');
					addEffect('.results-display', 'pulsate', 3, 1200);
					setTimeout(function(){
						newGame();
					}, 1500);
				} else{
					console.log('keep playing');
					nextTurn();	
				}
			}
		} else{
			$('#status-display').html('Grid box already marked with ' + game.grid[this.id].toUpperCase());
		}
		

	})


});