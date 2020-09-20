const {Player,Ease} = TextAliveApp;

const canDiv = document.getElementById("container");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

resize();

//デフォルト値
const DEFAULT_FONT_SIZE = 160; //フォントサイズ(px)
const DEFAULT_INIT_X = canvas.width / 2 - DEFAULT_FONT_SIZE / 2; //文字のX方向の初期位置
const DEFAULT_SCROLL_SPEED = 10; //スクロールする速さ
const DEFAULT_SWING = DEFAULT_FONT_SIZE / 2; //振れ幅
const DEFAULT_FONT_COLOR = "#00FF88"; //フォントの色

//現在値
let fontSize = DEFAULT_FONT_SIZE;
let initXPos = DEFAULT_INIT_X;
let scrollSpeed = DEFAULT_SCROLL_SPEED;
let swing = DEFAULT_SWING;
let fontColor = DEFAULT_FONT_COLOR;

const player = new Player({
	app: {
		appAuthor: "ToykoItomimizu",
		appName: "untitled",
		parameters:[
			{
				title: "フォントサイズ",
				name: "fontSize",
				className: "Slider",
				params: [10,300],
				initialValue: DEFAULT_FONT_SIZE
			},
			{
				title: "文字生成初期位置",
				name: "initXPos",
				className: "Slider",
				params: [10,1000],
				initialValue: DEFAULT_INIT_X
			},
			{
				title: "スクロール速度",
				name: "scrollSpeed",
				className: "Slider",
				params: [5,100],
				initialValue: DEFAULT_SCROLL_SPEED
			},
			{
				title: "振れ幅",
				name: "swing",
				className: "Slider",
				params: [0,700],
				initialValue: DEFAULT_SWING
			},
			{
				title: "フォントの色",
				name: "fontColor",
				className: "Color",
				initialValue: DEFAULT_FONT_COLOR
			}
		]
	},
	mediaElement: document.querySelector("#media")
});

canvasInit();
canDiv.appendChild(canvas);

let currentLyricIndex = -1;

//文字の一文字の情報を保持
class Character{
	constructor(x,y,char){
		this.x = x;
		this.y = y;
		this.char = char;
		this.isRemove = false;
	}
}
let isPlay = false;
let str = []; //歌詞を格納する配列
let prevChar;

player.addListener({
	onAppReady,
	onTimerReady,
	onTimeUpdate,
	onPlay,
	onPause,
	onStop,
	onAppParameterUpdate,
});

//リサイズ時のイベント登録
window.addEventListener("resize",()=>{
	resize();
	canvasInit();
});

function canvasInit(){
	context.textBaseline = "top";
	context.font = fontSize + "px sans-serif";
}

function resize(){
	canvas.width = canDiv.clientWidth;
	canvas.height = document.documentElement.clientHeight;
}

function onAppReady(app){
	if(!app.songUrl){ //デフォルトURL
		player.createFromSongUrl("https://www.youtube.com/watch?v=XSLhsjepelI");
	}
}
/*
function onVideoReady(app){

}
*/
let lyrics = [];

function onTimerReady(){
	let char = player.video.firstChar;
	while(char && char.next){
		lyrics.push(char);
		char = char.next;
	}
}

function onTimeUpdate(position){
	let c = player.video.findChar(position);
	if(c !== null){
		let index = player.video.findIndex(c);

		if(currentLyricIndex != index){
			let cx = initXPos,cy;
			if(str.length === 0){
				cy = Math.floor(Math.random() * (canvas.height - fontSize));
			}else{
				let min = Math.max(prevChar.y - swing,0);
				let max = Math.min(prevChar.y + swing,canvas.height - fontSize);
				cy = Math.floor(Math.random() * (max + 1 - min)) + min;
				if(prevChar.x + fontSize > initXPos){
					cx += prevChar.x + fontSize - initXPos;
				}
			}
			str.push(new Character(cx,cy,c.text));
			prevChar = str[str.length - 1];
			currentLyricIndex = index;
		}
	}
}

let request;

function scroll(){
	context.clearRect(0,0,canvas.width,canvas.height);
	let defColor = context.fillStyle;
	context.fillStyle = fontColor;
	for(const char of str){
		char.x -= scrollSpeed;
		context.fillText(char.char,char.x,char.y);
		if(char.x + fontSize < 0){
			char.isRemove = true;
		}
	}
	str = str.filter(char => !char.isRemove); //範囲外の文字は消去
	context.fillStyle = defColor;
	request = requestAnimationFrame(scroll);
}

function onPlay(){
	scroll();
}

function onPause(){
	cancelAnimationFrame(request);
}

function onStop(){
	onPause();
}

function onAppParameterUpdate(name,value){
	switch(name){
		case "fontSize":
			fontSize = parseInt(value);
			context.font = fontSize + "px sans-serif";
			break;
		case "initXPos":
			initXPos = parseInt(value);
			break;
		case "scrollSpeed":
			scrollSpeed = parseInt(value);
			break;
		case "swing":
			swing = parseInt(value);
			break;
		case "fontColor":
			fontColor = colorToString(value);
			break;
	}
}

function colorToString(color){
	let r = zeroPad(color.r.toString(16),2);
	let g = zeroPad(color.g.toString(16),2);
	let b = zeroPad(color.b.toString(16),2);
	return "#" + r + g + b;
}

function zeroPad(num,digit){
	return (Array(digit).join("0") + num).slice(-digit);
}
