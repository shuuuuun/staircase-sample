(function(win, doc){
  var ns = win.App = win.App || {};
  
  var $win = $(win);
  var util = new ns.Util();
  
  $(function(){
    if (ns.ua.isSP) {
      $('.onlypc').remove();
    }
    else {
      $('.onlysp').remove();
    }
    
    // webcam & upload
    new ns.SetupStaircase();
    
  });
  
  
})(this, document);
