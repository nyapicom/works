window.onload = function() {
	var mobile = document.getElementById("mobile");//モバイル機器用の表示画面を消去
	document.body.removeChild(mobile);
	var list = document.getElementById("list");
	list.innerHTML=
		"<li id='li1' class='aList' onMouseOver='arcRed[0]+=50;' onMouseOut='arcRed[0]+=50;'>Start</li><br>"+
		"<li id='li2' class='aList' onMouseOver='arcRed[1]+=50;' onMouseOut='arcRed[1]+=50;'>Edit</li><br>"+
		"<li id='li3' class='aList' onMouseOver='arcRed[2]+=50;' onMouseOut='arcRed[2]+=50;'>Config</li><br>"+
		"<li id='li4' class='aList' onMouseOver='arcRed[3]+=50;' onMouseOut='arcRed[3]+=50;'>Links</li><br>"+
		"<li id='li5' class='aList' onMouseOver='arcRed[4]+=50;' onMouseOut='arcRed[4]+=50;'>弾幕</li><br>";

	var c1 = document.getElementById("canvas");
	var ctx = c1.getContext('2d');
	var winX;
	var winY;
	var mouseX = 0;
	var mouseY = 0;

	var logo = new Image();
	logo.src = "logo.png?" + new Date().getTime();

	var ringNum = 10;
	var ringLife = 80.0;
	ringSize = new Array(ringNum);
	ringX = new Array(ringNum);
	ringY = new Array(ringNum);
	ringExist = new Array(ringNum);
	ringRed = new Array(ringNum);
	ringGreen = new Array(ringNum);
	ringBlue = new Array(ringNum);
	for (var i = 0; i < ringNum; i++){ringExist[i] = 0;ringSize[i] = 0;};

	var arcNum = 8;
	arcRadius = new Array(arcNum);
	arcRad = new Array(arcNum);
	arcSpeed = new Array(arcNum);
	arcSize = new Array(arcNum);
	arcWidth = new Array(arcNum);
	arcColor = new Array(arcNum);
	arcRed = new Array(arcNum);
	for (var i = 0; i < arcNum; i++) {
		arcRed[i]=0;
		arcRadius[i]=50+i*20;
		arcWidth[i]=20+Math.random()*20;
		arcRad[i]=Math.PI*Math.random()*2;
		if (i<=4){
			arcSize[i]=Math.PI*(Math.random()*0.7+0.5);
			arcSpeed[i]=Math.random()*0.001+0.003;
			arcColor[i]=1.0-(Math.random()*0.4+0.3);
		}else{
			arcSize[i]=Math.PI*(Math.random()*0.3+0.3);
			arcSpeed[i]=Math.random()*0.001+0.001;
			arcColor[i]=1.0-(Math.random()*0.2+0.1);
		}
		if (Math.random()<0.5){arcSpeed[i]=-arcSpeed[i];}
	};

	function ring(){
		var delay = 0;
		if(document.addEventListener){
			document.addEventListener("mousemove" , MouseMoveFunc);
		}else if(document.attachEvent){
			document.attachEvent("onmousemove" , MouseMoveFunc);
		}
		document.addEventListener('click', function(){
			for (var i = 0; i < ringNum; i++) {
				if (ringExist[i] == 0){
					ringX[i] = mouseX;
					ringY[i] = mouseY;
					ringRed[i] = Math.floor(Math.random()*40)+180;
					ringGreen[i] = Math.floor(Math.random()*40)+180;
					ringBlue[i] = Math.floor(Math.random()*40)+180;
					ringExist[i] = 1;
					break;
				}
			};
		}, false);
	}

	function sizing(){
		document.body.style.height=""+winY+"px";
		c1.width = winX;
		c1.height = winY;
	}
	function getWindowSize(){
		if(document.all){
			winX = document.body.clientWidth;
			winY = document.body.clientHeight;
		}else{
			winX = innerWidth;
			winY = innerHeight;
		}
	}
	function MouseMoveFunc(e){
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	function init(){
		ring();
		setInterval( function(){
			getWindowSize();
			sizing();
			ctx = c1.getContext('2d');

			ctx.clearRect(0, 0, winX, winY);

			for (var i = 0; i < arcNum; i++) {
				ctx.beginPath();
				ctx.lineWidth = arcWidth[i];
				var a = Math.floor(arcColor[i]*255);
				var kyori = Math.pow(70-mouseX,2)+Math.pow(winY/2-mouseY,2);
				var kakudo = Math.atan2((winY/2-mouseY),(70-mouseX));
				kakudo = Math.PI+kakudo;
				if( (kyori >= Math.pow(arcRadius[i]-arcWidth[i]/2,2)) && (kyori <= Math.pow(arcRadius[i]+arcWidth[i]/2,2)) ){
					if ( ((arcRad[i]+arcSize[i])%(Math.PI*2))<((arcRad[i])%(Math.PI*2)) ){  // 始まりの方が大きい
						if ( kakudo<=(arcRad[i]+arcSize[i])%(Math.PI*2) || kakudo>=(arcRad[i])%(Math.PI*2)){
							arcRed[i]+=8;
						}
					}else{  // 終わりの方が大きい（普通）
						if ( (kakudo <= (arcRad[i]+arcSize[i])%(Math.PI*2)) && (kakudo >= (arcRad[i])%(Math.PI*2)) ){
							arcRed[i]+=8;
						}
					}
				}
				arcRed[i]-=4;
				if (arcRed[i]<0){arcRed[i]=0}else;if(arcRed[i]>50){arcRed[i]=50}
				ctx.strokeStyle = "rgba("+(a+arcRed[i])+","+a+","+a+","+1+")";
				ctx.arc(70,winY/2,arcRadius[i],arcRad[i]+arcSize[i],arcRad[i],true);
				arcRad[i]+=arcSpeed[i];
				if(arcRad[i]<0){arcRad[i]+=Math.PI*2}
				if(arcRad[i]>Math.PI*2){arcRad[i]-=Math.PI*2}
				ctx.stroke();
			};

			ctx.globalCompositeOperation = "lighter";
			for (var i = 0; i < ringNum; i++) {
				if (ringExist[i] == 1){
					ctx.beginPath();
					ctx.lineWidth = (ringLife-ringSize[i])/30;
					ctx.strokeStyle = "rgba("+ringRed[i]+","+ringGreen[i]+","+ringBlue[i]+","+(ringLife-ringSize[i])/ringLife+")";
					ctx.arc(ringX[i],ringY[i],2.0*ringSize[i],0,Math.PI*2);
					ctx.stroke();
					ringSize[i]+=1;
					if (ringSize[i]>ringLife){
						ringSize[i]=0;
						ringExist[i]=0;
					}
				}
			};
			ctx.globalCompositeOperation = "sourse-over";

			var t = Math.round(Math.random() * 5);
		}, 1000/30);
	}
	init();
};