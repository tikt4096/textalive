export class Mosaic{
	constructor(divSize,size,fontFamily){
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.divSize = divSize;
		this.mosaicPixelNum = this.divSize * this.divSize;
		this.fontSize = size;
		this.canvas.width = this.fontSize + ((this.fontSize % this.divSize) ? this.divSize - this.fontSize % this.divSize : 0);
		this.canvas.height = this.fontSize + ((this.fontSize % this.divSize) ? this.divSize - this.fontSize % this.divSize : 0);
		this.ctx.font = size + "px " + fontFamily;
		this.ctx.textAlign = "left";
		this.ctx.textBaseline = "top";
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.fillStyle = "#000000";
	}
	
	makeCharMosaic(char){
		this.ctx.fillText(char,0,0);
		let num = this.canvas.width / this.divSize;
		let imgData = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height);
		let data = imgData.data;
		let mosaic = new Array(num * num);
		for(let i = 0;i < num;i++){
			for(let j = 0;j < num;j++){
				let sum = 0;
				for(let k = 0;k < this.mosaicPixelNum;k++){
					let x = j * this.divSize + k % this.divSize;
					let y = i * this.divSize + Math.floor(k / this.divSize);
					let index = (y * this.canvas.width + x) * 4;
					if(data[index] === 0 && data[index + 1] === 0 && data[index + 2] === 0){
						sum++;
					}
				}
				if(sum != 0){
					mosaic[j + i * num] = true;
				}else{
					mosaic[j + i * num] = false;
				}
			}
		}
		return {num,mosaic};
	}
}
