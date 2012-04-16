jQuery.namespace('Canvas');

(function($, Canvas){

	$.extend(Canvas,{
		position:function(){},
		photo :function(url,text,callback){
			this._init(url,text,callback);
		}
	});
	
	Canvas.position.prototype = {
		left:0,
		top:0,
		width:0,
		height:0,
		deg:0
	}
	
	Canvas.photo.prototype = {
		img:0,
		title:'',
		width: 0,
		height:0,
		ready:false,

		_init:function(url,text,callback){
			self = this;
			ready:false;
			self.title = text;
			self.img = new Image();
			//Keep阶段的位置
			self.keep = new Canvas.position();
			//start阶段的位置
			self.start = new Canvas.position();
			//end阶段的位置和角度
			self.end = new Canvas.position();
			self.img.onload = function(){
				self.width = this.width;
				self.height = this.height;
				//--
				self.keep.top = Math.floor((768-self.height)/2);
				self.keep.left = Math.floor((1024-self.width)/2);
				self.keep.top = self.keep.top>0?self.keep.top:0;
				self.keep.left = self.keep.left>0?self.keep.left:0;
				self.keep.width = self.width;
				self.keep.height = self.height;
				//--
				self.start.left = 1024;
				self.start.top = 0-self.height;
				self.start.width = self.width;
				self.start.height = self.height;
				self.start.deg = -720;
				//--
				self.end.left= Math.floor(50+Math.random()*(1024-100-96));
				self.end.top = Math.floor(50+Math.random()*(768-100-96));
				self.end.deg = Math.floor(Math.random()*60-30);
				if(self.width>=self.height){
					self.end.height = 96;
					self.end.width = self.width*96/self.height;
				}
				else{
					self.end.width = 96;
					self.end.height = self.height*96/self.width;
				}
				//--
				callback(self);
				self.ready = true;
			}
			self.img.src = url;
		}
	}
	
})(jQuery, Canvas);