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
      } 

      if (e.which === 82) {
         self.emit("restart");
      }
   });

   var tryAgain = document.getElementById("try-again");
   tryAgain.addEventListener("click", function(e) {
      self.emit("restart");
   });
};
