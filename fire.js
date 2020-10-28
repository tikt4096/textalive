import * as func from "./function.js";
import {Explosion} from "./explosion.js";

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
let afterimageFunc,characterFunc;

export class Fire{
	constructor(particleCount,x,y,targetYPos,char,duration,ctx){
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
		this.exp = new Explosion(particleCount,5,10,2,this.ctx);
		this.arr = [];
	}

	update(){
		let p = easeFunc((Date.now() - this.count) / this.duration);
		this.y = p * this.targetYPos + (1 - p) * canvasHeight;
		if(this.frameCount % 2 === 0)afterimageFunc(this.x,this.y,this.color,5,this.ctx);

		if(p > 0.9){
			if(this.char !== null)characterFunc(this.x,this.y,this.char,easeFunc,this.ctx);
			
			this.arr = this.arr.concat(this.exp.run(this.x,this.y));
			this.isRemove = true;
		}

		let ctx = this.ctx;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x,this.y,5,0,Math.PI * 2,false);
		ctx.fill();
		this.frameCount++;
	}

	particleArr(){
		return this.arr;
	}

	static init(init){
		canvasHeight = init.canvasHeight;
		easeFunc = init.easeFunc;
		characterFunc = init.characterFunc;
		afterimageFunc = init.afterimageFunc;
	}

	static set setCanvasHeight(height){
		canvasHeight = height;
	}
}
