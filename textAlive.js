let lyrics = []; //歌詞を格納する配列
let particle = [];
let prevChar;
let initX = halfFontSize;

//文字の一文字の情報を保持
class Character{
	constructor(x,y,char,ctx){
		this.x = x;
		this.y = y;
		this.char = char;
		this.isRemove = false;
		this.lifeTime = lifeTime;
		this.size = 0;
		this.ctx = ctx;
	}

	update(){
		let ctx = this.ctx;
		let defColor = ctx.fillStyle;
		ctx.fillStyle = fontColor;
		if(this.lifeTime >= lifeTime - FADE_IN_TIME){
			let p = Ease.circOut((lifeTime - this.lifeTime) / FADE_IN_TIME);
			this.size = fontSize * p;
			ctx.globalAlpha = p;
		}else if(this.lifeTime <= FADE_OUT_TIME){
			let p = Ease.circOut(this.lifeTime / FADE_OUT_TIME);
			this.size = fontSize * p + fontSize * 1.3 * (1 - p);
			ctx.globalAlpha = p;
		}else{
			this.size = fontSize;
			ctx.globalAlpha = 1.0;
		}

		ctx.font = this.size + "px " + fontFamily;
		ctx.fillText(this.char,this.x,this.y);
		if(this.lifeTime <= 0){
			this.isRemove = true;
		}
		this.lifeTime--;
		ctx.fillStyle = defColor;
		ctx.globalAlpha = 1.0;
	}
}

const PARTICLE_COUNT = 120;
const PARTICLE_COLOR = [
	"#ff8800",
	"#00ff88",
	"#ff00ff",
	"#ffffff",
	"#eeff88",
	"#ffee00"
];

class Particle{
	constructor(x,y,vx,vy,color,ctx){
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.color = color;
		this.ctx = ctx;
		this.lifeTime = 100;
		this.isRemove = false;
	}

	update(){
		let ctx = this.ctx;

		if(this.lifeTime < 50)ctx.globalAlpha = this.lifeTime / 50;
		else ctx.globalAlpha = 1.0;

		this.x += this.vx;
		this.y += this.vy;
		this.vy += 0.2;
		this.lifeTime--;
		if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.lifeTime <= 0){
			this.isRemove = true;
		}

		if(rand(0,100) < 60){
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x,this.y,2,0,Math.PI * 2,false);
			ctx.fill();
			if(this.lifeTime % 2 === 0)particle.push(new Afterimage(this.x,this.y,this.color,2,this.ctx));
		}
		ctx.globalAlpha = 1.0;
	}
}

class Fire{
	constructor(x,y,targetYPos,char,ctx){
		this.x = x;
		this.y = y;
		this.targetYPos = targetYPos;
		this.char = char;
		this.ctx = ctx;
		this.count = Date.now();
		this.color = PARTICLE_COLOR[rand(0,PARTICLE_COLOR.length - 1)];
		this.isRemove = false;
		this.frameCount = 0;
	}

	update(){
		let p = Ease.circOut((Date.now() - this.count) / duration);
		this.y = p * this.targetYPos + (1 - p) * canvas.height;
		if(this.frameCount % 2 === 0)particle.push(new Afterimage(this.x,this.y,this.color,5,this.ctx));

		if(p > 0.9){
			lyrics.push(new Character(this.x,this.y,this.char,this.ctx));
			let color;
			for(let i = 0;i < PARTICLE_COUNT;i++){
				let ang = Math.PI * Math.floor(Math.random() * 360) / 180;
				let speed = rand(5,10);
				let vx = Math.cos(ang) * speed;
				let vy = Math.sin(ang) * speed;
				if(i % (PARTICLE_COUNT / 3) === 0){
					color = PARTICLE_COLOR[rand(0,PARTICLE_COLOR.length - 1)];
				}
				particle.push(new Particle(this.x,this.y,vx,vy,color,this.ctx));
			}
			this.isRemove = true;
		}

		let ctx = this.ctx;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x,this.y,5,0,Math.PI * 2,false);
		ctx.fill();
		this.frameCount++;
	}
}

class Afterimage{
	constructor(x,y,color,radius,ctx){
		this.x = x;
		this.y = y;
		this.color = color;
		this.lifeTime = 10;
		this.ctx = ctx;
		this.radius = radius;
		this.isRemove = false;
	}

	update(){
		let ctx = this.ctx;
		ctx.globalAlpha = 1.0 * this.lifeTime / 10;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
		ctx.fill();
		if(--this.lifeTime === 0)this.isRemove = true;
		ctx.globalAlpha = 1.0;
	}
}

//イベント関連
player.addListener({
	onAppReady,
	//onTimerReady,
	//onTimeUpdate,
	onPlay,
	onPause,
	onStop,
	onAppParameterUpdate,
});

function onAppReady(app){
	if(app.managed){
		controll.style.display = "none";
	}else{
		//イベントリスナ登録
		fontSizeCtl.addEventListener("input",()=>{
			onAppParameterUpdate("fontSize",fontSizeCtl.value);
			setNumber(fontSizeCtl);
		});
		fontColorCtl.addEventListener("change",()=>{
			onAppParameterUpdate("fontColor",fontColorCtl.value);
		});
		displayTimeCtl.addEventListener("input",()=>{
			onAppParameterUpdate("displayTime",displayTimeCtl.value);
			setNumber(displayTimeCtl);
		});
	}
	if(!app.songUrl){ //デフォルトURL
		player.createFromSongUrl("https://www.youtube.com/watch?v=XSLhsjepelI");
	}
}

//let lyrics = [];
/*
function onTimerReady(){
	let char = player.video.firstChar;
	while(char && char.next){
		lyrics.push(char);
		char = char.next;
	}
}

function onTimeUpdate(position){
	let c = player.video.findChar(position);
	if(c !== null){
		let index = player.video.findIndex(c);

		if(currentLyricIndex != index){
			let cx = initXPos,cy;
			if(lyrics.length === 0){
				cy = Math.floor(Math.random() * (canvas.height - fontSize));
			}else{
				let min = Math.max(prevChar.baseY - nextRange,0);
				let max = Math.min(prevChar.baseY + nextRange,canvas.height - fontSize);
				cy = Math.floor(Math.random() * (max + 1 - min)) + min;
				if(prevChar.x + fontSize > initXPos){
					cx += prevChar.x + fontSize - initXPos;
				}
			}
			lyrics.push(new Character(cx,cy,c.text));
			prevChar = lyrics[lyrics.length - 1];
			currentLyricIndex = index;
		}
	}
}*/

let request;

function animation(){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillStyle = "#000000";
	context.fillRect(0,0,canvas.width,canvas.height);
	let c = player.video.findChar(player.timer.position + duration);
	if(c !== null){
		let index = player.video.findIndex(c);
		if(currentLyricIndex != index){
			let cx = initX;
			let cy = canvas.height;
			let targetYPos = rand(halfFontSize,canvas.height - halfFontSize); //最終的に到達する座標
			particle.push(new Fire(cx,cy,targetYPos,c,context));
			currentLyricIndex = index;
			initX += fontSize;
			if(initX + halfFontSize > canvas.width){
				initX = halfFontSize;
			}
		}
	}
	for(const p of particle){
		p.update();
	}
	particle = particle.filter(par => !par.isRemove); //頂点に達したか範囲外のパーティクルは消去

	for(const char of lyrics){
		char.update();
	}
	lyrics = lyrics.filter(char => !char.isRemove); //範囲外の文字は消去
	request = requestAnimationFrame(animation);
}

function onPlay(){
	animation();
}

function onPause(){
	cancelAnimationFrame(request);
}

function onStop(){
	onPause();
}

function onAppParameterUpdate(name,value){
	switch(name){
		case "fontSize":
			fontSize = parseInt(value);
			halfFontSize = fontSize / 2;
			context.font = fontSize + "px sans-serif";
			break;
		case "fontColor":
			fontColor = colorToString(value);
			break;
		case "displayTime":
			wait = parseInt(value);
			lifeTime = wait + FADE_IN_TIME + FADE_OUT_TIME;
			break;
	}
}
