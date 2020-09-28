//文字がフェードイン・アウトする時間(f)
const FADE_IN_TIME = 30;
const FADE_OUT_TIME = 30;

//文字の一文字の情報を保持
export class Character{
	constructor(x,y,char,charInfo,ease,ctx){
		this.x = x;
		this.y = y;
		this.char = char;
		this.isRemove = false;
		this.maxLifeTime = charInfo.wait + FADE_IN_TIME + FADE_OUT_TIME;
		this.lifeTime = this.maxLifeTime;
		this.fontSize = charInfo.size;
		this.fontColor = charInfo.color;
		this.fontFamily = charInfo.family;
		this.size = 0;
		this.easeFunc = ease;
		this.ctx = ctx;
	}

	update(){
		let ctx = this.ctx;
		let defColor = ctx.fillStyle;
		let defAlpha = ctx.globalAlpha;
		ctx.fillStyle = this.fontColor;
		if(this.lifeTime >= this.maxLifeTime - FADE_IN_TIME){
			let p = this.easeFunc((this.maxLifeTime - this.lifeTime) / FADE_IN_TIME);
			this.size = this.fontSize * p;
			ctx.globalAlpha = p;
		}else if(this.lifeTime <= FADE_OUT_TIME){
			let p = this.easeFunc(this.lifeTime / FADE_OUT_TIME);
			this.size = this.fontSize * p + this.fontSize * 1.3 * (1 - p);
			ctx.globalAlpha = p;
		}else{
			this.size = this.fontSize;
			ctx.globalAlpha = 1.0;
		}

		ctx.font = this.size + "px " + this.fontFamily;
		ctx.fillText(this.char,this.x,this.y);
		if(this.lifeTime <= 0){
			this.isRemove = true;
		}
		this.lifeTime--;
		ctx.fillStyle = defColor;
		ctx.globalAlpha = defAlpha;
	}
}
