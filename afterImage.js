export class Afterimage{
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
