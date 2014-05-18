function InputListener() {
   this.events = {};
   this.listen();
}

InputListener.prototype.on = function(event, callback) {
   if (!this.events[event]) {
      this.events[event] = [];
   }
   this.events[event].push(callback);
};

InputListener.prototype.emit = function(event, data) {
   var callbacks = this.events[event];
   if (callbacks) {
      callbacks.forEach(function(callback) {
         callback(data);
      });
   }
}

InputListener.prototype.listen = function() {

   var self = this;
   var keyMap = {
      38: CONN_3.UP, // Up
      39: CONN_3.RIGHT, // Right
      40: CONN_3.DOWN, // Down
      37: CONN_3.LEFT, // Left
   }

   document.addEventListener("keydown", function(e){
      // console.log("key: " + e.which);
      var direction = keyMap[e.which];
      if (direction) {
         e.preventDefault();
         self.emit("move", direction);
         console.log("move: " + direction);
      } 

      if (e.which === 82) {
         self.emit("restart");
      }
   });

   var tryAgain = document.getElementById("try-again");
   tryAgain.addEventListener("click", function(e) {
      self.emit("restart");
   });

   // Mobile swipes
   var gameBoard = document.getElementById("game-board");
   var touchX, touchY;
   gameBoard.addEventListener("touchmove", function(e){
      e.preventDefault();
   });

   gameBoard.addEventListener("touchstart", function(e){
      touchX = e.targetTouches[0].clientX;
      touchY = e.targetTouches[0].clientY;
   });

   gameBoard.addEventListener("touchend", function(e){
      var deltaX = touchX - e.changedTouches[0].clientX;
      var deltaY = touchY - e.changedTouches[0].clientY;
      console.log("deltaX: " + deltaX);
      console.log("deltaY: " + deltaY);
      if (deltaY > 30) {
         self.emit("move", CONN_3.UP); 
      } else if (deltaY < -30) {
         self.emit("move", CONN_3.DOWN); 
      } else if (deltaX > 30) {
         self.emit("move", CONN_3.LEFT); 
      } else if (deltaX < -30) {
         self.emit("move", CONN_3.RIGHT); 
      } 
   });
};
