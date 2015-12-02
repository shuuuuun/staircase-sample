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
    this.modal = new Staircase.Modal({
      id: '#Modal',
      page: '.container'
    });
    
    // elements
    this.$screenSelect = $('#screen-select');
    this.$screenCamera = $('#screen-camera');
    this.$screenUpload = $('#screen-upload');
    // this.$btnStartCamera = $('#StartCamera');
    // this.$btnStartUpload = $('#StartUpload');
    this.$btnStartCamera = $('.btn-camera');
    this.$btnStartUpload = $('.btn-upload');
    this.$btnStartCancel = $('.btn-cancel');
    // this.$btnSelectCamera = this.$screenSelect.find('.btn-camera');
    // this.$btnSelectUpload = this.$screenSelect.find('.btn-upload');
    this.$navigateUpload = this.$screenCamera.find('.btn-navigate-upload');
    this.$navigateCamera = this.$screenUpload.find('.btn-navigate-camera');
    this.$uploadForm = $('#UploadForm');
    this.$btnCapture = $('#CaptureBtn');
    this.$btnUpload = $('#UploadBtn')
    
    // this.$btnShooting = $('.btn-shooting button')
    // this.$btnUpload = $('.btn-upload button')
    
    this.$inputUpload = this.$uploadForm.find('input[type="file"]');
    this.$modalError = this.modal.$el.find('.modal__error');
    this.modalCloseTargetSelector = '.modal-bg, .btn-close';
    
    // エラー判定
    var queryString = Staircase.Util.getQueryString();
    if (queryString.mp_status === 'ng') {
      this.$modalError.html('画像の処理に失敗しました。<br>別の画像をアップロードしてください。');
      this.modal.show();
    }
    
    // event
    this.eventify();
  };
  
  ns.SetupStaircase.prototype.eventify = function() {
    var _this = this;
    
    // カメラがあるか
    if (this.camera.isSupport == null) {
      this.$btnStartCamera.hide();
      this.$navigateCamera.hide();
    }
    
    // screen制御
    // this.$screenCamera.hide();
    // this.$screenUpload.hide();
    this.switchScreenSelect();
    
    // 撮影スタートボタン
    this.$btnStartCamera.on('click', function(e) {
      _this.switchScreenCamera();
      // ga('send', 'event', 'screen-camera', 'show', 'from-screen-select');
    });
    
    // アップロードスタートボタン
    this.$btnStartUpload.on('click', function() {
      _this.switchScreenUpload();
      // ga('send', 'event', 'screen-upload', 'show', 'from-screen-select');
    });
    
    // キャンセルボタン
    this.$btnStartCancel.on('click', function() {
      _this.switchScreenSelect();
    });
    
    // 撮影ボタン
    this.$btnCapture.on('click', function(e) {
      e.preventDefault();
      var video = _this.camera.getVideo();
      _this.previewCanvas.draw(video);
      $(video).hide();
      _this.$btnCapture.attr('disabled', true);
      _this.camera.powerOff();
      // ga('send', 'event', 'button-capture', 'click', location.href);
      // _this.postImage(_this.previewCanvas);
    });
    
    // アップロードボタン
    this.$btnUpload.on('click', function(e) {
      _this.$btnUpload.attr('disabled', true);
      _this.$inputUpload.addClass('disabled');
      _this.$navigateCamera.hide();
      _this.$navigateUpload.hide();
      // ga('send', 'event', 'button-upload', 'click', location.href);
      // _this.$uploadForm.submit();
    });
    
    // ファイル選択
    window.URL = window.URL || window.webkitURL;
    this.$inputUpload.on('change', function(e) {
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
    });
    
    // ドラッグアンドドロップ
    this.dnd.on(Events.DND_LOAD_IMG, function(e, image, file) {
      // ga('send', 'event', 'area-dnd', 'drag-and-drop', location.href);
      _this.previewImage.draw(image, image.width, image.height);
      // _this.postImage(_this.previewImage);
    });
    
    // モーダル
    this.modal.$el.on('click', this.modalCloseTargetSelector, function(e) {
      _this.modal.hide();
    });
  };
  
  ns.SetupStaircase.prototype.switchScreenCamera = function() {
    this.$screenSelect.hide();
    this.$screenUpload.hide();
    this.$screenUpload.find('.error').hide();
    this.camera.powerOn();
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
    var base64, canvas, data, _this;
    _this = this;
    canvas = instance.getCanvas();
    base64 = canvas.toDataURL('image/png').replace(/^.*,/, '');
    data = {
      img: base64
    };
    if (Staircase.Util.ua.isIOS) {
      data.device = 'ios';
    } else if (Staircase.Util.ua.isAndroid) {
      data.device = 'android';
    }
    this.$modalError.attr('class', 'error');
    $.ajax({
      url: '/face.json',
      method: 'POST',
      data: data,
      beforeSend: function() {
        _this.$btnCapture.attr('disabled', true);
        _this.$btnUpload.attr('disabled', true);
        _this.$navigateCamera.hide();
        _this.$navigateUpload.hide();
      },
      success: function(response) {
        if (response.status === 'ok') {
          // ga('send', 'event', 'send-face', 'success', location.href);
          $(location).attr('href', response.redirect_path);
        } else {
          _this.$btnCapture.attr('disabled', false);
          _this.$btnUpload.attr('disabled', false);
          _this.$navigateCamera.show();
          _this.$navigateUpload.show();
          if (instance.type === 'camera') {
            instance.reset();
            _this.camera.powerOn();
            _this.$modalError.html('画像の処理に失敗しました。<br>もう一度撮影し直してください。');
            // ga('send', 'event', 'send-face', 'failed', 'ng-camera');
          }
          else if (instance.type === 'file') {
            _this.$modalError.html('画像の処理に失敗しました。<br>別の画像をアップロードしてください。');
            // ga('send', 'event', 'send-face', 'failed', 'ng-upload');
          }
          _this.modal.show();
        }
      },
      complete: function() {}
    });
  };
  
})(this, document);
