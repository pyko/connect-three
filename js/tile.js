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
   this.tile.remove();
}

Tile.randomColour = function() {
   return CONN_3.colours[Math.floor(Math.random() * CONN_3.colours.length)];
}
