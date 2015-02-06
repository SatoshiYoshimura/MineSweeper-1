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

				// マスのイベントの初期化
				this.clearCellEvent();
				this.setCellEvent();

				// 各変数の初期化

				// フィールド関連
				this.cols = parseInt($("#customCol").val(), 10);
				this.rows = parseInt($("#customRow").val(), 10);
				this.numCells = this.cols * this.rows;
				this.numMines = parseInt($("#customMine").val(), 10);

				// クリアに関わるもの
				this.leftCells = this.cols * this.rows - this.numMines;	// 残りのマス 地雷以外

				this.createField();
			},

			createField: function() {
				console.log('called createField');

				// テーブル初期化
				$("#field").empty();

				// フィールドの見出し追加
				$("#field").append("<tr id='thead'></tr>");
				$("#thead").append("<th>#</th>");				// 一番左の空白
				for(var col = 0; col < this.cols; col++) {
					$("#thead").append("<th>"+col+"</th>");	
				}

				// フィールドの行追加
				for(var row = 0; row < this.rows; row++) {
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
					var row_id = Math.floor(val / this.cols);
					var col_id = val % this.cols;
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

			openCell: function(cell) {
				console.log("called openCell");

				if(this.checkMine(cell)) {
					cell.html("<img src='"+cellImage.mine+"'>");
					// game over
					this.endGame(false);
				} else {
					this.checkAroundMine(cell);
				}
			},

			checkCell: function(cell) {
				console.log("called checkCell");
				
				cell.html("<img src='"+cellImage.checked+"'>");
				cell.removeClass("blank")
					.addClass("checked");

			},

			uncheckCell: function(cell) {
				console.log("called uncheckCell");

				cell.html("<img src='"+cellImage.blank+"'>");
				cell.removeClass("checked")
					.addClass("blank");
			},

			checkMine: function(cell) {
				return cell.hasClass('mine');
			},

			checkAroundMine: function(cell) {
				console.dir(cell);
				var splitId = cell.attr("id").split('_');
				var row_id = parseInt(splitId[1], 10);
				var col_id = parseInt(splitId[2], 10);

				var mineCount = 0;	// 周りの地雷の総数


				// 周り8マス+自分1マス（余計）を探索
				for(var i = row_id - 1; i < row_id + 2; i++) {
					
					// 指定されたフィールド行内なら実行
					if(i > 0 || i <= this.rows) {
						
						for(var j = col_id - 1; j < col_id + 2; j++) {

							// 指定されたフィールド列なら実行
							if(j > 0 || j <= this.cols) {
								
								// mine クラス持ちなら地雷の総数をインクリメント
								var cell_id = "#cell_" + i + "_" + j;
								if($(cell_id).hasClass('mine')) {
									mineCount++;
								}

							}
						}

					}
				}
				// 探索終わり

				// マスを開ける
				cell.html("<img src='"+eval("cellImage.opened_"+mineCount)+"'>");
				cell.removeClass("blank");

				if(--this.leftCells === 0) {
					this.endGame(true);
				}
				
				console.log("minecount: "+mineCount);


				// 再帰による探索
				if(mineCount === 0) {
					console.log("loop");
					// 周り8マス+自分1マス（余計）を探索
					for(var i = row_id - 1; i < row_id + 2; i++) {
						
						// 指定されたフィールド行内なら実行
						if(i > 0 || i <= this.rows) {

							for(var j = col_id - 1; j < col_id + 2; j++) {

								// 指定されたフィールド列なら実行
								if(j > 0 || j <= this.cols) {
									
									// 指定したマスに地雷がなくまだオープンされていなければ再帰
									var cell_id = "#cell_" + i + "_" + j;
									if($(cell_id).hasClass('mine') === false && $(cell_id).hasClass('blank') === true) {
										console.log(cell_id);
										this.checkAroundMine($(cell_id));
									}
								}
							}
						}
					}
				} else {
					return;
				}
				// --
				
			},

			endGame: function(flag) {
				if(flag) {
					alert("おめでとー！");
				} else {
					alert("どんまい！");
				}

				this.clearCellEvent();
			},

			customSelectMineList: function() {
				var customCol = parseInt($("#customCol").val());
				var customRow = parseInt($("#customRow").val());

				var customMineNum = customCol * customRow;

				$("#customMine").empty();

				for(var i = 0; i < customMineNum; i++) {
					$("#customMine").append("<option value='"+i+"'>"+i+"</option>");
				}

			},

			clearCellEvent: function() {
				// マスをクリックした際のイベント削除
				$(document).off("click", ".blank");

				$(document).off("contextmenu", ".blank");

				$(document).off("contextmenu", ".checked");
			},

			setCellEvent: function() {
				// マスをクリックした際のイベント追加
				$(document).on("click", ".blank", function() {
					mineSweeper.game.openCell($(this));
				});

				$(document).on("contextmenu", ".blank", function() {
					mineSweeper.game.checkCell($(this));
					return false;
				});

				$(document).on("contextmenu", ".checked", function() {
					mineSweeper.game.uncheckCell($(this));
					return false;
				});
			},

		}


		return {
			game: game
		};
	})();


	$(function() {

		// ゲームの準備
		//mineSweeper.game.init();

		$(document).on("change", "#customCol", function() {
			mineSweeper.game.customSelectMineList();
		});

		$(document).on("change", "#customRow", function() {
			mineSweeper.game.customSelectMineList();
		});

		$(document).on("click", "#start", function() {
			mineSweeper.game.init();
		});

	});

}.call(this, jQuery));