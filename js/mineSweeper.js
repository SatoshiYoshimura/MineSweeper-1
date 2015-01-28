;(function($) {

	var mineSweeper = (function() {
		var fieldOption = {
			cols: 		5,	// 縦
			rows: 		5,	// 横
			numMines: 	5	// 地雷の個数
		},

		cellState = {
			blank: 		'blank',	// 初期
			opend: 		'opend',	// 開いた
			checked: 	'checked',	// 地雷チェック
			mine: 		'mine'		// 地雷
		},

		cellImage = {
			blank: 		'./images/blank.png',
			opened_0: 	'./images/opened_0.png',
			opened_1: 	'./images/opened_1.png',
			opened_2: 	'./images/opened_2.png',
			opened_3: 	'./images/opened_3.png',
			opened_4: 	'./images/opened_4.png',
			opened_5: 	'./images/opened_5.png',
			opened_6: 	'./images/opened_6.png',
			opened_7: 	'./images/opened_7.png',
			opened_8: 	'./images/opened_8.png',
			checked: 	'./images/checked.png',
			mine: 		'./images/mine.png',
		}

		game = {
			init: function() {
				console.log('called init');

				// 各変数の初期化

				// TODO: colとrow は LEVEL3からユーザが定義できるので初期化の時に変えられるように

				// フィールド関連
				this.cols = fieldOption.cols;
				this.rows = fieldOption.rows;
				this.numCells = this.cols * this.rows;
				this.numMines = fieldOption.numMines;

				// クリアに関わるもの
				this.leftCells = this.cols * this.rows - this.numMines;	// 残りのマス 地雷以外
				this.leftMines = this.numMines;							// 残りの地雷

				this.createField();
			},

			createField: function() {
				console.log('called createField');

				// フィールドの見出し追加
				$("#field").append("<tr id='thead'></tr>");
				$("#thead").append("<th>#</th>");				// 一番左の空白
				for(var col = 0; col < this.cols; col++) {
					$("#thead").append("<th>"+col+"</th>");	
				}

				// フィールドの行追加
				for(var row = 0; row < this.cols; row++) {
					$("#field").append("<tr id='tr"+row+"'></tr>");
					$("#tr"+row).append("<td>"+row+"</td>");
					for(var col = 0; col < this.cols; col++) {
						$("#tr"+row).append("<td class='blank' id='cell_"+row+"_"+col+"'><img src='"+cellImage.blank+"'></td>");
					}
				}

				// 地雷をセット
				this.setMines();	
			},

			setMines: function() {
				console.log('called setMines');
				for(var i = 0; i < this.numMines; i++) {
					
					var val = Math.floor(Math.random() * this.numCells);
					var row_id = Math.floor(val / this.rows);
					var col_id = val % this.rows;
					var cell_id = "#cell_" + row_id + "_" + col_id;
					
					if($(cell_id).hasClass('mine')) {
						i--;
						continue;
					} else {
						$(cell_id).addClass('mine');
						console.log(cell_id);
					}

				}
			},

		}


		return {
			game: game
		};
	})();


	$(function() {

		mineSweeper.game.init();

	});

}.call(this, jQuery));