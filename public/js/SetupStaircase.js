!function(e,t){var a=e.App=e.App||{},i=Staircase.Events;a.SetupStaircase=function(){Staircase.initialize(),this.initialize()},a.SetupStaircase.prototype.initialize=function(){this.camera=new Staircase.Camera("#Video"),this.previewCanvas=new Staircase.PreviewCanvas("#PreviewVideo"),this.dnd=new Staircase.DragAndDrop("#DragAndDrop"),this.modal1=new Staircase.Modal({id:"#screen-camera",page:".container"}),this.modal2=new Staircase.Modal({id:"#screen-upload",page:".container"}),this.$camera=$("#Camera"),this.$previewVideo=$("#PreviewVideo"),this.$previewImage=$("#PreviewImage"),this.$previewImageSP=$("#PreviewImageSP"),this.$screenSelect=$("#screen-select"),this.$screenCamera=$("#screen-camera"),this.$screenUpload=$("#screen-upload"),this.$btnNavigateCamera=$(".btn-navigate-camera"),this.$btnNavigateUpload=$(".btn-navigate-upload"),this.$btnCancel=$(".btn-cancel"),this.$btnAgain=$(".btn-again"),this.$btnCapture=$(".btn-capture"),this.$btnUpload=$(".btn-upload"),this.$inputFile=$(".input-file"),this.switchScreenSelect(),this.eventify(),a.ua.isSP&&this.eventifySP()},a.SetupStaircase.prototype.eventify=function(){var e=this;this.$btnNavigateCamera.on("click",function(t){e.switchScreenCamera()}),this.$btnNavigateUpload.on("click",function(){e.switchScreenUpload()}),this.$btnCancel.on("click",function(){e.switchScreenSelect()}),this.$btnAgain.on("click",function(){e.switchScreenCamera()}),this.$btnCapture.on("click",function(t){t.preventDefault();var a=e.camera.getVideo();e.previewCanvas.draw(a),e.$camera.hide(),e.camera.powerOff(),e.$previewVideo.show(),e.$btnCapture.attr("disabled",!0),e.$btnAgain.attr("disabled",!1),e.$btnUpload.attr("disabled",!1)}),this.$btnUpload.on("click",function(t){e.$btnUpload.attr("disabled",!0),e.$inputFile.addClass("disabled"),alert("アップロード！")}),this.dnd.on(i.DND_SELECT,function(t,a,i){e.$btnUpload.attr("disabled",!1)}),this.dnd.on(i.DND_LOAD_IMG,function(t,i,n){a.ua.isPC&&e.$previewImage.append(i),a.ua.isSP&&e.$previewImageSP.append(i)}),this.modal1.on(i.MODAL_HIDE,function(t){e.switchScreenSelect()}),this.modal2.on(i.MODAL_HIDE,function(t){e.switchScreenSelect()})},a.SetupStaircase.prototype.switchScreenCamera=function(){this.$screenUpload.hide(),this.$previewVideo.hide(),this.camera.powerOn(),this.$camera.show(),this.$btnAgain.attr("disabled",!0),this.$btnCapture.attr("disabled",!1),this.$btnUpload.attr("disabled",!0),this.$screenCamera.show()},a.SetupStaircase.prototype.switchScreenUpload=function(){this.$screenCamera.hide(),this.camera.powerOff(),this.$screenUpload.show()},a.SetupStaircase.prototype.switchScreenSelect=function(){this.$screenCamera.hide(),this.$screenUpload.hide(),this.camera.powerOff()},a.SetupStaircase.prototype.postImage=function(e){$.ajax({url:"/",method:"POST",data:data,beforeSend:function(){},success:function(e){},complete:function(){}})},a.SetupStaircase.prototype.eventifySP=function(e){var t=this;window.URL=window.URL||window.webkitURL,this.$inputFile.on("change",function(e){for(var i=this.files,n=0;n<i.length;n++){var r=i[n],s=/image.*/;if(r.type.match(s)){var c=new Image;c.src=window.URL.createObjectURL(r),c.onload=function(e){a.ua.isPC&&t.$previewImage.append(c),a.ua.isSP&&t.$previewImageSP.append(c)}}}})}}(this,document);