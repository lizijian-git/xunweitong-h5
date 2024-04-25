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

	let min = 5000;
	let max = 10000;
	let randomNum = (Math.floor(Math.random() * (max - min + 1)) + min) / 5000000;
	console.log(randomNum)
	var polylinePathPoints = [{
			lat: 34.738120308 + 3 / 2000,
			lng: 113.64560882345 + 2 / 2000
		},
		{
			lat: 34.7382820208 + 2 / 1000,
			lng: 113.64360881345 + 2 / 1000
		},
		{
			lat: 34.7385820208 + 3 / 1000,
			lng: 113.64310881345 + 3 / 1000
		},
		{
			lat: 34.7386820208 + 1 / 1000,
			lng: 113.64360881345 + 4 / 1000
		},
		{
			lat: 34.7382820208 + 1 / 1000,
			lng: 113.64360881345 + 5 / 1000
		},
		{
			lat: 34.7382820208 + 6 / 1000,
			lng: 113.64360881345 + 5 / 1000
		},
		{
			lat: lats,
			lng: lngs
		}
	]

	// map：指定要放在哪個地圖上，如果沒有設定，可以再用 setMap 的方法把折線放到地圖裡。
	// path：折線的路徑，使用陣列來表示，每個陣列元素是經緯度的物件，必須包含對應的經緯度座標才能繪製。
	// icons：折線上每個座標的圖示，使用陣列來表示，如果沒有 icon 則不會有圖案顯示。
	// strokeColor：折線線條的顏色。
	// strokeOpacity：折線的線條透明度，0.0 ~ 1.0 之間，越接近 0 表示越透明。
	// strokeWeight：折線的線條寬度，使用 pixel 表示。
	// zIndex：折線的階層，數字越大在越上面。
	// visible：是否可以看見折線，預設值 true，如果設定 false 就看不見折線。
	// clickable：是否可以點擊折線，預設值 true，如果設為 false 則不能點擊。
	// draggable：是否可以拖曳折線，預設值為 false，如果設為 true，則可以把整個線段形狀拖曳到別的地方 ( 如果是要個別修改折線上的點，可以使用 editable )。
	// editable：是否可以編輯折線上的每個點，預設值為 false，如果設為 true，在折線上就會出現可以拖曳的圓點標記，透過滑鼠就可以更改每個點的位置。
	// geodesic：是否要依照「地球弧度」繪製折線，預設值為 flase，表示一律採「直線」顯示，若設定為 true，在地圖縮小到一定比例， 類似可以在同個畫面看到完整的台灣，就會看到折線變成「弧線」，因為地球本身是橢圓形，所以如果有看過飛機航線就知道，航線都會是弧線顯示 ( 在地球表面，最短的距離不是直線，是弧線 )。

	var polylinePath = new google.maps.Polyline({
		path: polylinePathPoints,
		geodesic: true,
		strokeColor: '#008800',
		strokeOpacity: 0.8,
		strokeWeight: 1,
		editable: false,
		geodesic: false,
		draggable: false,

	});

	polylinePath.setMap(map);



}
LoadAnimation(true)
window.initMap = initMap;