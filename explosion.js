import * as func from "./function.js";
import {Particle} from "./particle.js";

const PARTICLE_COLOR = [
	"#ff8800",
	"#00ff88",
	"#ff00ff",
	"#ffffff",
	"#eeff88",
	"#ffee00"
];

export class Explosion{
	constructor(count,x,y,min,max,radius,ctx){
		this.count = count;
		this.x = x;
		this.y = y;
		this.min = min;
		this.max = max;
		this.radius = radius;
		this.ctx = ctx;
		this.arr = [];
	}

	run(){
		let color = "";
		for(let i = 0;i < this.count;i++){
			let ang = func.rand(0,360) / 180 * Math.PI;
			let speed = func.rand(this.min,this.max);
			let vx = Math.cos(ang) * speed;
			let vy = Math.sin(ang) * speed;
			if(i % Math.floor(this.count / 3) == 0){
				color = PARTICLE_COLOR[func.rand(0,PARTICLE_COLOR.length - 1)];
			}
			this.arr.push(new Particle(this.x,this.y,vx,vy,color,this.radius,this.ctx));
		}
		return this.arr;
	}
}
