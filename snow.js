jQuery.namespace('Canvas');

(function($, Canvas){

	$.extend(Canvas,{
		snowProp:function(){},
		snow :function(url,callback){
			return this._init();
		}
	});
	
	Canvas.snowProp.prototype = {
		left:0,
		top:0,
		speedX:0,
		speedY:0,
		zoom:1
	}
	
	Canvas.snow.prototype = {
		img:0,
	
		_init:function(){
			var 
			self = this;
			self.ready = false,
			self.img = new Image();
			self.img.onload= function(){
				self.ready = true;
			};
			self.img.src='snow.png';
			self.list = new Array();
			var temp;
			for(var i=0;i<250;i++){
				temp = new Canvas.snowProp();
				temp.left = Math.floor(Math.random()*1024);
				temp.top = Math.floor(Math.random()*768);
				temp.speedX = Math.random()*2-1;
				temp.speedY = Math.random()*0.8+0.8;
				temp.zoom = Math.random()+0.2;
				self.list.push(temp);
			}
			return self;
		}
	}
	
})(jQuery, Canvas);