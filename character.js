import {Mosaic} from "./mosaic.js";
import * as func from "./function.js";

//文字がフェードイン・アウトする時間(f)
const FADE_IN_TIME = 30;
const FADE_OUT_TIME = 30;

const MOSAIC_SIZE = 4; //文字の分割サイズ(px)

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
		this.mosaic = new Mosaic(MOSAIC_SIZE,this.fontSize);
		this.cMosaic = this.mosaic.makeCharMosaic(this.char);
		this.pSize = Math.floor(this.fontSize / this.cMosaic.num);
	}

	update(){
		let ctx = this.ctx;
		let defColor = ctx.fillStyle;
		let defAlpha = ctx.globalAlpha;
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

		//文字を描画
		let mosaic = this.cMosaic.mosaic;
		for(let i = 0;i < mosaic.length;i++){
			if(mosaic[i] && func.rand(0,99) < 90){
				if(func.rand(0,99) < 40){
					ctx.fillStyle = "#ffffff";
				}else{
					ctx.fillStyle = this.fontColor;
				}
				let n = this.size / this.cMosaic.num;
				let x = i % this.cMosaic.num * n - this.size / 2;
				let y = Math.floor(i / this.cMosaic.num) * n - this.size / 2;
				ctx.beginPath();
				ctx.arc(this.x + x,this.y + y,this.pSize / 2,0,Math.PI * 2,false);
				ctx.fill();
			}
		}
		if(this.lifeTime <= 0){
			this.isRemove = true;
		}
		this.lifeTime--;
		ctx.fillStyle = defColor;
		ctx.globalAlpha = defAlpha;
	}
}
