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
					}

				}
			},

			openCell: function(cell) {
				console.log("called openCell");

				if(this.checkMine(cell)) {
					cell.html("<img src='"+cellImage.mine+"'>");
					// game over
					this.endGame(false);
				} else {
					cell.html("<img src='"+this.checkAroundMine(cell)+"'>");
					cell.removeClass("blank");
	
					if(--this.leftCells == 0) {
						this.endGame(true);
					}
				}
			},

			checkCell: function(cell) {
				console.log("called checkCell");
				
				cell.html("<img src='"+cellImage.checked+"'>");
				cell.removeClass("blank")
					.addClass("checked");

				if(this.checkMine(cell)) {
					if(--this.leftMines == 0) {
						this.endGame(true);
					}

				}

			},

			checkMine: function(cell) {
				return cell.hasClass('mine');
			},

			checkAroundMine: function(cell) {
				var splitId = cell.attr("id").split('_');
				var row_id = parseInt(splitId[1]);
				var col_id = parseInt(splitId[2]);

				var mineCount = 0;	// 周りの地雷の総数


				// 周り8マス+自分1マス（余計）を探索
				for(var i = row_id - 1; i < row_id + 2; i++) {
					
					// 指定されたフィールドからはみ出したらcontinue
					if(i < 0 || i > this.rows) {
						continue;
					}

					for(var j = col_id - 1; j < col_id + 2; j++) {

						// 指定されたフィールドからはみ出したらcontinue
						if(j < 0 || j > this.cols) {
							continue;
						}

						// mine クラス持ちなら地雷の総数をインクリメント
						var cell_id = "#cell_" + i + "_" + j;
						if($(cell_id).hasClass('mine')) {
							mineCount++;
						}
					}
				}
				
				return eval("cellImage.opened_"+mineCount);
			},

			endGame: function(flag) {
				if(flag) {
					alert("おめでとー！");
				} else {
					alert("どんまい！");
				}

				$(document).off("click", ".blank");
				$(document).off("contextmenu", ".blank");
			}

		}


		return {
			game: game
		};
	})();


	$(function() {

		// ゲームの準備
		mineSweeper.game.init();

		// マスをクリックした際のイベント追加
		$(document).on("click", ".blank", function() {
			mineSweeper.game.openCell($(this));
		});

		$(document).on("contextmenu", ".blank", function() {
			mineSweeper.game.checkCell($(this));
			return false;
		});

	});

}.call(this, jQuery));