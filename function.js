function colorToString(color){
	if(color.r){
		let r = zeroPad(color.r.toString(16),2);
		let g = zeroPad(color.g.toString(16),2);
		let b = zeroPad(color.b.toString(16),2);
		return "#" + r + g + b;
	}

	if(/^#[0-9a-fA-F]{6}$/.test(color) || /^#[0-9a-fA-F]{3}$/.test(color)){
		return color;
	}else{
		return "#FFFFFF";
	}
}

function zeroPad(num,digit){
	return (Array(digit).join("0") + num).slice(-digit);
}

function setValue(element,value){
	element.value = value;
	if(element.type === "range"){
		setNumber(element);
	}
}

function setNumber(element){
	let num = document.getElementById(element.id + "_num");
	num.textContent = element.value;
}

function setRange(element,min,max){
	element.min = min;
	element.max = max;
}

function rand(min,max){
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}
