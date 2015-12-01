(function(win, doc){
  var ns = win.App = win.App || {};
  
  var $win = $(win);
  var util = new ns.Util();
  
  $(function(){
    // webcam & upload
    new ns.SetupStaircase();
    
  });
  
  
})(this, document);
