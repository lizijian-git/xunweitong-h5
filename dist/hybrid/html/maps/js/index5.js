var lats = getQueryVariable('lat') * 1;
var lngs = getQueryVariable('lng') * 1;
var zoom = 15; //地图缩放比例
var coords = ""
var meMarker = ''; //个人位置标记点
var map; //地图

var drawRouteMarker = []; //路线marker
var directionsRendererArr = []; //地图路线
console.log(localStorage.getItem('token'))
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
			console.log(position)
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

	setMePositioning();
	setTimeout(() => {
		LoadAnimation(false)
	}, 1000)

}
/**
 * 画路线图
 *  经度纬度加了随机函数 故 起始点和终点 各不一致
 *  需要用到此功能自行调整
 * 
 * */
function drawRoute() {
	LoadAnimation(true)
	clearDrawRoute()
	const directionsService = new google.maps.DirectionsService();
	var TravelMode = [{
			id: 1,
			name: "DRIVING",
			color: "#ea4335"
		},
		{
			id: 2,
			name: "WALKING",
			color: "#7825fa"
		},
		{
			id: 3,
			name: "BICYCLING",
			color: "#fa6200"
		},
		{
			id: 4,
			name: "TRANSIT",
			color: "#ff00ff"
		}
	]
	for (var i = 0; i < TravelMode.length; i++) {
		startDrawRoute(directionsService, TravelMode[i])
	}

}

/**
 * 清除路线
 * 
 * */
function clearDrawRoute() {
	if (directionsRendererArr) { //清空线
		for (var i = 0; i < directionsRendererArr.length; i++) {
			directionsRendererArr[i].setMap(null);
		}
		// 清空数组
		directionsRendererArr = [];
	}
	if (drawRouteMarker) { //清空标记点
		for (var i = 0; i < drawRouteMarker.length; i++) {
			drawRouteMarker[i].setMap(null);
		}
		// 清空数组
		drawRouteMarker = [];

	}

}

/**
 * 
 * 开始绘制以下路线图
 *	DRIVING：驾车模式。这是默认的出行方式，计算出行路线时考虑当时的实时交通情况。
 *可用  WALKING：步行模式。计算步行路线时会考虑人行道、人行横道等规则，因此得到的路线可能与驾车路线不同。
 *可用  BICYCLING：骑行模式。计算骑行路线时，避开了折返点和拥堵路段，提供了适合骑自行车的路线。
 * TRANSIT：公共交通模式。在城市间导航中被广泛使用，提供了乘坐公共交通工具（如公交车、地铁、火车和轻轨）的路线方案。
 * FLIGHTS：飞行模式。在 Google Maps 平台上无法使用，此模式只适用于各大航空公司网站等其他服务商范畴内。
 * 
 * */
function startDrawRoute(directionsService, travelMode) {
	// 随机数字而已  动态数字  方便查询效果
	let min = 5000;
	let max = 10000;
	let randomNum = (Math.floor(Math.random() * (max - min + 1)) + min) / 500000;
	// 起点坐标

	/**
	 * lat 和lng数据为随机数据  运行时 调整为自己所在位置坐标
	 * 
	 * */
	const origin = {
		lat: 32.0868015,
		lng: 34.789812
	};
	// 终点坐标
	const destination = {
		lat: 32.0628071,
		lng: 34.7628015
	};

	var directionsRenderer = new google.maps.DirectionsRenderer({
		map: map,
		suppressMarkers: false, // 关闭默认图标
		// polylineOptions: {
		// 	// strokeColor: travelMode.color, //设置路线颜色
		// 	strokeWeight: 5 //设置路线宽度
		// },
		draggable: false //允许用户拖动路线

	});
	const request = {
		origin: origin,
		destination: destination,
		travelMode: 'DRIVING', //绘制路线的模式
		optimizeWaypoints:true,
		waypoints: [{
				location: new google.maps.LatLng('32.0688446', '34.7721636'),
				stopover: true
			}, //医院
			{
				location: new google.maps.LatLng('32.076146', '34.7817226'),
				stopover: true
			}, //咖啡店
			{
				location: new google.maps.LatLng('32.0708654', '34.7779298'),
				stopover: true
			}, //咖啡店

		],
	};

	directionsService.route(request,
		(result, status) => {
			if (status === "OK") {
				directionsRenderer.setDirections(result);
				directionsRenderer.setMap(map);
				// 获取起点和终点的信息并添加标记
				var startMarker = new google.maps.Marker({
					position: result.routes[0].legs[0].start_location,
					map: map,
					// icon: {
					// 	url: "https://maps.gstatic.com/mapfiles/ms2/micons/pink.png",
					// 	scaledSize: new google.maps.Size(50, 50),
					// },
				});
				drawRouteMarker.push(startMarker)
				var endMarker = new google.maps.Marker({
					position: result.routes[0].legs[0].end_location,
					map: map,
					// icon: {
					// 	url: "https://maps.gstatic.com/mapfiles/ms2/micons/orange.png",
					// 	scaledSize: new google.maps.Size(50, 50),
					// },
				});
				drawRouteMarker.push(endMarker)
				directionsRendererArr.push(directionsRenderer)

				//显示路线的总距离
				// console.log('距离===', directionsRenderer.directions.routes[0].legs[0].distance.text)
				// console.log('时间===', directionsRenderer.directions.routes[0].legs[0].duration.text)
				// for (var k = 0; k < directionsRenderer.directions.routes[0].legs[0].steps.length; k++) {
				// 	console.log(directionsRenderer.directions.routes[0].legs[0].steps[k].instructions)
				// }
			} else {
				// console.log(travelMode, "绘制失败===", result)
			}
		}
	);

	LoadAnimation(false)
}
/**
 * 绘制marker点
 * 
 *备注：ss随机生成的经纬度 实际使用中 在此方法内请求接口
 * */
function myBtn1() {
	LoadAnimation(true)

	setTimeout(() => {
		LoadAnimation(false)
	}, 500)
}


/**
 * 清除markers
 * 
 * */
function myBtn2() {
	LoadAnimation(true)
	setTimeout(() => {
		LoadAnimation(false)

	}, 1000)

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

LoadAnimation(true)
window.initMap = initMap;