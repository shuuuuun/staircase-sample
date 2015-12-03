(function(win, doc){
  var ns = win.App = win.App || {};
  
  var Events = Staircase.Events;
  
  ns.SetupStaircase = function() {
    Staircase.initialize();
    this.initialize();
  };
  
  ns.SetupStaircase.prototype.initialize = function() {
    // objects
    this.camera = new Staircase.Camera('#Video');
    this.previewCanvas = new Staircase.PreviewCanvas('#PreviewVideo');
    // this.previewImage = new Staircase.PreviewCanvas('#PreviewImage'); // previewにcanvasを使う場合
    // this.previewImageSP = new Staircase.PreviewCanvas('#PreviewImageSP'); // previewにcanvasを使う場合
    this.dnd = new Staircase.DragAndDrop('#DragAndDrop');
    this.modal1 = new Staircase.Modal({
      id: '#screen-camera',
      page: '.container'
    });
    this.modal2 = new Staircase.Modal({
      id: '#screen-upload',
      page: '.container'
    });
    
    // elements
    this.$camera = $('#Camera');
    this.$previewVideo = $('#PreviewVideo');
    this.$previewImage = $('#PreviewImage');
    this.$previewImageSP = $('#PreviewImageSP');
    this.$screenSelect = $('#screen-select');
    this.$screenCamera = $('#screen-camera');
    this.$screenUpload = $('#screen-upload');
    this.$btnNavigateCamera = $('.btn-navigate-camera');
    this.$btnNavigateUpload = $('.btn-navigate-upload');
    this.$btnCancel = $('.btn-cancel');
    this.$btnAgain = $('.btn-again');
    this.$btnCapture = $('.btn-capture');
    this.$btnUpload = $('.btn-upload');
    this.$inputFile = $('.input-file');
    
    // screen制御
    this.switchScreenSelect();
    
    // event
    this.eventify();
    if (ns.ua.isSP) this.eventifySP();
  };
  
  ns.SetupStaircase.prototype.eventify = function() {
    var _this = this;
    
    // 撮影スタートボタン
    this.$btnNavigateCamera.on('click', function(e) {
      _this.switchScreenCamera();
    });
    
    // アップロードスタートボタン
    this.$btnNavigateUpload.on('click', function() {
      _this.switchScreenUpload();
    });
    
    // キャンセルボタン
    this.$btnCancel.on('click', function() {
      _this.switchScreenSelect();
    });
    
    // やり直すボタン
    this.$btnAgain.on('click', function() {
      _this.switchScreenCamera();
    });
    
    // 撮影ボタン
    this.$btnCapture.on('click', function(e) {
      e.preventDefault();
      var video = _this.camera.getVideo();
      _this.previewCanvas.draw(video);
      _this.$camera.hide();
      _this.camera.powerOff();
      _this.$previewVideo.show();
      _this.$btnCapture.attr('disabled', true);
      _this.$btnAgain.attr('disabled', false);
      _this.$btnUpload.attr('disabled', false);
    });
    
    // アップロードボタン
    this.$btnUpload.on('click', function(e) {
      _this.$btnUpload.attr('disabled', true);
      _this.$inputFile.addClass('disabled');
      alert('アップロード！（してない）');
    });
    
    // ファイル選択（input#File）
    this.dnd.on(Events.DND_SELECT, function(e, image, file) {
      _this.$btnUpload.attr('disabled', false);
    });
    
    // ドラッグアンドドロップ
    this.dnd.on(Events.DND_LOAD_IMG, function(e, image, file) {
      // if (ns.ua.isPC) _this.previewImage.draw(image, image.width, image.height); // canvasを使う場合
      if (ns.ua.isPC) _this.$previewImage.append(image);
      // if (ns.ua.isSP) _this.previewImageSP.draw(image, image.width, image.height); // canvasを使う場合
      if (ns.ua.isSP) _this.$previewImageSP.append(image);
    });
    
    // モーダル
    this.modal1.on(Events.MODAL_HIDE, function(e) {
      _this.switchScreenSelect();
    });
    this.modal2.on(Events.MODAL_HIDE, function(e) {
      _this.switchScreenSelect();
    });
  };
  
  ns.SetupStaircase.prototype.switchScreenCamera = function() {
    // this.$screenSelect.hide();
    this.$screenUpload.hide();
    this.$previewVideo.hide();
    this.camera.powerOn();
    this.$camera.show();
    this.$btnAgain.attr('disabled', true);
    this.$btnCapture.attr('disabled', false);
    this.$btnUpload.attr('disabled', true);
    this.$screenCamera.show();
  };
  ns.SetupStaircase.prototype.switchScreenUpload = function() {
    // this.$screenSelect.hide();
    this.$screenCamera.hide();
    this.camera.powerOff();
    this.$screenUpload.show();
  };
  ns.SetupStaircase.prototype.switchScreenSelect = function() {
    this.$screenCamera.hide();
    this.$screenUpload.hide();
    this.camera.powerOff();
    // this.$screenSelect.show();
  };
  
  ns.SetupStaircase.prototype.postImage = function(instance) {
    $.ajax({
      url: '/',
      method: 'POST',
      data: data,
      beforeSend: function() {
      },
      success: function(response) {
      },
      complete: function() {}
    });
  };
  
  ns.SetupStaircase.prototype.eventifySP = function(instance) {
    var _this = this;
    // ファイル選択
    window.URL = window.URL || window.webkitURL;
    this.$inputFile.on('change', function(e) {
      var files = this.files;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var imageType = /image.*/;

        if (!file.type.match(imageType)) {
          continue;
        }
        var image = new Image();
        image.src = window.URL.createObjectURL(file); // Blob URL
        image.onload = function(e) {
          // if (ns.ua.isPC) _this.previewImage.draw(image, image.width, image.height); // canvasを使う場合
          if (ns.ua.isPC) _this.$previewImage.append(image);
          // if (ns.ua.isSP) _this.previewImageSP.draw(image, image.width, image.height); // canvasを使う場合
          if (ns.ua.isSP) _this.$previewImageSP.append(image);
        };
      }
    });
  };
  
})(this, document);
