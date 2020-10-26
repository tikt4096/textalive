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

let maxY = 0; //文字出現のY座標上限値

const controll = document.querySelector(".controll_cnt");

//各コントロール
const fontSizeCtl = document.getElementById("font_size");
const fontColorCtl = document.getElementById("font_color");
const displayTimeCtl = document.getElementById("disply_time");
const particleCountCtl = document.getElementById("particle_count");

//下限と上限
const RANGE_FONT = {
	min: 10,
	max: 110
};
const RANGE_WAIT = {
	min: 5,
	max: 100
};
const RANGE_PARTICLE = {
	min: 10,
	max: 120
};

func.setRange(fontSizeCtl,RANGE_FONT.min,RANGE_FONT.max);
func.setRange(displayTimeCtl,RANGE_WAIT.min,RANGE_WAIT.max);
func.setRange(particleCountCtl,RANGE_PARTICLE.min,RANGE_PARTICLE.max);

//デフォルト値
const DEFAULT_FONT_SIZE = 90; //フォントサイズ(px)
const DEFAULT_FONT_COLOR = "#00FF88"; //フォントの色
const DEFAULT_DURATION = 700; //文字出現までの時間(ms)
const DEFAULT_WAIT = 40; //文字を表示する時間(f)
const DEFAULT_FONT_FAMILY = "sans-serif"; //使用フォント
const DEFAULT_PARTICLE_COUNT = 50;

//現在値
let fontSize = DEFAULT_FONT_SIZE;
let halfFontSize = fontSize / 2;
let fontColor = DEFAULT_FONT_COLOR;
let duration = DEFAULT_DURATION;
let wait = DEFAULT_WAIT;
let fontFamily = DEFAULT_FONT_FAMILY;
let particleCount = DEFAULT_PARTICLE_COUNT;

func.setValue(fontSizeCtl,fontSize);
func.setValue(fontColorCtl,fontColor);
func.setValue(displayTimeCtl,wait);
func.setValue(particleCountCtl,particleCount);

const player = new Player({
	app: {
		appAuthor: "ToykoItomimizu",
		appName: "hanabi",
		parameters:[
			{
				title: "フォントサイズ",
				name: "fontSize",
				className: "Slider",
				params: [RANGE_FONT.min,RANGE_FONT.max],
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
				params: [RANGE_WAIT.min,RANGE_WAIT.max],
				initialValue: DEFAULT_WAIT
			},
			{
				title: "パーティクル数",
				name: "particleCount",
				className: "Slider",
				params: [RANGE_PARTICLE.min,RANGE_PARTICLE.max],
				initialValue: DEFAULT_PARTICLE_COUNT
			}
		]
	},
	mediaElement: document.querySelector("#media")
});

resize();
canvasInit();
context.fillStyle = "#000000";
context.fillRect(0,0,canvas.width,canvas.height);
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
	Fire.setCanvasHeight = canvas.height;
	Particle.setCanvasWidth = canvas.width;
	Particle.setCanvasHeight = canvas.height;
	maxY = canvas.height - canvas.height / 3 - halfFontSize;
}

let fire = [];
let particle = [];
let initX = halfFontSize;
let charInfo = {
	wait: wait,
	color: fontColor,
	size: fontSize,
	family: fontFamily
};

Fire.init({
	canvasWidth: canvas.width,
	canvasHeight: canvas.height,
	easeFunc: Ease.circOut,
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
		particleCountCtl.addEventListener("input",()=>{
			onAppParameterUpdate("particleCount",particleCountCtl.value);
			func.setNumber(particleCountCtl);
		});
	}
	if(!app.songUrl){ //デフォルトURL
		player.createFromSongUrl("https://www.youtube.com/watch?v=XSLhsjepelI");
	}
}

let ctrlBtn = document.getElementById("toggle_btn");
let ctrl = document.querySelector(".controller");
ctrlBtn.addEventListener("click",()=>{
	ctrl.classList.toggle("ctrl_show");
	if(ctrl.classList.contains("ctrl_show")){
		ctrlBtn.textContent = "コントロールを非表示";
	}else{
		ctrlBtn.textContent = "コントロールを表示";
	}
});

const exp = new Explosion(particleCount,5,10,2,context);
//クリックイベント
function mouseClick(e){
	let canPos = canvas.getBoundingClientRect();
	let x = e.pageX - canPos.left - window.pageXOffset;
	let y = e.pageY - canPos.top - window.pageYOffset;
	particle = particle.concat(exp.run(x,y));
}

let request;
const push = Array.prototype.push;
let prevY = func.rand(halfFontSize,maxY); //初期値は適当に

function animation(){
	context.fillStyle = "#000000";
	context.fillRect(0,0,canvas.width,canvas.height); //背景
	let c = player.video.findChar(player.timer.position + duration);
	if(c !== null){
		let index = player.video.findIndex(c);
		if(currentLyricIndex != index){
			let min = Math.max(prevY - fontSize - halfFontSize,halfFontSize);
			let max = Math.min(prevY + fontSize + halfFontSize,maxY);
			let targetYPos = func.rand(min,max); //最終的に到達する座標
			fire.push(new Fire(particleCount,initX,canvas.height,targetYPos,c,duration,context));
			currentLyricIndex = index;
			initX += fontSize;
			if(initX + halfFontSize > canvas.width){
				initX = halfFontSize;
			}
			prevY = targetYPos;
		}
	}
	for(const f of fire){
		f.update();
		push.apply(particle,f.particleArr());
	}
	fire = fire.filter(f => !f.isRemove);

	for(const p of particle){
		p.update();
	}
	particle = particle.filter(par => !par.isRemove); //頂点に達したか範囲外のパーティクルは消去
	request = requestAnimationFrame(animation);
}

function addAfterimage(x,y,color,radius,ctx){
	particle.push(new Afterimage(x,y,color,radius,ctx));
}

function addCharacter(x,y,char,ease,ctx){
	particle.push(new Character(x,y,char,charInfo,ease,ctx));
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
	fire = [];
	particle = [];
	context.fillStyle = "#000000";
	context.fillRect(0,0,canvas.width,canvas.height);
}

function onAppParameterUpdate(name,value){
	switch(name){
		case "fontSize":
			fontSize = parseInt(value);
			halfFontSize = fontSize / 2;
			charInfo.size = fontSize;
			break;
		case "fontColor":
			fontColor = func.colorToString(value);
			charInfo.color = fontColor;
			break;
		case "displayTime":
			wait = parseInt(value);
			charInfo.wait = wait;
			break;
		case "particleCount":
			particleCount = parseInt(value);
			exp.particleCount = particleCount;
			break;
	}
}
