var lats = getQueryVariable('lat') * 1;
var lngs = getQueryVariable('lng') * 1;
var zoom = 15; //地图缩放比例
var coords = ""
var meMarker = ''; //个人位置标记点
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
	setMePositioning();
	Repositioning();
	addListenerCnterChange();
}
/**
 * 移除个人信息标记点
 * 
 * 
 * */
function removeMeMarker() {

	if (meMarker) {
		meMarker.setMap(null);
		meMarker = '';
	}

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
			// url: 'https://picsum.photos/450/450?random=' + Math.floor(Math.random() * 100),
			url: "https://maps.gstatic.com/mapfiles/ms2/micons/red.png",
			scaledSize: new google.maps.Size(50, 50),
		},
		// animation: 4,
		map: map
	});
}


/**
 * 监听地图滑动中心点变化
 * 
 * */
function addListenerCnterChange() {
	// 实时监听中心点变化
	map.addListener("center_changed", () => {
		const center = map.getCenter();
		var pos = {
			lat: center.lat(),
			lng: center.lng()
		};
		removeMeMarker();
		console.log('pos========', pos)
		lats = center.lat()
		lngs = center.lng()
		setMePositioning();
	});
	// 侦听地图载入事件
	google.maps.event.addListenerOnce(map, 'idle', function() {
		// Toast('idle事件', 1000)
	});
	// 侦听地图拖拽事件
	google.maps.event.addListener(map, 'drag', function() {
		// Toast('拖拽事件', 1000)
	});
	// 侦听地图停止事件并获取地图中心点坐标
	google.maps.event.addListener(map, 'idle', function() {

	});
	// 监听地图缩放事件并在不同缩放级别下切换数字图标
	google.maps.event.addListener(map, 'zoom_changed', function() {});
}
/**
 * 重新定位
 * 
 * 
 * */
function Repositioning() {
	LoadAnimation(true)
	var element = document.getElementById('pos');
	element.addEventListener("click", function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				// lats = position.coords.latitude;
				// lngs = position.coords.longitude;
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
				LoadAnimation(false)
				map.setCenter(pos); // 将地图中心置于当前位置
			}, function() {
				console.log("无法获取地理位置信息");
			});
		} else {
			console.log("浏览器不支持Geolocation API");
		}


	});
}

LoadAnimation(true)
window.initMap = initMap;