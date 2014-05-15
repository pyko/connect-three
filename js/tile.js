function Tile(position, colour) {
   this.tile = document.createElement("div");
   this.colour = colour;
   this.setPosition(position);
}

Tile.prototype.getTile = function() {
   return this.tile;
}

Tile.prototype.setPosition = function(position, newTile) {
   this.x = position.x;
   this.y = position.y;
   this.posClass = "pos-" + this.x + "-" + this.y;
   this.tile.className = "player-tile " + this.colour + " " + this.posClass;
}

Tile.prototype.getColour = function() {
   return this.colour;
}

Tile.prototype.getX = function() {
   return this.x;
}

Tile.prototype.getY = function() {
   return this.y;
}

Tile.prototype.remove = function() {
   if (typeof this.tile.remove === "function") {
      console.log("remove tile");
      this.tile.remove();   
   } else {
      console.log("long way of removing tile");
      this.tile.parentElement.removeChild(this.tile);
   }  
}

var Tiles = {
   colours : ["red", "blue"],
   addNewColour: function(colour) {
      this.colours.push(colour);
   },
   randomColour: function() {
      return this.colours[Math.floor(Math.random() * this.colours.length)];
   },
   reset: function() {
      this.colours = ["red", "blue"];
   }
}
