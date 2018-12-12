$(function() {
   $("body").mousewheel(function(event, chg) {
      event.preventDefault();
      this.scrollLeft -= (chg); //need a value to speed up the change
   });
});
