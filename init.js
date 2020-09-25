const {Player,Ease} = TextAliveApp;

const canDiv = document.getElementById("container");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

const controll = document.getElementById("controller");

//各コントロール
const fontSizeCtl = document.getElementById("font_size");
const fontColorCtl = document.getElementById("font_color");
const displayTimeCtl = document.getElementById("disply_time");

setRange(fontSizeCtl,10,300);
setRange(displayTimeCtl,10,100);

resize();

//デフォルト値
const DEFAULT_FONT_SIZE = 160; //フォントサイズ(px)
const DEFAULT_FONT_COLOR = "#00FF88"; //フォントの色
const DEFAULT_DURATION = 700; //文字出現までの時間(ms)
const DEFAULT_WAIT = 40; //文字を表示する時間(f)
const DEFAULT_FONT_FAMILY = "sans-serif"; //使用フォント

//文字がフェードイン・アウトする時間(f)
const FADE_IN_TIME = 30;
const FADE_OUT_TIME = 30;

//現在値
let fontSize = DEFAULT_FONT_SIZE;
let halfFontSize = fontSize / 2;
let fontColor = DEFAULT_FONT_COLOR;
let duration = DEFAULT_DURATION;
let wait = DEFAULT_WAIT;
let fontFamily = DEFAULT_FONT_FAMILY;

let lifeTime = wait + FADE_IN_TIME + FADE_OUT_TIME;

setValue(fontSizeCtl,fontSize);
setValue(fontColorCtl,fontColor);
setValue(displayTimeCtl,wait);

context.fillStyle = fontColor;

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
}
