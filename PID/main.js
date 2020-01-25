// ベクトルライブラリ
// jsでは演算子のオーバーロードが出来ないのがつらい
let Vec2 = function(x,y){
	this.x = x
	this.y = y
}
Vec2.prototype.tiny_vec = function(){  // 小さいランダムベクトルを生成することで、要素同士の重なりを防ぐ
	return new Vec2(Math.random()*0.01-0.005, Math.random()*0.01-0.005)
}
Vec2.prototype.copy = function(){
	return new Vec2(this.x, this.y)
}
Vec2.prototype.add = function(v){
	return new Vec2(this.x+v.x, this.y+v.y)
}
Vec2.prototype.sub = function(v){
	return new Vec2(this.x-v.x, this.y-v.y)
}
Vec2.prototype.mul = function(a){
	if(a==Infinity || a==-Infinity)return this.tiny_vec()  // こうすると自分の実装では都合がいい
	return new Vec2(this.x*a, this.y*a)
}
Vec2.prototype.prod = function(v){
	return new Vec2(this.x*v.x, this.y*v.y)
}
Vec2.prototype.norm = function(){
	return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
}
Vec2.prototype.normal = function(){
	let d = this.norm(this)
	if(d==0)return this.tiny_vec()
	return new Vec2(this.x/d,this.y/d)
}

// UIの生成
let text_bar = function(parent, val_name){
	console.log("テキストバー生成"+val_name)
	this.val_name = val_name
	this.val = [0,0]
	this.dom = document.createElement('div')
	parent.appendChild(this.dom)  // 生成したdomはここで追加しないといけない
	this.dom.setAttribute("class",'text_bar')
	this.update = function(param){
		this.val[1] = this.val[0]
		this.val[0] = param[this.val_name]
	}
	this.draw = function(){
		if(this.val[0]==this.val[1])return  // htmlの更新は必要がない限り極力避ける
		this.dom.innerHTML = ""+this.val[0]
	}
}
let slider = function(parent, val_name, init, min, max, step){
	console.log("slider生成"+val_name)
	this.val_name = val_name
	//sliderをまとめてwrapするdiv
	this.dom0 = document.createElement('div')
	parent.appendChild(this.dom0)  // 生成したdomはここで追加しないといけない
	this.dom0.setAttribute("class", "slider")
	// 変数名を表示するUI
	this.dom1 = document.createElement('div')
	this.dom1.setAttribute("class",'val_name')
	this.dom0.appendChild(this.dom1)
	this.dom1.innerHTML = this.val_name
	// 変数値を表示するUI
	this.dom2 = new text_bar(this.dom0, this.val_name)
	// つまみのUI
	this.dom3 = document.createElement('input')
	this.dom0.appendChild(this.dom3)
	this.dom3.setAttribute("type", "range")
	this.dom3.setAttribute("min", min)
	this.dom3.setAttribute("max", max)
	this.dom3.setAttribute("step", step)
	this.dom3.setAttribute("value", init)  // valueは最後に指定しないと初期値が指定できない
	//
	this.update = function(param){
		param[this.val_name] = Number(this.dom3.value)  // つまみの値を代入
		this.dom2.update(param)
	}
	this.draw = function(){
		this.dom2.draw()
	}
}
let slider_list = function(parent){
	// 自分自身
	this.dom = document.createElement('div')
	this.dom.setAttribute("class","slider_list")
	parent.appendChild(this.dom)
	// child
	this.UI = []
	this.add_slider = function(val_name, init, min, max, step){
		this.UI.push( new slider(this.dom, val_name, init, min, max, step) )  // slider_list自身を親要素にする
	}
	this.update = function(val){
		for (let i = 0; i < this.UI.length; i++) {
			this.UI[i].update(val)
		}
	}
	this.draw = function(){
		for (let i = 0; i < this.UI.length; i++) {
			this.UI[i].draw()
		}
	}
}
let canvas = function(w,h,parent){
	console.log("canvas生成("+w+","+h+")")
	this.w = w
	this.h = h
	this.dom = document.createElement('canvas')
	this.dom.setAttribute("width",w)
	this.dom.setAttribute("height",h)
	parent.appendChild(this.dom)  // 生成したdomはここで追加しないといけない
	this.act = function(){
	}
	this.draw = function(){
	}
}

// cellの定義
let cell = function(x,y,state){
	this.pos = new Vec2(x,y)
	this.state = [state,state]
}
cell.prototype.getNextGeneration = function(target, param){  // １つ前の状態を見て計算しないといけない
	let dx=[1,1,1,0,0,-1,-1,-1], dy=[1,0,-1,1,-1,1,0,-1], count=0
	for (let i = 0; i < dx.length; i++) {
		if(0>this.pos.x+dx[i] || this.pos.x+dx[i]>=param.w)continue
		if(0>this.pos.y+dy[i] || this.pos.y+dy[i]>=param.h)continue
		if(target[this.pos.y+dy[i]][this.pos.x+dx[i]].state[1]==1)count++
	}
	if(this.state[0]==0 && count==3){
		this.state[0]=1
		return
	}
	if(this.state[0]==1 && (count<=1 || count>=4)){
		this.state[0]=0
		return
	}
	return
}
cell.prototype.update = function(target, param){
	this.getNextGeneration(target, param)
}
cell.prototype.update2 = function(){
	this.state = [this.state[0],this.state[0]]
}
cell.prototype.draw = function(c, param){
	if(this.state[0]==0){
		c.fillStyle = "rgb(0,0,0)"
	}else if(this.state[0]==1){
		c.fillStyle = "rgb(255,255,255)"
	}
	c.beginPath()
	c.rect(this.pos.x*param.pixel_size, this.pos.y*param.pixel_size, param.pixel_size, param.pixel_size)
	c.fill()
}

// 全ての親。UIも計算も全部ここで管理する。
let master = function(w, h, pixel_size, dt, parent){
	console.log("masterObject生成")
	this.param = {  // agent以外で渡すものは全てここに入れる
		w:w,
		h:h,
		t:0,
		pixel_size:pixel_size,
		sim_coef:20,
		dt:dt / 20
	}
	this.parent = parent
	this.canvas = new canvas(w*pixel_size, h*pixel_size, parent)
	this.c = this.canvas.dom.getContext("2d")
	this.UI = []
	this.agent = []
	this.scene = {}
	var self = this  // ここがミソ（ここでthisを保持しないと、setIntervalのスコープに入ったときに動かなくなる）
	this.update = function(){
		// 目標の情報を与え、行動処理はオブジェクトに丸投げ
		for (let i = 0; i < this.agent.length; i++) {
			for (let j = 0; j < this.agent[i].length; j++) {
				this.agent[i][j].update(this.agent, this.param)
			}
		}
		// アルゴリズム的に、updateの後でもう一回更新しないといけない
		for (let i = 0; i < this.agent.length; i++) {
			for (let j = 0; j < this.agent[i].length; j++) {
				this.agent[i][j].update2()
			}
		}
		for (let i = 0; i < this.UI.length; i++) {
			this.UI[i].update(this.param)
		}
	}
	this.draw = function(){
		this.c.clearRect(0, 0, this.param.w, this.param.h)
		for (let i = 0; i < this.agent.length; i++) {
			for (let j = 0; j < this.agent[i].length; j++) {
				this.agent[i][j].draw(this.c, this.param)
			}
		}
		for (let i = 0; i < this.UI.length; i++) {
			this.UI[i].draw(this.c)
		}
	}
	this.loop = function(){
		// selfはthisが変わりそうなところにだけ入れればOK
		self.update()
		self.draw()
		self.param.t += self.param.dt
	}
	this.init = function(w, h){
		for (let i = 0; i < h; i++) {
			this.agent[i]=[]
			for (let j = 0; j < w; j++) {
				if(Math.random()<0.2){
					this.agent[i][j] = new cell(j,i,1)
				}else{
					this.agent[i][j] = new cell(j,i,0)
				}
			}
		}
		this.scene = setInterval(this.loop, this.param.dt*this.param.sim_coef)
		console.log("init end!")
	}
	this.init(w, h)
}

window.onload = function() {
	console.log("loaded")
	var gm = new master(100, 100, 5, 1000/30, document.getElementById("container"))
	console.log(gm)
}