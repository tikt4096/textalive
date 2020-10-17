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
	constructor(count,min,max,radius,ctx){
		this.count = count;
		this.min = min;
		this.max = max;
		this.radius = radius;
		this.ctx = ctx;
	}

	run(x,y){
		let color = "";
		let arr = [];
		for(let i = 0;i < this.count;i++){
			let ang = func.rand(0,360) / 180 * Math.PI;
			let speed = func.rand(this.min,this.max);
			let vx = Math.cos(ang) * speed;
			let vy = Math.sin(ang) * speed;
			if(i % Math.floor(this.count / 3) == 0){
				color = PARTICLE_COLOR[func.rand(0,PARTICLE_COLOR.length - 1)];
			}
			arr.push(new Particle(x,y,vx,vy,color,this.radius,this.ctx));
		}
		return arr;
	}

	set particleCount(count){
		this.count = count;
	}
}
