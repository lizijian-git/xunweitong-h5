var lats = getQueryVariable('lat') * 1;
var lngs = getQueryVariable('lng') * 1;
var zoom = 15; //地图缩放比例
var coords = ""
var meMarker = ''; //个人位置标记点
var map; //地图
var markers = []; //marker标记点
var lastClickedMarker = ""; //记录当前点击的marker



let openInfoWindow; //信息窗口
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

	setMePositioning();
	setTimeout(() => {
		LoadAnimation(false)
	}, 1000)

}

// 打卡按钮回调
function signBtn(){
	uni.postMessage({
		data: {
			action: 'jobSign'
		}
	});	
};

/**
 * 绘制marker点
 * 
 *备注：ss随机生成的经纬度 实际使用中 在此方法内请求接口
 * */
function myBtn1() {
	LoadAnimation(true)
	let min = 500;
	let max = 1000;
	if (markers) {
		removeMarker();
	}
	let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
	for (let i = 0; i < 20; i++) {
		var locObj = {
			lat: (lats + (Math.floor(Math.random() * 21) - 15) / randomNum) * 1,
			lng: (lngs - (Math.floor(Math.random() * 21) - 15) / randomNum) * 1,
			title: randomChinese(10)
		}
		/**
		 * 以下title 和 imgUrl 在這裏設置的目的是為了點擊marker標記點時 信息彈出框有數據   無此業務邏輯時  可選擇性去除該功能
		 * 以及注釋ListeningMarkerClick 方法即可
		 * */
		const marker = new google.maps.Marker({
			position: locObj,
			title: locObj.title + '-' + i,
			imgUrl: 'https://picsum.photos/450/450?random=' + Math.floor(Math.random() * 100),
			icon: {
				url: 'https://picsum.photos/450/450?random=' + Math.floor(Math.random() * 100),
				scaledSize: new google.maps.Size(50, 50),
			},
			map: map
		});
		markers.push(marker)
		ListeningMarkerClick(marker, i)
		// 标记点点击事件
		marker.addListener("click", () => {
			Toast("点击了第" + i + "个marker标记点",
				1000)
		});
		markerClickAnimation(marker)
	}
	setTimeout(() => {
		LoadAnimation(false)
	}, 500)
}
/**
 * 监听marker点 点击事件  赋予当前点击的marker标记点动画 
 * 并清除其他marker动画
 *  BOUNCE: 1
 *	 DROP: 2
 *	 KE: 4
 *	 PE: 3
 * */
function markerClickAnimation(marker) {
	marker.addListener('click', function() {
		if (lastClickedMarker && lastClickedMarker.getAnimation() !== null) {
			lastClickedMarker.setAnimation(null);
		}
		// 设置当前点击的 Marker 动画效果
		marker.setAnimation(google.maps.Animation.BOUNCE);
		// 记录当前点击的 Marker
		lastClickedMarker = marker;
	});
}
/**
 * 移入marker标记点
 * 
 * */
function removeMarker() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	// 清空数组
	markers = [];
}
/**
 * 清除markers
 * 
 * */
function myBtn2() {
	LoadAnimation(true)
	setTimeout(() => {
		LoadAnimation(false)
		removeMarker();
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
// 信息窗口彈窗功能模塊  无此需求时  不用引入 =======================================================================start
/**
 *监听marker标记点点击事件 
 *点击后右上角显示弹窗
 * 信息窗口弹窗
 * 
 *clickIndex  点击的下标
 *
 */
function ListeningMarkerClick(marker, clickIndex) {
	var contentString = '<div id="myButton_' + clickIndex + '">' +
		'<div class="infoWindow-title">' + marker.title + '</div>' +
		'<p class="textoverflow">' +
		randomChinese(20) + '</p>' +
		'<img class="imgs" src=' + marker.imgUrl +
		'/>' +
		'</div>';
	var infowindow = new google.maps.InfoWindow({
		content: contentString,
		maxWidth: 200,
		disableAutoPan: true,
		zIndex: 100,
		pixelOffset: new google.maps.Size(-35, 0),

	});
	/**
	 * 监听点击maker标记点弹出信息窗
	 * 
	 * */
	google.maps.event.addListener(marker, 'click', function() {
		// infowindow.open(map, marker); //多个信息窗口显示
		if (openInfoWindow) { //单个信息窗口
			openInfoWindow.close();
		}
		infowindow.open(map, marker);
		openInfoWindow = infowindow;
		setTimeoutInfoWindowClick(clickIndex);
	});
	// 关闭信息窗口
	infowindow.addListener('closeclick', () => {
		Toast('关闭了信息窗口', 500)
	});
}
/**
 * 监听信息窗口点击事件
 * 开发使用场景：点击路由跳转 或者传参
 * 
 * */
function setTimeoutInfoWindowClick(clickIndex) {
	setTimeout(() => {
		var element = document.getElementById('myButton_' + clickIndex);
		element.addEventListener("click", function() {
			Toast('点击了第' + clickIndex + '个信息窗口元素')
		});
	}, 50)
}

// =======================================================================================================================end
LoadAnimation(true)
window.initMap = initMap;