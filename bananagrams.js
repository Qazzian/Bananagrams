bg = {
	Letters : {  // format char:count,
		A:13, B:3, C:3, D:6, E:18, F:3, G:4, H:3, I:12, J:2, K:2, L:5, M:3,
		N:8, O:11, P:3, Q:2, R:9, S:6, T:9, U:6, V:3, W:3, X:2, Y:3, Z:2
	},

	debug: true,

/*
Mouse X: <span id="bg_mouse_x">0</span>
		Mouse Y: <span id="bg_mouse_y">0</span>
		Tile Left: <span id="bg_tile_left">0</span>
		Tile Top: <span id="bg_tile_top">0</span>
*/

	printDebug : function(){
		// print mouse values
		$('#bg_mouse_x').html(bg.Game.mouse_x);
		$('#bg_mouse_y').html(bg.Game.mouse_y);
		// print tile values
		$('#bg_tile_left').html(bg.Game.selected.attr('offsetLeft'));
		$('#bg_tile_top').html(bg.Game.selected.attr('offsetTop'));
		// Alternativly get a working firefox & firebug!!!!!!
	},

	/* Array of Image constants */
	Constants : {
		tile_width: 40,
		tile_height: 40
	},

	next_tile_id : 1,

	// How many tiles does the player start with
	Start_count : {
		1: 30,
		2: 21,
		6: 18
	},

	DraggableOptions : {
		revert:'invalid',
	},

	Tile : function(character){
		this.id = bg.next_tile_id;
		bg.next_tile_id ++;
		this.char = character;
		this.next_to = {
			n: null, s: null, e: null, w: null
		};
		this.dom_elmt = null;
		this.html = '';

		this.move = bg.move_tile;
		this.place = bg.place_tile;
		this.connect = bg.connect_tiles;
		this.disconnect = bg.disconnect_tiles;
		this.getHtml = bg.get_tile_html;
		this.getDomElmt = bg.get_tile_element;
		this.getCenter = bg.getTileCentre;
		this.getParent = bg.getTileParent; // TODO: Change to getContainor. return a bg.Board object
		this.getContainer = bg.getTileContainer;
		this.log = function(){
			return ["ID: "+this.id, "char: " + this.char] ;
		}
	},

	move_tile : function (){},
	place_tile : function (){},
	connect_tiles: function(other_tile, direction){},
	disconnect_tiles: function (direction){},
	get_tile_html: function(tile)
	{
		this.html = '<div id="tile_' + this.id + '" class="bg_tile">' + this.char + '</div>';
		return this.html;
	},
	get_tile_element : function(){
		if (!this.dom_elmt)
		{
			this.dom_elmt = $(this.getHtml());
			this.dom_elmt.draggable(bg.DraggableOptions);
			$.data(this.dom_elmt[0], 'bg_tile', this);
		}
		return this.dom_elmt;
	},
	getTileCentre : function(){
		var pos = new Array();
		var dom_elmt = this.getDomElmt();
		var left = dom_elmt.attr('offsetLeft');
		var top = dom_elmt.attr('offsetTop');
		pos[0] = left - (dom_elmt.attr('offsetWidth')/2);
		pos[1] = top - (dom_elmt.attr('offsetHeight')/2);
		return pos;
	},
	getTileParent : function(type){
		var board_elmt = this.dom_elmt.parents('.bg_board')[0];
		return $(board_elmt).data('bg_board');
	},
	getTileContainer: function(type){
		var jobj = this.dom_elmt.parents('.bg_board');
		if (type == 'jquery')
			return jobj;
		else if (type == 'dom')
			return jobj[0];
		else
			return $.data(jobj[0], 'bg_board');
	},

	Player : {
		name: '',
		in_hand: 0,
		played: 0,
	},

	Bag : {
		chars: [],
		is_empty : true,
		init : function() {
			if (this.chars.length > 0) {
				delete this.chars;
				this.chars = [];
			}
			for (var l in bg.Letters) {
				//alert ("letter: "+l+"\ncount: "+bg.Letters[l]);
				for (var i = bg.Letters[l]; i > 0; i--) {
					this.chars.push(l);
				}
			}
			if (this.chars.length > 0) this.is_empty = false;
		},
		/* Return a random tile from the bag */
		getTile : function(){
			if (this.chars.length <= 0){
				this.is_empty = true;
				throw ("Bag is Empty");
			}
			var i = Math.randomInt(this.chars.length - 1);
			var char = this.chars.splice(i, 1);
			var tile = new bg.Tile(char);
			log("Created tile: ", tile.log());
			return tile;
		},
		addTile : function(tile){}
	},

	Board : function(){
		this.width;
		this.height;
		this.dom_elmt = null;
		this.tiles = []; // array of jQuery Objects or Tile objects?

		this.init = function(selector){
			this.dom_elmt = $(selector);
			this.dom_elmt.droppable({ drop : this.dropTile });
			$.data(this.dom_elmt[0], 'bg_board', this);
			this.setupBackground();
		};
		/* Tidy up the size */
		this.setupBackground = function(){
			var width = this.dom_elmt.attr('offsetWidth');
			width -= width % bg.Constants.tile_width;
			this.dom_elmt.css('width', width);
			var height = this.dom_elmt.attr('offsetHeight');
			height -= height % bg.Constants.tile_height;
			this.dom_elmt.css('height', height);
		};
		/* Move the board (actually, move the tiles in the opposite direction).
		 * Called by the key press event handler. */
		this.move = function(direction){
			var dirs = { n:(0,1), ne:(-1,1), e:(-1,0), se:(-1,-1), s:(0,-1), sw:(1,-1), w:(1,0), nw:(1,1) };
			var change;
			/* for all tiles inside this board
TODO:
			*/
		};
		this.dropTile = function(event, ui){
			// 'this' is now the drop targets Dom element
			var this_board = $.data(this, 'bg_board');  // Get the bg.Board object.
			ui.draggable.each(function(i){
				var bg_tile = $.data(this, 'bg_tile');
				var tile_parent = bg_tile.getParent()
				if (this_board.dom_elmt[0].id != tile_parent.dom_elmt[0].id)
				{
					$().move(bg_tile.dom_elmt, this_board.dom_elmt);
					var old_board = tile_parent.dom_elmt.data('bg_board');
					old_board.removeTile(bg_tile);
				}
				this_board.positionTile(bg_tile);
				this_board.tiles.push(bg_tile);
			});
		};
		/* Add a tile to this board. tile should be a bg.Tile object. */
		this.addTile = function(bg_tile){
			this.tiles.push(bg_tile);
			this.dom_elmt.append(bg_tile.getDomElmt());
		};
		this.moveTile = function(bg_tile){
			this.positionTile(bg_tile);
		};
		/* Set the correct position of the tile, snapping it to the grid, ensuring that it's not on top of another tile */
		this.positionTile = function(bg_tile){
			var t_left = bg_tile.dom_elmt.attr('offsetLeft');
			var b_left = this.dom_elmt.attr('offsetLeft');
			var d_left = (t_left - b_left) % bg.Constants.tile_width;
			//log('t_left: '+t_left+' b_left: '+b_left+' d_left: '+d_left);
			var left_change;
			if ( d_left == 0 ){
				left_change = 0;
			}
			else if ( d_left - (bg.Constants.tile_width / 2) < 0 ) {
				left_change = -d_left;
			}
			else {
				left_change = bg.Constants.tile_width - d_left;
			}

			var t_top = bg_tile.dom_elmt.attr('offsetTop');
			var b_top = this.dom_elmt.attr('offsetTop');
			var d_top = (t_top - b_top) % bg.Constants.tile_height;
			//log('t_top: '+t_top+' b_top: '+b_top+' d_top: '+d_top);
			var top_change;
			if ( d_top == 0 ){
				top_change = 0;
			}
			else if ( d_top - (bg.Constants.tile_height / 2) < 0 ) {
				top_change = -d_top;
			}
			else {
				top_change = bg.Constants.tile_height - d_top;
			}
			bg_tile.dom_elmt.css("left", (t_left + left_change) + 'px');
			bg_tile.dom_elmt.css("top", (t_top + top_change) + 'px');
		};
		this.removeTile = function(bg_tile){
			if (bg_tile.dom_elmt[0].parentNode.id == this.dom_elmt[0].id) {
					bg_tile.dom_elmt.remove();
			}
			var tindex = this.indexOfTile(bg_tile.id);
			if (0 <= tindex) {
				this.tiles.splice(tindex, 1);
			}
			return bg_tile;
		};
		/* find the index of the tile with the given id */
		this.indexOfTile = function(bg_tile_id){
			for ( var i = 0, length = this.tiles.length; i < length; i++ ) {
				if ( this.tiles[i].id == bg_tile_id) {
					return i;
				}
			}
			return -1;
		};
		/* Log details about this board. */
		this.log = function(){
			var log_str = "Tiles: ";
			var first = true;
			for (var i in this.tiles)
			{
				if (!first) log_str += ', ';
				first = false;
				log_str += i + ': ' + this.tiles[i].char;
			}
			bg.log(log_str);
		};
	},

	Game : {
		player : null,         // This player
		other_players : [],    // List names and stats of the other players
		bag : null,            // Array of tiles left in the bag. Need to be shuffled.
		played : null,         // Where the player places tiles to make words.
		hand : null,           // Where the player get the tiles from.
		selected : null,       // The currently selected tile.
		is_cafe : false,       // Cafe version, stop when hand is empty. i.e. don't peel.

		mouse_x:null,
		mouse_y:null,

		split : function (){}, // Start the game.
		peel : function (){},  // Give each player a letter
		dump : function (letter, player){}, // Place a letter in the bag, remove three.
		// Give the player a number of tiles.
		init : function()
		{
			this.played = new bg.Board();
			this.played.init('div#bg_played');
			this.hand = new bg.Board();
			this.hand.init('div#bg_hand');
			this.deal(21)
			// events
		},

		deal : function (number)
		{
			var tiles = [];
			try
			{
				for (var i = 0; i<number; i++)
				{
					this.hand.addTile(bg.Bag.getTile());
				}
			}
			catch(e){
				window.log(e);
			}
			//alert ("Dealt " + tiles.length + " tiles.");
			return tiles;
		},
		getBoardAtPos : function(x, y)
		{
			var boards = [bg.Game.hand, bg.Game.played];
			for (var b in boards)
			{
				var dom_elmt = boards[b].dom_elmt
				var left = parseInt(dom_elmt.attr('offsetLeft'));
				var top = parseInt(dom_elmt.attr('offsetTop'));
				var right = left + parseInt(dom_elmt.attr('offsetWidth'));
				var bottom = top + parseInt(dom_elmt.attr('offsetHeight'));
				if (left <= x && x <= right && top <= y && y <= bottom)
				{
					return dom_elmt;
				}
			}
		},
		getBoardFromId: function(id)
		{
			// Get the bg.Game.board from the id
			if (id == 'bg_hand') return bg.Game.hand;
			else if (id == 'bg_played') return bg.Game.played;
			else return null;
		}
	},

	init : function (){
		/*
		 * create & shuffle bag.
		 * deal out correct number of tiles to each player.
		 * display the hand.
		 */
		 bg.Bag.init();
		 bg.Game.init();
	},

	test : function (){
		// create a hand
	}

};

$(document).ready(
	function()
	{
		bg.init();
		$('.bg_debug').css('display', (bg.debug ? 'block' : 'none'));
	}
);