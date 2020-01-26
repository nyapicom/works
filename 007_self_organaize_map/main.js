// ベクトルライブラリ
// jsでは演算子のオーバーロードが出来ないのがつらい
let Vec2 = function(x,y){
	this.x = x
	this.y = y
}
Vec2.prototype = {
	clone : function(){
		return new Vec2(this.x, this.y)
	},
	tiny_vec : function(){  // 小さいランダムベクトルを生成することで、要素同士の重なりを防ぐ
		return new Vec2(Math.random()*0.01-0.005, Math.random()*0.01-0.005)
	},
	add : function(v){
		return new Vec2(this.x+v.x, this.y+v.y)
	},
	sub : function(v){
		return new Vec2(this.x-v.x, this.y-v.y)
	},
	mul : function(a){
		if(a==Infinity || a==-Infinity)return this.tiny_vec()  // こうすると自分の実装では都合がいい
		return new Vec2(this.x*a, this.y*a)
	},
	prod : function(v){
		return new Vec2(this.x*v.x, this.y*v.y)
	},
	norm : function(){
		return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
	},
	normal : function(){
		return this.mul(1/this.norm())
	},
	scale : function(a){
		return this.normal().mul(a);
	},
	truncate : function(a){
		if(this.norm()>a)return this.scale(a)
		return this
	}
}

let Vec = function(v){
	this.v = []
	this.init(v)
}
Vec.prototype = {
	init : function(v){
		for(let i=0; i<v.length; i++){
			this.v[i]=v[i]
		}
	},
	clone : function(){
		return new Vec(this.v)
	},
	add : function(v){
		for(let i=0; i<this.v.length; i++){
			this.v[i]+=v.v[i]
		}
		return this
	},
	sub : function(v){
		for(let i=0; i<this.v.length; i++){
			this.v[i]-=v.v[i]
		}
		return this
	},
	mul : function(a){
		for(let i=0; i<this.v.length; i++){
			this.v[i]*=a
		}
		return this
	},
	dot : function(v){
		let ans=0
		for(let i=0; i<this.v.length; i++){
			ans += this.v[i]*v.v[i]
		}
		return ans
	},
	norm : function(){
		let ans=0
		for(let i=0; i<this.v.length; i++){
			ans += this.v[i]*this.v[i]
		}
		return Math.sqrt(ans)
	},
	normal : function(){
		this.mul(1/this.norm())
		return this
	},
	scale : function(a){
		this.normal().mul(a)
		return this
	},
	truncate : function(a){
		if(this.norm()>a)this.scale(a)
		return this
	},
	cos_sim : function(v){
		return this.clone().normal().dot(v.clone().normal())
	}
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
let canvas = function(h, w, parent){
	console.log("canvas生成("+h+","+w+")")
	this.h = h
	this.w = w
	this.dom = document.createElement('canvas')
	this.dom.setAttribute("height",h)
	this.dom.setAttribute("width",w)
	parent.appendChild(this.dom)  // 生成したdomはここで追加しないといけない
	this.act = function(){
	}
	this.draw = function(){
	}
}

// cellの定義
let som = function(h, w){
	this.h = h
	this.w = w
	this.t = 0
	this.cell = []
	this.init()
}
som.prototype = {
	init : function(){
		for (let i = 0; i < this.h; i++) {
			this.cell[i] = []
			for (let j = 0; j < this.w; j++) {
				this.cell[i][j] = new Vec( [Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256)] )
			}
		}
		this.t=0
	},
	find_closest : function(data){
		let index = [0,0], dist = 1e18
		for (let i = 0; i < this.h; i++) {
			for (let j = 0; j < this.w; j++) {
				let d = this.cell[i][j].clone().sub(data).norm()
				if(dist>d){
					dist=d
					index=[i,j]
				}
			}
		}
		return index
	},
	learn : function(index, data, t){
		this.cell[index[0]][index[1]].mul(1.0-t).add(data.mul(t))
	},
	gauss : function(sigma,d2){
		return Math.exp(-d2/(2*sigma*sigma))
	},
	update : function(data){
		// データを学習する
		let index = this.find_closest(data)
		let y=index[0],x=index[1]
		let sigma = 3.0/(1+this.t*0.000001)
		let r = Math.ceil(sigma)
		for (let i = -2*r; i <= 2*r; i++) {
			for (let j = -2*r; j <= 2*r; j++) {
				if(0>x+j || x+j>=this.w)continue
				if(0>y+i || y+i>=this.h)continue
				this.learn([y+i,x+j], data.clone(), this.gauss(sigma, i*i+j*j))
			}
		}
		if(Math.random()<0.00001)console.log(r)
		this.t++
	},
	draw : function(c, param){
		for (let i = 0; i < this.h; i++) {
			for (let j = 0; j < this.w; j++) {
				c.fillStyle = `rgb(${Math.floor(this.cell[i][j].v[0])},${Math.floor(this.cell[i][j].v[1])},${Math.floor(this.cell[i][j].v[2])})`
				c.beginPath()
				c.rect(j*param.pixel_size, i*param.pixel_size, param.pixel_size, param.pixel_size)
				c.fill()
			}
		}
		
	}
}

// 全ての親。UIも計算も全部ここで管理する。
let master = function(h, w, dt, parent){
	console.log("masterObject生成")
	this.param = {  // agent以外で渡すものは全てここに入れる
		h:h,
		w:w,
		t:0,
		pixel_size:10,
		dt:dt
	}
	this.parent = parent
	this.canvas = new canvas(this.param.w*this.param.pixel_size, this.param.h*this.param.pixel_size, this.parent)
	this.c = this.canvas.dom.getContext("2d")
	this.agent = []
	this.scene = {}
	var self = this  // ここがミソ（ここでthisを保持しないと、setIntervalのスコープに入ったときに動かなくなる）
	this.loop = function(){
		// selfはthisが変わりそうなところにだけ入れればOK
		for(let i=0;i<1000;i++)self.update()
		self.draw()
		self.param.t++
	}
	this.init()
}
master.prototype = {
	init : function(){
		this.agent[0] = new som(this.param.h, this.param.w)
		this.scene = setInterval(this.loop, this.param.dt)
		console.log("init end!")
	},
	update : function(){
		// 目標の情報を与え、行動処理はオブジェクトに丸投げ
		for (let i = 0; i < this.agent.length; i++) {
			this.agent[i].update(new Vec([Math.floor(Math.random()*256),Math.floor(Math.random()*256),Math.floor(Math.random()*256)]))
		}
	},
	draw : function(){
		this.c.clearRect(0, 0, this.param.w, this.param.h)
		for (let i = 0; i < this.agent.length; i++) {
			this.agent[i].draw(this.c, this.param)
		}
	}
}

window.onload = function() {
	console.log("loaded")
	var gm = new master(40, 40, 1000/30, document.getElementById("container"))
	console.log(gm)
}