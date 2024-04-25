var lats = getQueryVariable('lat') * 1;
var lngs = getQueryVariable('lng') * 1;
var zoom = 15; //地图缩放比例
var coords = ""
var searchmarker = "";
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
	ListeningInputBox();
}


/**
 * 监听输入框 输入事件
 * 
 * */
function ListeningInputBox() {
	// 创建 Autocomplete 实例

	const input = document.getElementById("search-box");
	const autocomplete = new google.maps.places.Autocomplete(input);
	// 设置 Autocomplete 参数
	autocomplete.setFields(["geometry", "name"]);
	// 添加事件监听器，当用户选择某个地点时，在地图上标记出所选位置
	LoadAnimation(true)
	autocomplete.addListener("place_changed", function() {
		const place = autocomplete.getPlace();
		var latlng = JSON.parse(JSON.stringify(place.geometry.location))
		console.log("place===", latlng)
		getAddress(latlng.lat, latlng.lng);
		if (!place.geometry) {
			console.log("返回的地理信息无效！");
			return;
		}
		// 将地图中心点指向用户所选位置，并设置标记
		if (searchmarker) { //去除marker标记点
			searchmarker.setMap(null)
			searchmarker = ""
		}
		map.setCenter(place.geometry.location);
		searchmarker = new google.maps.Marker({
			map: map,
			position: place.geometry.location,
			title: place.name,
		});
		setTimeout(() => {
			LoadAnimation(false)
		}, 1000)
	});
}
/**
 * 根据经度纬度获取相对应的地址信息
 *  提取 国家 省/州 市 区/县 路 门牌号  
 * 
 * */
function getAddress(latitude, longitude) {
	// 根据经纬度发起 Reverse Geocoding API 请求，获取地址信息
	var geocoder = new google.maps.Geocoder();
	var latlng = {
		lat: latitude,
		lng: longitude
	};
	var cityInfo = {
		country: "", //国家
		province: "", //省
		city: "", //市
		district: "", //区
		street: "", //街道	
		door: "", //门牌号
		address: "", //详细地址
	}

	geocoder.geocode({
		location: latlng
	}, function(results, status) {
		if (status === 'OK') {
			if (results[0]) {
				console.log(results[0])
				for (var i = 0; i < results.length; i++) {
					var components = results[i].address_components;
					for (var j = 0; j < components.length; j++) {
						var component = components[j];
						if (component.types.includes("country")) {
							console.log("国家:  ====>" + component.long_name);
							cityInfo.country = component.long_name || '暂无';
						} else if (component.types.includes("administrative_area_level_1")) {
							console.log("省/州:  ====>" + component.long_name);
							cityInfo.province = component.long_name || '暂无';
						} else if (component.types.includes("locality")) {
							console.log("城市: ====> " + component.long_name);
							cityInfo.city = component.long_name || '暂无';
						} else if (component.types.includes("sublocality_level_1")) {
							console.log("区/县: ====>" + component.long_name);
							cityInfo.district = component.long_name || '暂无';
						} else if (component.types.includes("route")) {
							console.log("路/街道名: ====> " + component.long_name);
							cityInfo.street = component.long_name || '暂无';
						} else if (component.types.includes("street_number")) {
							console.log("门牌号: ====> " + component.long_name);
							cityInfo.door = component.long_name || '暂无';
						}
					}
				}
				cityInfo.address = results[0].formatted_address;
				console.log("cityInfo==========", cityInfo)
				addInfo(cityInfo)

			} else {
				alert('找不到地址信息');
			}
		} else {
			alert('获取地址信息失败：' + status);
		}
	});
}

function addInfo(cityInfo) {
	// 获取子节点并设置新的文本内容
	const child1 = document.getElementById('country');
	child1.textContent = cityInfo.country;
	const child2 = document.getElementById('province');
	child2.textContent = cityInfo.province;
	const child3 = document.getElementById('city');
	child3.textContent = cityInfo.city;
	const child4 = document.getElementById('district');
	child4.textContent = cityInfo.district;
	const child5 = document.getElementById('street');
	child5.textContent = cityInfo.street;
	const child6 = document.getElementById('door');
	child6.textContent = cityInfo.door;
	const child7 = document.getElementById('address');
	child7.textContent = cityInfo.address;

}
LoadAnimation(true)
window.initMap = initMap;