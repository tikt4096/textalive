const {Player,Ease} = TextAliveApp;

const canDiv = document.getElementById("container");
const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

const controll = document.getElementById("controller");

//各コントロール
const fontSizeCtl = document.getElementById("font_size");
const fontColorCtl = document.getElementById("font_color");

setRange(fontSizeCtl,10,300);

resize();

//デフォルト値
const DEFAULT_FONT_SIZE = 160; //フォントサイズ(px)
const DEFAULT_FONT_COLOR = "#00FF88"; //フォントの色
const DEFAULT_DURATION = 700; //文字出現までの時間(ms)
const DEFAULT_WAIT = 60; //文字を表示する時間(f)

//現在値
let fontSize = DEFAULT_FONT_SIZE;
let halfFontSize = fontSize / 2;
let fontColor = DEFAULT_FONT_COLOR;
let duration = DEFAULT_DURATION;
let wait = DEFAULT_WAIT;

setValue(fontSizeCtl,fontSize);
setValue(fontColorCtl,fontColor);

context.fillStyle = fontColor;

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
