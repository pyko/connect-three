function Grid(gridSize) {
   this.gridSize = gridSize;
   this.numTiles = 0;
   this.tiles = [];

   for (var i=0; i < gridSize; i++) {
      this.tiles.push([]);
   }
}

Grid.prototype.clearBoard = function() {
   for (var x=0; x < this.gridSize; x++) {
      for (var y=0; y < this.gridSize; y++) {
         var tile = this.tiles[x][y];
         if (tile) {
            tile.remove();
            this.tiles[x][y] = undefined;
         }
      }
   }
}

Grid.prototype.addTile = function(tile) {
   this.tiles[tile.x][tile.y] = tile;  
}

Grid.prototype.moveTile = function(position, direction) {
   if (!this.tiles[position.x][position.y]) return false; //exit if no tile

   var tile = this.tiles[position.x][position.y];
   var newPosition = {x: position.x, y: position.y};
   if (direction == CONN_3.UP) {
      newPosition = this.furtherest(newPosition, function(position) {position.y -= 1;});
   } else if (direction == CONN_3.DOWN) {
      newPosition = this.furtherest(newPosition, function(position) {position.y += 1;});
   } else if (direction == CONN_3.RIGHT) {
      newPosition = this.furtherest(newPosition, function(position) {position.x += 1;});
   } else if (direction == CONN_3.LEFT) {
      newPosition = this.furtherest(newPosition, function(position) {position.x -= 1;});
   }

   if (this.isValidPosition(newPosition) && this.isEmptySpace(newPosition)) {
      delete this.tiles[position.x][position.y]
      this.tiles[newPosition.x][newPosition.y] = tile;
      tile.setPosition(newPosition);
      return true;
   }
}

Grid.prototype.availableSpaces = function() {
   var freeTiles = [];
   for (var x = 0; x < this.gridSize; x++) {
      for (var y = 0; y < this.gridSize; y++) {
         if (!this.tiles[x][y]) {
            freeTiles.push({x: x, y: y});
         }
      }
   }

   return freeTiles;
}

Grid.prototype.availableSideSpaces = function(direction) {
   var freeTiles = [];
   if (direction === CONN_3.UP || direction === CONN_3.DOWN) {
      var y = direction === CONN_3.DOWN ? 0 : this.gridSize-1;
      for (var x = 0; x < this.gridSize; x++) {
         if (!this.tiles[x][y]) {
            freeTiles.push({x: x, y: y});
         }
      }
   } else if (direction === CONN_3.LEFT || direction === CONN_3.RIGHT) {
      var x = direction === CONN_3.RIGHT ? 0 : this.gridSize-1;
      for (var y = 0; y < this.gridSize; y++) {
         if (!this.tiles[x][y]) {
            freeTiles.push({x: x, y: y});
         }
      }
   }

   return freeTiles;
}

Grid.prototype.randomAvailableSpace = function() {
   var freeTiles = this.availableSpaces();
   return freeTiles[Math.floor(Math.random() * freeTiles.length)];
}

Grid.prototype.randomAvailableSideSpace = function(direction) {
   var freeTiles = this.availableSideSpaces(direction);
   return freeTiles[Math.floor(Math.random() * freeTiles.length)];
}

Grid.prototype.furtherest = function(position, moveDirection) {
   var posX = position.x;
   var posY = position.y;
   do {
      posX = position.x;
      posY = position.y;
      moveDirection(position);
   } while (this.isValidPosition(position) && this.isEmptySpace(position))
   return {x: posX, y: posY};
}

Grid.prototype.isFull = function() {
   for (var x=0; x < this.gridSize; x++) {
      for (var y=0; y < this.gridSize; y++) {
            if (this.tiles[x][y] === undefined) {
               return false;
            }
      }
   }
   return true;
}

Grid.prototype.isEmptySpace = function(position) {
   return this.tiles[position.x][position.y] === undefined;
}

Grid.prototype.isValidPosition = function(position) {
   return position.y >= 0 && position.y < this.gridSize && position.x >= 0 && position.x < this.gridSize;
}

Grid.prototype.checkCombos = function() {
   var self = this;
   var points = 0;
   CONN_3.colours.forEach(function(colour){
      var playerTiles = document.getElementsByClassName(colour);
      if (playerTiles.length >= 3) {
         var comboTiles = [];
         for (var x = 0; x < self.gridSize; x++) {
            var rowComboTiles = [];
            var colComboTiles = [];
            for (var y = 0; y < self.gridSize; y++ ) {
               var colComboTile = self.tiles[x][y];
               if (colComboTile && colComboTile.getColour() === colour) {
                  colComboTiles.push(colComboTile);
               } else {
                  colComboTiles = [];
               }

               var rowComboTile = self.tiles[y][x]; //switch x,y to check row
               if (rowComboTile && rowComboTile.getColour() === colour) {
                  rowComboTiles.push(rowComboTile);
               } else {
                  rowComboTiles = [];
               }

               if (rowComboTiles.length >= 3) {
                  comboTiles = comboTiles.concat(rowComboTiles);   
               }
               
               if (colComboTiles.length >= 3) {
                  comboTiles = comboTiles.concat(colComboTiles);   
               }             
            }            
         }
         if (comboTiles.length >= 3) {
            points += comboTiles.length;
            comboTiles.forEach(function(tile) {
               delete self.tiles[tile.getX()][tile.getY()];
               tile.remove();
            });
         }                        
      }
   });
   return points;
}