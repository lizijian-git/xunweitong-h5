/**
 * MapID
 * 
 * 
 * */
var MAPID = ''

/**
 * 
 * 获取url地址参数
 * 
 * */

function getQueryVariable(variable) {
	var query = decodeURI(window.location.search.substring(1));
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}



/**
 * 随机生成颜色rgb值
 * 
 * */

function getRandomColor() {
	const letters = '0123456789ABCDEF'; // 16进制颜色表示中可能出现的字符
	let color = '#';
	for (let i = 0; i < 6; i++) { // 随机生成6位十六进制数
		color += letters[Math.floor(Math.random() * 16)]; // 根据随机数选取相应的字符
	}
	return color;
}


/**
 * 随机生成中文文字
 * 辅助方法 实际中可废弃
 * */
function randomChinese(num) {

	let str = "";
	const words = ["Lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
		"eiusmod", "tempor",
		"incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "Ut", "enim", "ad", "minim", "veniam",
		"quis",
		"nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo",
		"consequat",
		"Duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum",
		"dolore",
		"eu", "fugiat", "nulla", "pariatur", "Excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
		"sunt",
		"in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
	];
	for (let i = 0; i < num; i++) {
		const randomWord = words[Math.floor(Math.random() * words.length)];
		str += randomWord + " ";
	}
	return str.trim();
}


/**
 * 加载动画
 * 
 */
function LoadAnimation(isFalse) {
	if (isFalse) {
		document.getElementById("loader").style.display = "inline";
	} else {
		document.getElementById("loader").style.display = "none";
	}

}



// export default {
// 	LoadAnimation,
// 	randomChinese,
// 	getRandomColor,
// 	getQueryVariable,
// 	getMapID

// }