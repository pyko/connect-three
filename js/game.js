function GameController() {
   this.numStartTiles = 2;
   this.gridSize = 4;
   this.score = 0;


   this.tilesContainer = document.getElementById("player-tiles");
   this.scoreDisplay = document.querySelector(".score-value");
   this.bestScoreDisplay = document.querySelector(".best-score-value");
   this.gameOverOverlay = document.getElementById("game-over");

   this.inputListener = new InputListener();
   this.grid = new Grid(4);

   this.inputListener.on("move", this.move.bind(this));
   this.inputListener.on("restart", this.restart.bind(this));

   this.bestScoreDisplay.textContent = localStorage.getItem("c3-best") || 0;

   this.restart();
}

GameController.prototype.restart = function() {
   Tiles.reset();
   this.gameOverOverlay.className = "hidden";
   this.score = 0;
   this.scoreDisplay.textContent = 0;
   this.grid.clearBoard();
   this.newGame();
}

GameController.prototype.newGame = function() {   
   for (var i=0; i< this.numStartTiles; i++) {
      var tile = new Tile(this.grid.randomAvailableSpace(), Tiles.randomColour());
      this.addTile(tile);   
   }
};

GameController.prototype.addTile = function(tile) {
   this.tilesContainer.appendChild(tile.getTile());
   this.grid.addTile(tile);
};

GameController.prototype.move = function(direction) {
   var self = this;
   var hasMoved = false;
   var rowCheckOrder = [];
   var colCheckOrder = [];
   for (var i=0; i < this.gridSize; i++) {
      rowCheckOrder.push(i);
      colCheckOrder.push(i);
   }

   if (direction == CONN_3.DOWN) {
      colCheckOrder.reverse();
   } else if (direction == CONN_3.RIGHT) {
      rowCheckOrder.reverse();
   }

   rowCheckOrder.forEach(function(x){
      colCheckOrder.forEach(function(y){
         if (self.grid.moveTile({x:x, y:y}, direction)) {
            hasMoved = true;
         }
      });
   });

   if (hasMoved) {      
      setTimeout(function() {
         var tile = new Tile(self.grid.randomAvailableSideSpace(direction), Tiles.randomColour());
         self.addTile(tile);
         self.score += 1;   
      }, 150);
      setTimeout(function() {
         self.score += self.grid.checkCombos();
         self.scoreDisplay.textContent = self.score;
         if (self.grid.isFull()) {
            self.gameOverOverlay.className = "";
            if (self.score > +localStorage.getItem("c3-best")) {
               localStorage.setItem("c3-best", self.score);
               self.bestScoreDisplay.textContent = self.score;
            }
            
         }
      }, 250);

      if (this.score > 15 && Tiles.colours.length < 3) {
         Tiles.addNewColour("green");
      } else if (this.score > 60 && Tiles.colours.length < 4) {
         Tiles.addNewColour("yellow");
      } else if (this.score > 130 && Tiles.colours.length < 5) {
         Tiles.addNewColour("purple");
      } else if (this.score > 200 && Tiles.colours.length < 6) {
         Tiles.addNewColour("cyan");
      }
   }
};


new GameController();