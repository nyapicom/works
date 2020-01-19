var list=document.getElementById("list"),delay=0,c1=document.getElementById("c1"),ctx=c1.getContext("2d"),winX,winY,mouseX=0,mouseY=0,ringNum=24;
ringSize=Array(ringNum);
ringX=Array(ringNum);
ringY=Array(ringNum);
ringExist=Array(ringNum);
ringColor=Array(ringNum);
for(var i=0;
i<ringNum;
i++)ringExist[i]=ringSize[i]=0;
var arcX,arcY,arcSelect=-1,arcSelect2=-1,arcNum=9;
arcRadius=Array(arcNum);
arcRad=Array(arcNum);
arcSpeed=Array(arcNum);
arcSize=Array(arcNum);
arcWidth=Array(arcNum);
arcColor=Array(arcNum);

arcRed=Array(arcNum);
arcOpacity=Array(arcNum);
function RGBtoHSV(a,b,c,d){var e=Math.max(Math.max(a,b),c),f=Math.min(Math.min(a,b),c);
for(a=e==f?0:e==a?60*(b-c)/(e-f)+0:e==b?60*(c-a)/(e-f)+120:60*(a-b)/(e-f)+240;
0>a;
)a+=360;
return{h:a,s:d?e-f:0==e?0:(e-f)/e*255,v:e}}
function HSVtoRGB(a,b,c){for(var d,e,f;
0>a;
)a+=360;
a%=360;
if(0==b)return c=Math.round(c),{r:c,g:c,b:c};
b/=255;
var h=Math.floor(a/60)%6,k=a/60-h;
a=c*(1-b);
var g=c*(1-k*b);
b=c*(1-(1-k)*b);
switch(h){case 0:d=c;
e=b;
f=a;
break;
case 1:d=g;
e=c;
f=a;
break;
case 2:d=a;
e=c;
f=b;
break;
case 3:d=a;
e=g;
f=c;
break;
case 4:d=b;
e=a;
f=c;
break;
case 5:d=c,e=a,f=g}return{r:Math.round(d),g:Math.round(e),b:Math.round(f)}}
for(i=0;
i<arcNum;
i++)arcColor[i]=HSVtoRGB(~~((360*i/arcNum+30*Math.random())%360),70,100),arcOpacity[i]=1,arcRed[i]=0,arcRadius[i]=300+20*i,arcWidth[i]=20+20*Math.random(),arcRad[i]=Math.PI*Math.random()*2,4>=i?(arcSize[i]=Math.PI*(0.7*Math.random()+0.5),arcSpeed[i]=0.001*Math.random()+0.003):(arcSize[i]=Math.PI*(0.3*Math.random()+0.3),arcSpeed[i]=0.001*Math.random()+0.001),0.5>Math.random()&&(arcSpeed[i]=-arcSpeed[i]);

function init(){ring();
setInterval(function(){document.all?(winX=document.body.clientWidth,winY=document.body.clientHeight):(winX=innerWidth,winY=innerHeight);
document.body.style.height=""+winY+"px";
c1.width=winX;
c1.height=winY;
arcX=winX/2;
arcY=winY/2;
parX=winX/2;
parY=winY/2;
ctx=c1.getContext("2d");
ctx.clearRect(0,0,winX,winY);
arcSelect2=-1;
if(0.1<arcSize[0]){for(var a=0;
a<arcNum;
a++){ctx.beginPath();
ctx.lineWidth=arcWidth[a];
var b=Math.pow(arcX-mouseX,2)+Math.pow(arcY-mouseY,2),c=Math.atan2(arcY-
mouseY,arcX-mouseX),c=Math.PI+c;
if(b>=Math.pow(arcRadius[a]-arcWidth[a]/2,2)&&b<=Math.pow(arcRadius[a]+arcWidth[a]/2,2))if((arcRad[a]+arcSize[a])%(2*Math.PI)<arcRad[a]%(2*Math.PI)){if(c<=(arcRad[a]+arcSize[a])%(2*Math.PI)||c>=arcRad[a]%(2*Math.PI))arcRed[a]+=8,arcSelect2=a}else c<=(arcRad[a]+arcSize[a])%(2*Math.PI)&&c>=arcRad[a]%(2*Math.PI)&&(arcRed[a]+=8,arcSelect2=a);
arcSelect==a&&(arcRed[a]+=8);
arcRed[a]-=4;
0>arcRed[a]?arcRed[a]=0:50<arcRed[a]&&(arcRed[a]=50);
var d=RGBtoHSV(arcColor[a].r,arcColor[a].g,
arcColor[a].b,!1),d=HSVtoRGB(d.h,d.s+2*arcRed[a],d.v+arcRed[a]);
ctx.strokeStyle="rgba("+d.r+","+d.g+","+d.b+","+arcOpacity[a]+")";
ctx.arc(arcX,arcY,arcRadius[a],arcRad[a]+arcSize[a],arcRad[a],!0);
arcRad[a]+=arcSpeed[a];
0>arcRad[a]&&(arcRad[a]+=2*Math.PI);
arcRad[a]>2*Math.PI&&(arcRad[a]-=2*Math.PI);
ctx.stroke()}for(a=0;
a<arcNum;
a++)ctx.beginPath(),b=Math.cos(arcRad[a])*arcRadius[a]+arcX,c=Math.sin(arcRad[a])*arcRadius[a]+arcY,ctx.font="18px '\uff2d\uff33 \uff30\u30b4\u30b7\u30c3\u30af'",d=RGBtoHSV(arcColor[a].r,
arcColor[a].g,arcColor[a].b,!1),d=HSVtoRGB(d.h,d.s+2*arcRed[a],d.v-30),ctx.fillStyle="rgba("+d.r+","+d.g+","+d.b+","+arcOpacity[a]+")",0==a?ctx.fillText("AboutUs",b,c):1==a?ctx.fillText("Participants",b,c):2==a?ctx.fillText("Gallery",b,c):3==a?ctx.fillText("Access",b,c):4==a?ctx.fillText("Links",b,c):5==a?ctx.fillText("BBS",b,c):6==a&&ctx.fillText("Staff only",b,c),ctx.stroke()}ctx.globalCompositeOperation="lighter";
for(a=0;
a<ringNum;
a++)1==ringExist[a]&&(ctx.beginPath(),ctx.lineWidth=(100-ringSize[a])/
30,ctx.strokeStyle="rgba("+ringColor[a].r+","+ringColor[a].g+","+ringColor[a].b+","+(100-ringSize[a])/100+")",ctx.arc(ringX[a],ringY[a],2*ringSize[a],0,2*Math.PI),ctx.stroke(),ringSize[a]+=1,100<ringSize[a]&&(ringSize[a]=ringExist[a]=0));
ctx.globalCompositeOperation="source-over";
0<delay&&(delay-=1)},1E3/30)}
function ring(){document.addEventListener?document.addEventListener("mousemove",MouseMoveFunc):document.attachEvent&&document.attachEvent("onmousemove",MouseMoveFunc);
document.addEventListener("click",function(){for(var a=0;
a<ringNum;
a++)if(0==ringExist[a]){ringX[a]=mouseX;
ringY[a]=mouseY;
ringColor[a]=HSVtoRGB(~~(360*Math.random()),20,230);
ringExist[a]=1;
break}-1==arcSelect&&(0==arcSelect2&&0==delay&&(listMode(1),toParticipants(1),toLinks(1),toAccess(1),toAboutUs(),delay=20),1==arcSelect2&&0==delay&&
(listMode(1),toAboutUs(1),toLinks(1),toAccess(1),toParticipants(),delay=20),2==arcSelect2&&0==delay&&window.open("gallery.html",null),3==arcSelect2&&0==delay&&(listMode(1),toParticipants(1),toLinks(1),toAboutUs(1),toAccess(),delay=20),4==arcSelect2&&0==delay&&(listMode(1),toParticipants(1),toAboutUs(1),toAccess(1),toLinks(),delay=20),5==arcSelect2&&0==delay&&(window.open("BBS",null),delay=20),6==arcSelect2&&0==delay&&(window.open("edit.html",
null),delay=20))},!1)}function MouseMoveFunc(a){mouseX=a.clientX;
mouseY=a.clientY}function listMode(a){null!=a?(list.style.opacity=0,list.style.top="-10px"):(list.style.opacity=1,list.style.top="0px")}var page=1;

function pageChange(a){if(9999==a){var b=document.getElementById("p"+page++);
b.style.zIndex=1;
b.style.opacity=0;
b.style.marginLeft="-220px";
10==page&&(b=document.getElementById("arrowR"),b.style.visibility="hidden");
a=document.getElementById("p"+page);
a.style.zIndex=7;
a.style.opacity=1;
a.style.marginLeft="-270px";
a=document.getElementById("arrowL");
a.style.visibility="visible"}else 9998==a?(b=document.getElementById("p"+page--),b.style.zIndex=1,b.style.opacity=0,b.style.marginLeft="-320px",1==page&&
(b=document.getElementById("arrowL"),b.style.visibility="hidden"),a=document.getElementById("p"+page),a.style.zIndex=7,a.style.opacity=1,a.style.marginLeft="-270px",a=document.getElementById("arrowR"),a.style.visibility="visible"):a!=page?(b=document.getElementById("p"+page),b.style.zIndex=1,b.style.opacity=0,b.style.marginLeft=page>a?"-220px":"-320px",page=a,a=document.getElementById("p"+page),a.style.zIndex=7,a.style.opacity=1,a.style.marginLeft="-270px",b=document.getElementById("arrowL"),b.style.visibility=
1==page?"hidden":"visible",b=document.getElementById("arrowR"),b.style.visibility=10==page?"hidden":"visible"):1==a&&(a=document.getElementById("p"+page),a.style.zIndex=7,a.style.opacity=1,a.style.marginLeft="-270px")}
function toParticipants(a){null==a?(list.style.zIndex=1,pageChange(1),a=document.getElementById("participants"),a.style.zIndex=6,a.style.opacity=1,a.style.marginLeft="0px",a=document.getElementById("index"),a.style.zIndex=7,a.style.opacity=1,a=document.getElementById("arrowR"),a.style.visibility="visible",a=document.getElementById("arrowL"),a.style.visibility="hidden"):(list.style.zIndex=2,a=document.getElementById("participants"),a.style.zIndex=1,a.style.opacity=0,a.style.marginLeft="-100%",a=document.getElementById("index"),
a.style.zIndex=1,a.style.opacity=0)}
function toAboutUs(a){s=document.getElementById("aboutUs");
null==a?(s.style.zIndex=6,s.style.opacity=1,s.style.marginTop="-250px"):(s.style.zIndex=1,s.style.marginTop="-270px",s.style.opacity=0)}function toAccess(a){s=document.getElementById("access");
null==a?(s.style.opacity=1,s.style.marginTop="-250px",s.style.zIndex=6):(s.style.opacity=0,s.style.marginTop="-270px",s.style.zIndex=1)}
function toLinks(a){s=document.getElementById("links");
null==a?(s.style.opacity=1,s.style.marginTop="0px",s.style.zIndex=6):(s.style.opacity=0,s.style.marginTop="-100%",s.style.zIndex=1)};

