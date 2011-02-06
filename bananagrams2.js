bg = {
	Letters : {  // format char:count,
		A:13, B:3, C:3, D:6, E:18, F:3, G:4, H:3, I:12, J:2, K:2, L:5, M:3,
		N:8, O:11, P:3, Q:2, R:9, S:6, T:9, U:6, V:3, W:3, X:2, Y:3, Z:2
	},

	debug: true,

	Constants : {
		tile_width: 40,
		tile_height: 40,
		tile_html_template: ''
	},

	next_tile_id : 1,

	// How many tiles does the player start with (players: tiles)
	Start_count : {
		1: 30,
		2: 21,
		6: 18
	},

	/* Create a tile object.
	 * Tiles can only be in the Hand or the Board.
	 * If on the Board then they should be attached to other tiles before the player can peal.
	 * character - The letter the tile represents.
	 * hand - The Hand object that the Tile should be added to.
	 * id - If the tile has been fetched from a server, the id will be supplied.
	 */
	Tile : function(character, hand, id){
		this.DomElmnt  = null; // The Dom Object
		this.$DomElmnt = null; // The JQuery instance wrapping the Dom Object.
		this.joins = {n:null, e:null, s:null, w:null}; // Tile objects this is connected to.

		this.bg_parent = hand; // The parent can only be the Hand or Board objects.

		this.screenPos = (0,0); // in pixels
		this.boardPos  = (0,0); // Grid/array position?
		this.id   = id || null;
		this.char = character;

		this.new = bg.TileNew;
		this.delete = bg.TileDelete;

		this.new();

	},

	TileNew: function(){
		if (!this.id) {
			this.id = bg.next_tile_id;
			bg.next_tile_id++;
		}
		var tile_html = '<div id="tile_' + this.id + '" class="bg_tile">' + this.char + '</div>'
		this.$parent.append(tile_html);
		this.$DomElmnt = $('#tile_'+this.id);
		this.DomElmnt = this.$DomElmnt[0];
		$.data(this.DomElmnt[0], 'bg_tile', this);
	},

	TileDelete: function(){
		// TODO How do you remove the data?
		// $.removeData(this.DomElmnt[0], 'bg_tile');
		// remove the DomElmnt
		// Delete the JQuery wrapper
		// Delete this
	},

	/* Create a hand Object.
	 * A Hand holds the Tiles that are still to be placed
	 */
	Hand : function(){
		this.tile_count = 0;

		this.DomElmnt = null;
		this.$DomElmnt = null;


		this.addTile = function(Tile){

		}
		this.new = function(){
			this.$DomElmnt = $('#bg_hand');
			this.DomElmnt = $DomElmnt[0];
			this.tile_count = 0;
			bg.Game.hand = this;
		}();
	},

	/* Create a Board Object.
	 * The Board holds the tiles that have been played.
	 * To be really placed all tiles must be (indirectly) attached to each other.
	 */
	Board : function(){
		this.tile_count = 0;

		this.DomElmnt = null;
		this.$DomElmnt = null;

		this.new = function(){
		}();
	},

	/* Creates a Bag object
	 * The Bag is responsible for dealing new tiles to the Player.
	 * dumped tiles are also given back to the bag.
	 * In single player games, the bag is entirly client side.
	 * In multiplayer the Bag is an interface to the server. (not implimented)
	 */
	Bag : function(){
		this.chars = [];
		this.is_empty = true;

		this.split = null;
		this.peal = null;
		this.dump = null;

		this.new = function(){
			if (this.chars.length > 0) {
				delete this.chars;
				this.chars = [];
			}
			for (var l in bg.Letters) {
				//log("letter: "+l+"\ncount: "+bg.Letters[l]);
				for (var i = bg.Letters[l]; i > 0; i--) {
					this.chars.push(l);
				}
			}
			if (this.chars.length > 0) this.is_empty = false;
		};
		this.new();
		/* Return a random tile from the bag */
		this.getTile = function(){
			return bg.Game.is_multi ? this.getTileRemote() : this.getTileLocal();
		};

		this.getTileLocal = function(){
			if (this.chars.length <= 0){
				this.is_empty = true;
				throw ({code:2,msg:"Bag is Empty"});
			}
			var i = Math.randomInt(this.chars.length - 1);
			var char = this.chars.splice(i, 1);
			log("Bag returned char: " + char);
			return char;
		};

		/* Fetch a tile from the remote server */
		this.getTileRemote = function(){
			return this.getTileLocal();
		};
		this.dumpTile = function(tile, hand){
			if (this.chars.length > 2){
				// delete the tile.
				// get 3 more tiles
				// Add them to the hand
			}
			else{
				throw({code:1,msg:"Bag has too few tiles."});
			}
		};
		this.addToBag = function(tile){
			return bg.Game.is_multi ? this.addToBagLocal(tile.char)
			                        : this.addToBagRemote(tile.id);
		};
		this.addToBagLocal = function(char){
		};
		this.addToBagRemote = function(tile_id){
		};

	},

	Player : function(){
		this.bag = null;
		this.hand = null;
		this.board = null;

		this.start_game = null;
	},

	Game : {
		hand: null,
		board: null,
		bag: null,
		player: null,

		is_multi: false,

		start : function(){
			bg.Game.bag = new bg.Bag();
			bg.Game.board = new bg.Board();
			bg.Game.hand = new bg.Hand();
		}
	},

	end:0
};

$(document).ready(
	function()
	{
		bg.Game.start();
	}
);