// ベクトルライブラリ
// jsでは演算子のオーバーロードが出来ないのがつらい
let Vec2 = function(x,y){
	this.x = x
	this.y = y
	this.tiny_vec = function(){  // 小さいランダムベクトルを生成することで、要素同士の重なりを防ぐ
		return new Vec2(Math.random()*0.01-0.005, Math.random()*0.01-0.005)
	}
	this.copy = function(){
		return new Vec2(this.x, this.y)
	}
	this.add = function(v){
		return new Vec2(this.x+v.x, this.y+v.y)
	}
	this.sub = function(v){
		return new Vec2(this.x-v.x, this.y-v.y)
	}
	this.mul = function(a){
		if(a==Infinity || a==-Infinity)return this.tiny_vec()  // こうすると自分の実装では都合がいい
		return new Vec2(this.x*a, this.y*a)
	}
	this.norm = function(){
		return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
	}
	this.normal = function(){
		let d = this.norm(this)
		if(d==0)return this.tiny_vec()
		return new Vec2(this.x/d,this.y/d)
	}
}

// UIの生成
let text_bar = function(val_name, parent){
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
let slider = function(val_name, parent, val, min, max, step){
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
	this.dom2 = new text_bar(this.val_name, this.dom0)
	// つまみのUI
	this.dom3 = document.createElement('input')
	this.dom0.appendChild(this.dom3)
	this.dom3.setAttribute("type", "range")
	this.dom3.setAttribute("min", min)
	this.dom3.setAttribute("max", max)
	this.dom3.setAttribute("step", step)
	this.dom3.setAttribute("value", val)  // valueは最後に指定しないと初期値が指定できない
	//
	this.update = function(param){
		param[this.val_name] = Number(this.dom3.value)  // つまみの値を代入
		this.dom2.update(param)
	}
	this.draw = function(){
		this.dom2.draw()
	}
}
let slider_list = function(val_names, parent){
	// 自分自身
	this.val_names = val_names
	this.dom = document.createElement('div')
	this.dom.setAttribute("class","slider_list")
	parent.appendChild(this.dom)
	// child
	this.UI = []
	for (let i = 0; i < this.val_names.length; i++) {
		this.UI[i] = new slider(this.val_names[i], this.dom, 0.03, 0, 0.2, 0.003)  // slider_list自身を親要素にする
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

// 魚群もどきの定義
let boid = function(id,x,y,vx,vy){
	this.id = id
	this.mass = 3.0
	this.pos = new Vec2(x,y)
	this.v = new Vec2(vx,vy)
	this.GetSeparation = function(target, param){  // 周囲から離れる
		let a = new Vec2(0,0)
		for (let i = 0; i < target.length; i++) {
			if(i==this.id)continue
			let d = target[i].pos.sub(this.pos)  // 相対位置
			if(d.norm() > param.separationRadius)continue
			d = d.normal()  // 離れるときは一定の力？
			a = a.add(d.mul(-1))
		}
		return a
	}
	this.GetAlignment = function(target, param){  // 周囲と向きを揃える
		let a = new Vec2(0,0)
		for (let i = 0; i < target.length; i++) {
			if(i==this.id)continue
			let d = target[i].pos.sub(this.pos)  // 相対位置
			if(d.norm() > param.mateRadius)continue
			a = a.add(target[i].v)
		}
		return a
	}
	this.GetCohesion = function(target, param){  // 周囲の重心に集まる
		let a = new Vec2(0,0)
		for (let i = 0; i < target.length; i++) {
			if(i==this.id)continue
			let d = target[i].pos.sub(this.pos)  // 相対位置
			if(d.norm() > param.mateRadius)continue
			a = a.add(d)
		}
		return a
	}
	this.update = function(target, param){
		let fs = [this.GetSeparation(target,param), this.GetAlignment(target,param), this.GetCohesion(target,param)]
		let coef = [param.separationCoef, param.alignmentCoef, param.cohesionCoef]
		let f = new Vec2(0,0)
		for (let i = 0; i < fs.length; i++) {
			f = f.add(fs[i].mul(coef[i]))
		}
		let a = f.mul(1/this.mass)  // 力を加速度に変換
		this.v = this.v.add(a.mul(param.dt))
		if(this.v.norm() > param.maxVelocity){  // 速度制限をつけた
			this.v = this.v.normal()
			this.v = this.v.mul(param.maxVelocity)
		}
		this.pos = this.pos.add(this.v.mul(param.dt))
		if(this.pos.x > param.w)this.pos.x-=param.w
		if(this.pos.x < 0)this.pos.x+=param.w
		if(this.pos.y > param.h)this.pos.y-=param.h
		if(this.pos.y < 0)this.pos.y+=param.h
	}
	this.draw = function(c){
		c.fillStyle = "rgb(255,0,0)"
		c.beginPath()
		c.arc(this.pos.x, this.pos.y, 2, 0, Math.PI*2)
		c.fill()
	}
}

// 全ての親。UIも計算も全部ここで管理する。
let master = function(agentNum, w, h, dt, parent){
	console.log("masterObject生成")
	this.param = {  // agent以外で渡すものは全てここに入れる
		separationCoef:0.03,
		alignmentCoef:0.03,
		cohesionCoef:0.03,
		mateRadius:30,
		separationRadius:60,
		maxVelocity:2,
		w:w,
		h:h,
		t:0,
		sim_coef:10,
		dt:dt / 10
	}
	this.parent = parent
	this.canvas = new canvas(w, h, parent)
	this.c = this.canvas.dom.getContext("2d")
	this.agent = []
	this.UI = []
	this.scene = {}
	var self = this  // ここがミソ（ここでthisを保持しないと、setIntervalのスコープに入ったときに動かなくなる）
	this.update = function(){
		// 目標の情報を与え、行動処理はオブジェクトに丸投げ
		for (let i = 0; i < this.agent.length; i++) {
			this.agent[i].update(this.agent, this.param)
		}
		for (let i = 0; i < this.UI.length; i++) {
			this.UI[i].update(this.param)
		}
	}
	this.draw = function(){
		this.c.clearRect(0, 0, this.param.w, this.param.h)
		for (let i = 0; i < this.agent.length; i++) {
			this.agent[i].draw(this.c)
		}
		for (let i = 0; i < this.UI.length; i++) {
			this.UI[i].draw()
		}
	}
	this.loop = function(){
		// selfはthisが変わりそうなところにだけ入れればOK
		self.update()
		self.draw()
		self.param.t += self.param.dt
	}
	this.init = function(agentNum){
		this.UI[0] = new slider_list(["separationCoef","alignmentCoef","cohesionCoef"], parent)
		for (let i = 0; i < agentNum; i++) {
			this.agent[i] = new boid(i, Math.random()*this.param.w, Math.random()*this.param.h, Math.random()*1.4-0.7, Math.random()*1.4-0.7, 60)
		}
		this.scene = setInterval(this.loop, this.param.dt*this.param.sim_coef)
	}
	this.init(agentNum)
}

window.onload = function() {
	console.log("loaded")
	var gm = new master(250, 800, 480, 1000/60, document.getElementById("container"))
	console.log(gm)
}