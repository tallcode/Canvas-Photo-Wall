jQuery.namespace('Canvas');

(function($, Canvas){
	$.extend(Canvas,{
		//ȫ�ֻ�ͼ����
		context:undefined,
		temp:undefined,
		//������
		_buff:undefined,
		//��С
		canvasWidth:0,
		canvasHeight:0,
		//2Dcanvas֧��
		isSupport:function(){
			var _temp = document.createElement('canvas');
			if (!_temp || !_temp.getContext) {
				return false;
			}
			var cxt = _temp.getContext('2d');
			if (!cxt) {
				return false;
			}	
			return true;
		},
		//��ͼ��ʼ��
		init:function(el,width,height){
			if(!this.isSupport()){
				return false;
			}
			if (!el || !el.getContext) {
				return false;
			}
			this.context = el.getContext('2d');
			if (!this.context) {
				return false;
			}
			this.canvasHeight = height;
			this.canvasWidth = width;
			return true;	
		},
		//����ͼƬ
		loadImg:function(url,obj){
			var img = new Image();
			img.onload = function(){obj = img;}
			img.src = url;
		},
		//saveCanvas
		saveCanvas:function(){
			if(!this.context){return;}
			this._buff = this.context.getImageData(0,0,this.canvasWidth,this.canvasHeight);
		},
		//restoreCanvas
		restoreCanvas:function(){
			if(!this.context){return;}
			if(this._buff){
				this.context.putImageData(this._buff,0,0,0,0,this.canvasWidth,this.canvasHeight);
			}
		}
	});
})(jQuery, Canvas);