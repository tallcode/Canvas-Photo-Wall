jQuery.namespace('Canvas');

(function($, Canvas){
	var 
	//相片列表，数组
	list,
	//全部相片列表，数组
	all,
	//雪花，snow.js定义对象
	snow,
	//方凳Logo,Image对象
	logo,
	//时间轴开始时间
	startTime,	
	//当前时间轴播放对象,photo.js定义
	photoObj,
	nextObj;
	//写文字
	function drawText(text,left,top){
		Canvas.context.save();
		Canvas.context.font = '20px 微软雅黑'
		Canvas.context.fillStyle = 'white';
		Canvas.context.fillText (text,left,top);
		Canvas.context.restore();
	}
	//画图片
	function drawPic(img,text,left,top,width,height,deg){
		deg=deg||0;
		var ox = left+(width/2),oy = top+(height/2);
		Canvas.context.save();
		Canvas.context.translate(ox,oy); 
		Canvas.context.rotate(Math.PI*deg/180);
		Canvas.context.translate(-ox,-oy); 
		Canvas.context.drawImage(img,left,top,width,height);
		Canvas.context.strokeStyle = '#3168D5'; 
		Canvas.context.lineWidth   = 4;
		Canvas.context.strokeRect(left, top, width, height);
		if(width>180){
			Canvas.context.fillStyle = '#3168D5'; 
			Canvas.context.fillRect(left-20,top+height-30,160,32);  	
			if(text){
				drawText(text,left,top+height-7);
			}
		}
		Canvas.context.restore();
	}
	//根据起始位置和结束位置，以及diff，计算当前位置
	function movePic(img,text,sPosition,dPosition,diff,duration){
		var 
		dl = dPosition.left-sPosition.left,
		dt = dPosition.top-sPosition.top,
		dw = dPosition.width-sPosition.width,
		dh = dPosition.height-sPosition.height,
		dd = dPosition.deg-sPosition.deg;

		if(diff<=duration){
			var
			rate = diff/duration,
			cl = sPosition.left+dl*rate,
			ct = sPosition.top+dt*rate,
			cw = sPosition.width+dw*rate,
			ch = sPosition.height+dh*rate,
			cd = sPosition.deg+dd*rate;
			drawPic(img,text,cl,ct,cw,ch,cd);
		}
		else{
			drawPic(img,text,dPosition.left,dPosition.top,dPosition.width,dPosition.height,dPosition.deg);
		}

	}
	//时间轴处理
	function timeline(timeStamp){
		var
		diff = timeStamp - startTime,action;
		Canvas.restoreCanvas();	
		if(diff<1000){
			action = 'start';
			movePic(photoObj.img,'',photoObj.start,photoObj.keep,diff,800);
		}
		else if(diff<5000){
			if(!nextObj){
				loadNext();
				console.log('load');
			}
			action = 'keep';
			drawPic(photoObj.img,photoObj.title,photoObj.keep.left,photoObj.keep.top,photoObj.keep.width,photoObj.keep.height,photoObj.keep.deg);
		}
		else if(diff<5800){
			action = 'end';
			movePic(photoObj.img,photoObj.title,photoObj.keep,photoObj.end,diff-5000,500);
		}
		else if(diff<6500){
			action = 'delay';
			drawPic(photoObj.img,'',photoObj.end.left,photoObj.end.top,photoObj.end.width,photoObj.end.height,photoObj.end.deg);
		}
		else{
			action = 'restart';
			drawPic(photoObj.img,'',photoObj.end.left,photoObj.end.top,photoObj.end.width,photoObj.end.height,photoObj.end.deg);
			if(!nextObj){
				loadNext();
				console.log('load');
			}
			if((nextObj)&&(nextObj.ready)){
				console.log('next');
				Canvas.context.save();
				Canvas.context.fillStyle = 'rgba(255,255,255,0.02)';
				Canvas.context.fillRect(0,0,1024,768);  
				Canvas.context.restore();
				Canvas.saveCanvas();
				delete photoObj;
				photoObj = nextObj;
				startTime = new Date();
				delete nextObj;
				nextObj = undefined;
			}
		}
		Canvas.context.drawImage(logo,824,678);
		if(snow.ready){
			for(var i=0;i<snow.list.length;i++){
				var obj = snow.list[i];
				Canvas.context.save();
				Canvas.context.scale(obj.zoom,obj.zoom);
				Canvas.context.drawImage(snow.img,obj.left/obj.zoom,obj.top/obj.zoom);
				Canvas.context.restore();
				obj.top +=obj.speedY;
				obj.top = obj.top>768?0:obj.top;
				obj.left+=obj.speedX*(Math.random()*0.8+0.2);
				obj.left = obj.left>1024?0:obj.left;
				obj.left = obj.left<0?1024:obj.left;
			}
		}
		
		webkitRequestAnimationFrame(timeline);
	}
	
	//初始化
	function init(){
		Canvas.init($('#canvas')[0],1024,768);
		var gradient= Canvas.context.createRadialGradient(512,384,20, 512,384,900);
		gradient.addColorStop(0, 'rgba(125,185,232,1)'); 
		gradient.addColorStop(1, 'rgba(30,87,153,1)'); 
		Canvas.context.fillStyle = gradient;
		Canvas.context.fillRect(0,0,1024,768);  
		Canvas.saveCanvas();	
	}
	
	//预加载下一个对象
	function loadNext(){
		nextObj = {ready:false};
		console.log(list.length)
		if(list.length==0){
			delete list;
			list = all.slice(0); 
		}
		var i = Math.floor(Math.random()*list.length),
		p = list[i];
		list.splice(i,1);
		new Canvas.photo(p.url,p.text,function(obj){
			delete nextObj;
			nextObj = obj;
		});
	}
	//动画初始化
	function initAnimation(){
		nextObj = undefined;
		list = all.slice(0); 
		var i = Math.floor(Math.random()*list.length),
		p = list[i];
		list.splice(i,1);
		new Canvas.photo(p.url,p.text,function(obj){
			photoObj = obj;
			startTime = new Date();
			webkitRequestAnimationFrame(timeline);
		});
	}

	$(function(){
		if(!window.webkitRequestAnimationFrame){
			document.write('webkitRequestAnimationFrame');
			return;
		}
		init();
		$('#audio')[0].play();
		$.getJSON('config.json',function(data){
			all = data;
			initAnimation();
		});
		snow = new Canvas.snow();
		logo = new Image();
		logo.src='logo.png';
	});
})(jQuery,Canvas);