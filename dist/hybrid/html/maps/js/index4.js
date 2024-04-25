var lats = getQueryVariable('lat') * 1;
var lngs = getQueryVariable('lng') * 1;
var zoom = 14; //地图缩放比例
var coords = ""
var maxValue = 3;
var cityCircle = ""; //圆
/**
 * 初始化
 * 
 */
function initMap() {

	if (lats && lngs) {
		coords = {
			lat: lats,
			lng: lngs
		};
	} else {
		navigator.geolocation.getCurrentPosition(function(position) {
			coords = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			lats = position.coords.latitude;
			lngs = position.coords.longitude
		});
	}
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: zoom,
		center: coords,
		mapId: MAPID,
		animation: 'BOUNCE'
	});
	setTimeout(() => {
		LoadAnimation(false)
	}, 1000)
	drawCircle();
	setMePositioning();
}
/*
 *设置个人定位以及显示marker标记点
 * 
 **/
function setMePositioning() {
	meMarker = new google.maps.Marker({
		position: {
			lat: lats,
			lng: lngs
		},
		icon: {
			url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red.png',
			scaledSize: new google.maps.Size(50, 50),
		},
		animation: 4,
		map: map
	});
}
/**
 * 清除画圆
 * 
 * */
function clearCircle() {
	if (cityCircle) {
		cityCircle.setMap(null)
	}
}
/**
 * 画圆
 * 
 */
function drawCircle() {
	cityCircle = new google.maps.Circle({
		strokeColor: "#FF0000", // 边框颜色
		strokeOpacity: 0.6, // 边框透明度
		strokeWeight: 0.8, // 边框宽度
		fillColor: "#FF0000", // 填充颜色
		fillOpacity: 0.15, // 填充透明度
		map,
		center: {
			lat: lats,
			lng: lngs
		},
		radius: maxValue * 500, //半径
	});

	setTimeout(() => {
		LoadAnimation(false)
	}, 500)
}


/**
 * 可视地图放大缩小
 * 
 * 
 * */
function setMapZoom(newZoom) {
	map.setZoom(newZoom);
}

LoadAnimation(true)
window.initMap = initMap;

const appHtml = {
	data() {
		return {
			value: maxValue, //默认筛选距离
		}
	},
	methods: {
		// 滑动滑块
		onChange(e) {
			LoadAnimation(true)
			maxValue = e;
			nums = 15 - maxValue / 3;
			zoom = Math.trunc(Number(nums)); //地图缩放比例

			setMapZoom(zoom);
			clearCircle(); //繪製前 請先清除原来画的圆
			drawCircle();
		}

	}
}
// 创建
const app = Vue.createApp(appHtml)
// 引入vant组件
app.use(vant);
// 自动注册 Lazyload 组件
app.use(vant.Lazyload);

// 引入button
app.use(vant.Button);
// 引入宫格布局
app.use(vant.Grid);
app.use(vant.GridItem);
// 空状态
app.use(vant.Empty);

app.mount('#slider');