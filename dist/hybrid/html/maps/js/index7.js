var lats = getQueryVariable('lat') * 1;
var lngs = getQueryVariable('lng') * 1;
var zoom = 11; //地图缩放比例
var coords = ""
var newPolygon = []; //画省 市 区 

/**
 * @description 
 * cityObjArr为模拟的假数据  正常项目使用时 请替换为实际数据
 * 
 * */

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
	drawRegion();
}
/**
 * 画区域
 * （省、市、区）
 * 省 市  区  经纬度来源参考 ：http://datav.aliyun.com/portal/school/atlas/area_selector
 *  例子： JSON 包 https://gitcode.net/mirrors/lyingying/echarts-mapJson
 * */
function drawRegion() {
	const polygonsData = []
	if (newPolygon) {
		// 清除地图省 市区 标记
		clearDrawRegion();
	}

	for (var k = 0; k < cityObjArr.length; k++) {
		var obj = {
			polygonCoords: cityObjArr[k],
			color: getRandomColor(),
			strokeWeight: 2,
		}
		polygonsData.push(obj)
	}


	polygonsData.forEach((polygon) => {
		var polygonObj = new google.maps.Polygon({
			paths: polygon.polygonCoords,
			strokeColor: getRandomColor(), // 边界线颜色
			strokeOpacity: 0.8, // 边界线透明度
			strokeWeight: 2, // 边界线厚度
			fillColor: getRandomColor(), // 填充颜色
			fillOpacity: 0.2, // 填充透明度
			map: map,
		});
		newPolygon.push(polygonObj)
	});
}

/**
 * 清除省 市 区
 * 
 * 
 * */
function clearDrawRegion() {
	for (var i = 0; i < newPolygon.length; i++) {
		newPolygon[i].setMap(null);
	}
	// 清空数组
	newPolygon = [];
}
LoadAnimation(true)
window.initMap = initMap;