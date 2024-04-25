var lats = getQueryVariable('lat') * 1;
var lngs = getQueryVariable('lng') * 1;
var zoom = 14; //地图缩放比例
var coords = ""

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


	foldLine();


	setTimeout(() => {
		LoadAnimation(false)
	}, 1000)

}
/**
 * 画折线
 * 
 * */
function foldLine() {
	var polylinePathPoints = [{
			lat: lats + 3 / 2000,
			lng: lngs + 8 / 2000
		},
		{
			lat: lats + 1 / 1000,
			lng: lngs + 5 / 1000
		},
		{
			lat: lats + 10 / 1000,
			lng: lngs + 5 / 1000
		},
		{
			lat: lats,
			lng: lngs
		}
	]


	// icons：可加icon参数
	var polylinePath = new google.maps.Polyline({
		path: polylinePathPoints,
		geodesic: false,
		strokeColor: '#008800',
		strokeOpacity: 0.8,
		strokeWeight: 20,
		editable: true, //是否可以编辑折线
		draggable: true, //是否可拖拽

	});

	polylinePath.setMap(map);

}
LoadAnimation(true)
window.initMap = initMap;