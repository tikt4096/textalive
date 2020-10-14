import * as func from "./function.js";

let canvasWidth,canvasHeight;
let afterimageFunc;

export class Particle{
	constructor(x,y,vx,vy,color,radius,ctx){
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.color = color;
		this.radius = radius;
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
		if(this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight || this.lifeTime <= 0){
			this.isRemove = true;
		}

		if(func.rand(0,100) < 60){
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);
			ctx.fill();
			if(this.lifeTime % 2 === 0)afterimageFunc(this.x,this.y,this.color,this.radius,this.ctx);
		}
		ctx.globalAlpha = 1.0;
	}

	static init(init){
		canvasWidth = init.canvasWidth;
		canvasHeight = init.canvasHeight;
		afterimageFunc = init.afterimageFunc;
	}

	static setCanvasWidth(width){
		canvasWidth = width;
	}

	static setCanvasHeight(height){
		canvasHeight = height;
	}
}
