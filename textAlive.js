import * as func from "./function.js";
import {Fire} from "./fire.js";
import {Character} from "./character.js";
import {Particle} from "./particle.js";
import {Afterimage} from "./afterImage.js";
import {Explosion} from "./explosion.js";

const {Player,Ease} = TextAliveApp;

const canDiv = document.getElementById("container");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

const controll = document.getElementById("controller");

//各コントロール
const fontSizeCtl = document.getElementById("font_size");
const fontColorCtl = document.getElementById("font_color");
const displayTimeCtl = document.getElementById("disply_time");

func.setRange(fontSizeCtl,10,300);
func.setRange(displayTimeCtl,10,100);

resize();

//デフォルト値
const DEFAULT_FONT_SIZE = 90; //フォントサイズ(px)
const DEFAULT_FONT_COLOR = "#00FF88"; //フォントの色
const DEFAULT_DURATION = 700; //文字出現までの時間(ms)
const DEFAULT_WAIT = 40; //文字を表示する時間(f)
const DEFAULT_FONT_FAMILY = "sans-serif"; //使用フォント

//現在値
let fontSize = DEFAULT_FONT_SIZE;
let halfFontSize = fontSize / 2;
let fontColor = DEFAULT_FONT_COLOR;
let duration = DEFAULT_DURATION;
let wait = DEFAULT_WAIT;
let fontFamily = DEFAULT_FONT_FAMILY;

func.setValue(fontSizeCtl,fontSize);
func.setValue(fontColorCtl,fontColor);
func.setValue(displayTimeCtl,wait);

const player = new Player({
	app: {
		appAuthor: "ToykoItomimizu",
		appName: "hanabi",
		parameters:[
			{
				title: "フォントサイズ",
				name: "fontSize",
				className: "Slider",
				params: [10,300],
				initialValue: DEFAULT_FONT_SIZE
			},
			{
				title: "フォントの色",
				name: "fontColor",
				className: "Color",
				initialValue: DEFAULT_FONT_COLOR
			},
			{
				title: "文字の表示時間（フレーム）",
				name: "displayTime",
				className: "Slider",
				params: [10,100],
				initialValue: DEFAULT_WAIT
			}
		]
	},
	mediaElement: document.querySelector("#media")
});

canvasInit();
canDiv.appendChild(canvas);

let currentLyricIndex = -1;

//リサイズ時のイベント登録
window.addEventListener("resize",()=>{
	resize();
	canvasInit();
});

function canvasInit(){
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.font = fontSize + "px " + fontFamily;
}

function resize(){
	canvas.width = canDiv.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	Fire.setCanvasHeight(canvas.height);
	Particle.setCanvasWidth(canvas.width);
	Particle.setCanvasHeight(canvas.height);
}

let particle = [];
let initX = halfFontSize;

Fire.init({
	canvasWidth: canvas.width,
	canvasHeight: canvas.height,
	easeFunc: Ease.circOut,
	charInfo:{
		wait: wait,
		color: fontColor,
		size: fontSize,
		family: fontFamily
	},
	particleFunc: addParticle,
	characterFunc: addCharacter,
	afterimageFunc: addAfterimage
});

Particle.init({
	canvasWidth: canvas.width,
	canvasHeight: canvas.height,
	afterimageFunc: addAfterimage
});

//イベント関連
player.addListener({
	onAppReady,
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
			func.setNumber(fontSizeCtl);
		});
		fontColorCtl.addEventListener("change",()=>{
			onAppParameterUpdate("fontColor",fontColorCtl.value);
		});
		displayTimeCtl.addEventListener("input",()=>{
			onAppParameterUpdate("displayTime",displayTimeCtl.value);
			func.setNumber(displayTimeCtl);
		});
	}
	if(!app.songUrl){ //デフォルトURL
		player.createFromSongUrl("https://www.youtube.com/watch?v=XSLhsjepelI");
	}
}

function mouseClick(e){
	let canPos = canvas.getBoundingClientRect();
	let x = e.pageX - canPos.left - window.pageXOffset;
	let y = e.pageY - canPos.top - window.pageYOffset;
	let exp = new Explosion(100,x,y,5,10,2,context);
	particle = particle.concat(exp.run());
}

let request;

function animation(){
	context.clearRect(0,0,canvas.width,canvas.height);
	context.fillStyle = "#000000";
	context.fillRect(0,0,canvas.width,canvas.height); //背景
	let c = player.video.findChar(player.timer.position + duration);
	if(c !== null){
		let index = player.video.findIndex(c);
		if(currentLyricIndex != index){
			let cx = initX;
			let cy = canvas.height;
			let targetYPos = func.rand(halfFontSize,canvas.height - halfFontSize); //最終的に到達する座標
			particle.push(new Fire(cx,cy,targetYPos,c,duration,context));
			currentLyricIndex = index;
			initX += fontSize;
			if(initX + halfFontSize > canvas.width){
				initX = halfFontSize;
			}
		}
	}
	for(const p of particle){
		p.update();
	}
	particle = particle.filter(par => !par.isRemove); //頂点に達したか範囲外のパーティクルは消去
	request = requestAnimationFrame(animation);
}

function addAfterimage(x,y,color,radius,ctx){
	particle.push(new Afterimage(x,y,color,radius,ctx));
}

function addCharacter(x,y,char,charInfo,ease,ctx){
	particle.push(new Character(x,y,char,charInfo,ease,ctx));
}

function addParticle(x,y,vx,vy,color,radius,ctx){
	particle.push(new Particle(x,y,vx,vy,color,radius,ctx));
}

function onPlay(){
	animation();
	canvas.addEventListener("click",mouseClick);
}

function onPause(){
	cancelAnimationFrame(request);
	canvas.removeEventListener("click",mouseClick);
}

function onStop(){
	onPause();
}

function onAppParameterUpdate(name,value){
	switch(name){
		case "fontSize":
			fontSize = parseInt(value);
			halfFontSize = fontSize / 2;
			context.font = fontSize + "px sans-serif";
			break;
		case "fontColor":
			fontColor = func.colorToString(value);
			break;
		case "displayTime":
			wait = parseInt(value);
			break;
	}
	Fire.setCharInfo({
			wait: wait,
			size: fontSize,
			color: fontColor,
			family: fontFamily
	});
}
