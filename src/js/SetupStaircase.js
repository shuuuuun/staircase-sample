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
    this.previewCanvas.type = 'camera';
    this.previewImage = new Staircase.PreviewCanvas('#PreviewImage');
    this.previewImage.type = 'file';
    this.dnd = new Staircase.DragAndDrop('#DragAndDrop');
    
    // elements
    this.$camera = $('#Camera');
    this.$previewVideo = $('#PreviewVideo');
    this.$previewImage = $('#PreviewImage');
    this.$screenSelect = $('#screen-select');
    this.$screenCamera = $('#screen-camera');
    this.$screenUpload = $('#screen-upload');
    // this.$btnStartCamera = $('#StartCamera');
    // this.$btnStartUpload = $('#StartUpload');
    this.$btnNavigateCamera = $('.btn-navigate-camera');
    this.$btnNavigateUpload = $('.btn-navigate-upload');
    this.$btnCancel = $('.btn-cancel button');
    this.$btnAgain = $('.btn-again button');
    // this.$btnSelectCamera = this.$screenSelect.find('.btn-camera');
    // this.$btnSelectUpload = this.$screenSelect.find('.btn-upload');
    // this.$navigateUpload = this.$screenCamera.find('.btn-navigate-upload');
    // this.$navigateCamera = this.$screenUpload.find('.btn-navigate-camera');
    // this.$uploadForm = $('#UploadForm');
    this.$btnCapture = $('#CaptureBtn');
    this.$btnUpload = $('.btn-upload button'); // $('#UploadBtn');
    this.$inputFile = $('#InputFile');
    // this.$btnShooting = $('.btn-shooting button')
    // this.$btnUpload = $('.btn-upload button')
    // this.$inputUpload = this.$uploadForm.find('input[type="file"]');
    
    // カメラがあるか
    if (this.camera.isSupport == null) {
      this.$btnNavigateCamera.hide();
    }
    
    // screen制御
    this.switchScreenSelect();
    
    // event
    this.eventify();
  };
  
  ns.SetupStaircase.prototype.eventify = function() {
    var _this = this;
    
    // 撮影スタートボタン
    this.$btnNavigateCamera.on('click', function(e) {
      _this.switchScreenCamera();
      // ga('send', 'event', 'screen-camera', 'show', 'from-screen-select');
    });
    
    // アップロードスタートボタン
    this.$btnNavigateUpload.on('click', function() {
      _this.switchScreenUpload();
      // ga('send', 'event', 'screen-upload', 'show', 'from-screen-select');
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
      // ga('send', 'event', 'button-capture', 'click', location.href);
      // _this.postImage(_this.previewCanvas);
    });
    
    // アップロードボタン
    this.$btnUpload.on('click', function(e) {
      _this.$btnUpload.attr('disabled', true);
      _this.$inputFile.addClass('disabled');
      // ga('send', 'event', 'button-upload', 'click', location.href);
      // _this.$uploadForm.submit();
      alert('アップロード！');
    });
    
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
          _this.previewImage.draw(image, image.width, image.height);
        };
      }
      _this.$btnUpload.attr('disabled', false);
    });
    
    // ドラッグアンドドロップ
    this.dnd.on(Events.DND_LOAD_IMG, function(e, image, file) {
      // ga('send', 'event', 'area-dnd', 'drag-and-drop', location.href);
      _this.previewImage.draw(image, image.width, image.height);
      // _this.postImage(_this.previewImage);
    });
  };
  
  ns.SetupStaircase.prototype.switchScreenCamera = function() {
    this.$screenSelect.hide();
    this.$screenUpload.hide();
    this.$screenUpload.find('.error').hide();
    this.$previewVideo.hide();
    this.camera.powerOn();
    this.$camera.show();
    this.$btnAgain.attr('disabled', true);
    this.$btnCapture.attr('disabled', false);
    this.$screenCamera.show();
  };
  ns.SetupStaircase.prototype.switchScreenUpload = function() {
    this.$screenSelect.hide();
    this.$screenCamera.hide();
    this.$screenCamera.find('.error').hide();
    this.camera.powerOff();
    this.$screenUpload.show();
  };
  ns.SetupStaircase.prototype.switchScreenSelect = function() {
    this.$screenCamera.hide();
    this.$screenUpload.hide();
    this.$screenCamera.find('.error').hide();
    this.$screenUpload.find('.error').hide();
    this.camera.powerOff();
    this.$screenSelect.show();
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
  
})(this, document);
