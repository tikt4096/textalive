import * as func from "./function.js";

const PARTICLE_COUNT = 120;
const PARTICLE_COLOR = [
	"#ff8800",
	"#00ff88",
	"#ff00ff",
	"#ffffff",
	"#eeff88",
	"#ffee00"
];

let canvasHeight;
let easeFunc = null;
let afterimageFunc,particleFunc,characterFunc;
let charInfo;

export class Fire{
	constructor(x,y,targetYPos,char,duration,ctx){
		this.x = x;
		this.y = y;
		this.targetYPos = targetYPos;
		this.char = char;
		this.ctx = ctx;
		this.count = Date.now();
		this.color = PARTICLE_COLOR[func.rand(0,PARTICLE_COLOR.length - 1)];
		this.isRemove = false;
		this.frameCount = 0;
		this.duration = duration;
	}

	update(){
		let p = easeFunc((Date.now() - this.count) / this.duration);
		this.y = p * this.targetYPos + (1 - p) * canvasHeight;
		if(this.frameCount % 2 === 0)afterimageFunc(this.x,this.y,this.color,5,this.ctx);

		if(p > 0.9){
			characterFunc(this.x,this.y,this.char,charInfo,easeFunc,this.ctx);
			let color;
			for(let i = 0;i < PARTICLE_COUNT;i++){
				let ang = Math.PI * Math.floor(Math.random() * 360) / 180;
				let speed = func.rand(5,10);
				let vx = Math.cos(ang) * speed;
				let vy = Math.sin(ang) * speed;
				if(i % (PARTICLE_COUNT / 3) === 0){
					color = PARTICLE_COLOR[func.rand(0,PARTICLE_COLOR.length - 1)];
				}
				particleFunc(this.x,this.y,vx,vy,color,this.ctx);
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

	static init(init){
		canvasHeight = init.canvasHeight;
		easeFunc = init.easeFunc;
		particleFunc = init.particleFunc;
		characterFunc = init.characterFunc;
		afterimageFunc = init.afterimageFunc;
		charInfo = init.charInfo;
	}

	static setCanvasHeight(height){
		canvasHeight = height;
	}

	static setCharInfo(paramCharInfo){
		charInfo = paramCharInfo;
	}
}
