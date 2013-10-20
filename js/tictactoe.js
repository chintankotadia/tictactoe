(function($) {
	var _init = [];

	$.tictactoe = {
        playerOne  : 'x',
		playerTwo  : 'o',
		domMatrix  : new Array(3),
		hasWin     : false,

		init: function(f) {
			if (f) {
				_init.push(f);
			}
			else {
				$.each(_init, function(key, f) {
					f();
				});
			}
		},

		setMatrix: function() {
			$.each($.tictactoe.domMatrix, function(key, dom) {
				$.tictactoe.domMatrix[key] = new Array(3);
			});

			$.each($.tictactoe.domMatrix, function(key, dom) {
				$.each($.tictactoe.domMatrix[key], function(jkey, jdom) {
					$.tictactoe.domMatrix[key][jkey] = 0;
				});
			});
		},

		setPlayer: function($this) {
			$.tictactoe.playerOne = $this.val();

			if ($this.val() === 'x')
				$.tictactoe.playerTwo = 'o';
			else
				$.tictactoe.playerTwo = 'x';
		},

		startMoves: function(row, col) {
			if ($.tictactoe.hasWin === true) {
				$.tictactoe.sendNotification('error', 'Game is already finished.');
				return false;
			}

			if ($.tictactoe.isBlank(row, col) === false) {
				$.tictactoe.sendNotification('error', 'This move is already taken');
				return;
			}

			$.tictactoe.setHtml(row,col, $.tictactoe.playerOne);
			$.tictactoe.domMatrix[row][col] = 1;

			if ($.tictactoe.checkWin(1) === true) {
				$.tictactoe.sendNotification('info', 'Congrats! You won the game.');
				return;
			}

			if ($.tictactoe.isOver() === true) {
				$.tictactoe.sendNotification('info', 'Good try! Game ended in a draw');
				return;
			}

			$.tictactoe.userMoves();

			if ($.tictactoe.checkWin(2) === true) {
				$.tictactoe.sendNotification('info', 'Oh snap! You lost the game.');
				return;
			}

			if ($.tictactoe.isOver() === true) {
				$.tictactoe.sendNotification('info', 'Good try! Game ended in a draw');
				return;
			}
		},

		isBlank: function (row, col) {
			if ( $.tictactoe.domMatrix[row][col] !== 0 )
				return false;
			else
				return true;
		},

		userMoves: function() {
			var bool = true;
			var computerMove = [
				[2, 2, 'computerMove1'],
				[2, 2, 'computerMove2'],
				[2, 2, 'computerMove3'],
				[2, 2, 'computerMove4'],
				[2, 1, 'computerMove1'],
				[2, 1, 'computerMove2'],
				[2, 1, 'computerMove3'],
				[2, 1, 'computerMove4'],
				[2, 1, 'computerOtherMoves'],
				[2, 1, 'computerRandomMoves']
			];

			$.each(computerMove, function(key, move) {
				if (move[2] !== 'computerRandomMoves') {
					bool = $.tictactoe[move[2]](move[0], move[1]);
					if (bool === true)
						return false;
				}
				else {
					$.tictactoe.computerRandomMoves(2);
				}
			});
		},

		checkWin: function(position) {
			winningCombination = [
				[0, 0, 0, 0, 1, 2],
				[1, 1, 1, 0, 1, 2],
				[2, 2, 2, 0, 1, 2],
				[0, 1, 2, 0, 0, 0],
				[0, 1, 2, 1, 1, 1],
				[0, 1, 2, 2, 2, 2],
				[0, 1, 2, 0, 1, 2],
				[0, 1, 2, 2, 1, 0]
			];

			$.each(winningCombination, function(key, combination) {
				if ($.tictactoe.domMatrix[combination[0]][combination[3]] === position && $.tictactoe.domMatrix[combination[1]][combination[4]] === position 
					&& $.tictactoe.domMatrix[combination[2]][combination[5]] === position)
					$.tictactoe.hasWin = true;
			});

			if($.tictactoe.hasWin === true)
				return true;
			else
				return false;
		},

		computerMove1: function(myPlace, urPlace) {
			var hasMoves = $.tictactoe.computerMovePart(myPlace, urPlace, 'i', 'j');

			if (hasMoves ===  true)
				return true;
			else
				return false;
		},

		computerMove2: function (myPlace, urPlace) {
			var hasMoves = $.tictactoe.computerMovePart(myPlace, urPlace, 'j', 'i');

			if (hasMoves ===  true)
				return true;
			else
				return false;
		},

		computerMove3: function (myPlace, urPlace) {
			var count  = 0;

			$.each($.tictactoe.domMatrix, function(key, value) {
				if ($.tictactoe.domMatrix[key][key] === urPlace)
				  count++;
			});

			if (count > 1) {
				$.each($.tictactoe.domMatrix.length, function(key, value) {
					if ($.tictactoe.isBlank(key, key) === true) {
						$.tictactoe.domMatrix[key][key] = myPlace;
						$.tictactoe.setHtml(key, key, $.tictactoe.playerTwo);
						return true;
					}					
				});
			}

			return false;
		},

		computerMove4: function (myPlace, urPlace) {
			var count1 = 0;
			var count2 = 2;

			$.each($.tictactoe.domMatrix, function(key, value) {
				if ($.tictactoe.domMatrix[key][count2] == urPlace)
					count1++;

				count2--;
			});

			if (count1 > 1) {
				var count2 = 2;
				$.each($.tictactoe.domMatrix, function(key, value) {
					if ($.tictactoe.isBlank(key, count2) === true) {
						$.tictactoe.domMatrix[key][count2] = myPlace;
						$.tictactoe.setHtml(key, count2, $.tictactoe.playerTwo);
						return true;
					}

					count2--;
				});
			}

			return false;
		},

		computerMovePart: function(myPlace, urPlace, myFirst, mySecond) {
			var count = 0;

			for (i = 0; i< $.tictactoe.domMatrix.length; i++) {
				for (j = 0; j < $.tictactoe.domMatrix[i].length; j++ ) {
					if ($.tictactoe.domMatrix[eval(myFirst)][eval(mySecond)] === urPlace )
						count++;
				}

				if (count > 1) {
					for (j = 0; j < $.tictactoe.domMatrix[i].length; j++ ) {
						if ($.tictactoe.isBlank(eval(myFirst), eval(mySecond)) === true) {
							$.tictactoe.domMatrix[eval(myFirst)][eval(mySecond)] = myPlace;
							$.tictactoe.setHtml(eval(myFirst), eval(mySecond), $.tictactoe.playerTwo);
							return true;
						}
					}
				}

				count = 0;
			}

			return false;
		},

		computerOtherMoves: function (myPlace, urPlace) {
			if ($.tictactoe.isBlank(1, 1) === true) {
				$.tictactoe.domMatrix[1][1] = myPlace;
				$.tictactoe.setHtml(1, 1, $.tictactoe.playerTwo);

				return true;
			}

			if ($.tictactoe.domMatrix[1][1] === urPlace) {	
				row = Math.floor(Math.random() * 2)  * 2;
				col =  Math.floor(Math.random() * 2) * 2;

				if ($.tictactoe.isBlank(row,col) === true) {
					$.tictactoe.domMatrix[row][col] = myPlace;
					$.tictactoe.setHtml(row, col, $.tictactoe.playerTwo);

					return true;
				}
			}

			return false;
		},

		computerRandomMoves: function(myPlace) {
			row = Math.floor(Math.random() * 3);
			col =  Math.floor(Math.random() * 3);

			while ($.tictactoe.isBlank(row, col) !== true) {
				row = Math.floor(Math.random() * 3);
				col =  Math.floor(Math.random() * 3);
			}

			$.tictactoe.domMatrix[row][col] = myPlace;
			$.tictactoe.setHtml(row,col,$.tictactoe.playerTwo);
		},

		setHtml: function (row, col, text) {
			var htmlField = {'00': 0 , '01': 1, '02': 2, '10': 3, '11': 4, '12': 5, '20': 6, '21': 7, '22': 8};

			$('li:eq(' + htmlField[row + '' + col] +')').text(text).addClass('select');
		},

		isOver: function () {
			for (i = 0; i < $.tictactoe.domMatrix.length; i++ ) {
				for (j = 0; j < $.tictactoe.domMatrix[i].length; j++ ) {
					if ($.tictactoe.domMatrix[i][j] !== 1 && $.tictactoe.domMatrix[i][j] !== 2)
						return false;
				}
			}

			return true;
		},

		sendNotification: function(type, message) {
			$('.notification').html($('#notificationTemplate').tmpl({type: type, message: message}));
			$('.notification').fadeIn();
			setTimeout(
				function() {
					$('.notification').click();
				},
				3000
			);
		},

		initGame: function() {
			var results = [];
			for (i = 0; i < 9; i++) {
				results.push(i);
			}
			$.tictactoe.hasWin = false;
			$.tictactoe.domMatrix = new Array(3);
			$('.game-container').html($('#tictactoeTemplate').tmpl({data:results}));
			$.tictactoe.setMatrix();
		}
	}
})(jQuery);

$(document).ready(function(){
	$.tictactoe.initGame();

	var position =[[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];

	$(document).on('click', '.game-container li', function() {
		$('[name=player]').attr('disabled', 'disabled');

        if (!$(this).hasClass('select'))
			$.tictactoe.startMoves(position[$(this).index()][0], position[$(this).index()][1]);
		else
			return false;	
	});

	$('[name="player"]').change(function() {
		$.tictactoe.setPlayer($(this));
	});

	$('[name="restart"]').on('click', function() {
		$.tictactoe.initGame();
	});

	$('.notification').on('click', function() {
		$(this).fadeOut();
	});
});
