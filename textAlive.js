let lyrics = []; //歌詞を格納する配列
let particle = [];
let prevChar;

//文字の一文字の情報を保持
class Character{
	constructor(x,y,char,ctx){
		this.x = x;
		this.y = y;
		this.char = char;
		this.isRemove = false;
		this.count = 0;
		this.ctx = ctx;
	}

	update(){
		let defColor = this.ctx.fillStyle;
		this.ctx.fillStyle = fontColor;
		this.ctx.fillText(this.char,this.x,this.y);
		if(this.count >= wait){
			this.isRemove = true;
		}
		this.count++;
		this.ctx.fillStyle = defColor;
	}
}

const PARTICLE_COUNT = 100;

const PARTICLE_RISE = 0;
const PARTICLE_PEEK = 1;
const PARTICLE_EXPLOSION = 2;
const PARTICLE_DESTROY = 3;
const PARTICLE_EXPMOVE = 4;

class Particle{
	constructor(x,y,vx,vy,targetYPos,c,ctx,initStatus){
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.targetYPos = targetYPos;
		this.char = c;
		this.status = initStatus;
		this.ctx = ctx;
		this.lifeTime = 20;
	}

	update(){
		let ctx = this.ctx;

		ctx.beginPath();
		ctx.arc(this.x,this.y,5,0,Math.PI * 2,false);
		ctx.fill();
		this.x += this.vx;
		this.y += this.vy;
		this.vy += 0.4;
		if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height){
			this.status = PARTICLE_DESTROY;
		}

		switch(this.status){
			case PARTICLE_RISE:
				if(this.y < this.targetYPos || this.vy > 0){
					this.status = PARTICLE_PEEK;
				}
				break;
			case PARTICLE_PEEK:
				if(this.char !== null){
					lyrics.push(new Character(this.x - fontSize / 2,this.y - fontSize / 2,this.char,this.ctx));
				}
				this.status = PARTICLE_EXPLOSION;
				break;
			case PARTICLE_EXPLOSION:
				for(let i = 0;i < PARTICLE_COUNT;i++){
					let ang = Math.PI * Math.floor(Math.random() * 360) / 180;
					let speed = Math.floor(Math.random() * 100);
					let vx = Math.cos(ang) * speed;
					let vy = Math.sin(ang) * speed;
					particle.push(new Particle(this.x,this.y,vx,vy,0,null,this.ctx,PARTICLE_EXPMOVE));
				}
				this.status = PARTICLE_DESTROY;
				break;
			case PARTICLE_EXPMOVE:
				this.lifeTime--;
				if(this.lifeTime <= 0){
					this.status = PARTICLE_DESTROY;
				}
				break;
		}
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
	let c = player.video.findChar(player.timer.position + duration);
	if(c !== null){
		let index = player.video.findIndex(c);
		if(currentLyricIndex != index){
			let cx = Math.floor(Math.random() * (canvas.width - fontSize / 2 + 1));
			let cy = canvas.height;
			let targetYPos = Math.floor(Math.random() * (cy - fontSize / 2 + 1)); //最終的に到達する座標
			let vy = -((cy - targetYPos) / duration * 16.67); //1フレームあたりに進む距離(1フレーム=大体16.67ms)
			particle.push(new Particle(cx,cy,0,vy,targetYPos,c,context,PARTICLE_RISE));
			currentLyricIndex = index;
		}
	}
	for(const p of particle){
		p.update();
	}
	particle = particle.filter(par => par.status != PARTICLE_DESTROY); //頂点に達したパーティクルは消去

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
			context.font = fontSize + "px sans-serif";
			break;
		case "fontColor":
			fontColor = colorToString(value);
			break;
	}
}
