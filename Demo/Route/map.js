var map 	    = null; // 地图容器
var baseLayer   = null; // 底图
var routeLayer  = null;


$(function () {
    // 初始化地图容器
    map = L.map('viewDiv',{
        center: [30.44326443351204, 114.43944445432024],
        zoom: 18,
        maxBounds:[[29.9666558418404279,113.7004008688582957],[31.3612494982628114,115.0808047302495396]]
    });

    // 添加基础影像图层
    baseLayer = L.esri.tiledMapLayer({
        url: gis_2d_url + 'arcgis/rest/services/GoogleMap/MapServer',
        maxZoom:21,
        minZoom:16,
        position: 'back'
    });
    map.addLayer(baseLayer);

    routeLayer = L.featureGroup();
    map.addLayer(routeLayer);

    $("#mapBtn").on("click",function () {
        map.removeLayer(baseLayer);
        baseLayer = L.esri.tiledMapLayer({
            url: gis_2d_url + 'arcgis/rest/services/GoogleMap/MapServer',
            maxZoom:21,
            minZoom:16,
            position: 'back'
        });
        map.addLayer(baseLayer);
        $("#mapBtn").toggle();
        $("#sateliteBtn").toggle();
    });

    $("#sateliteBtn").on("click",function () {
        map.removeLayer(baseLayer);
        baseLayer = L.esri.tiledMapLayer({
            url: gis_2d_url + 'arcgis/rest/services/GoogleSatelite/MapServer',
            maxZoom:21,
            minZoom:16,
            position: 'back'
        });
        map.addLayer(baseLayer);
        $("#mapBtn").toggle();
        $("#sateliteBtn").toggle();
    });

    $("input,button").on("click",function (e) {
        e.stopPropagation();
    });
});

/**
 * 显示人员行踪
 * @param infos
 */
function showPersonRoute(infos) {

    if (infos == null || infos.length == 0){
        routeLayer.clearLayers();
        return true;
    }

    routeLayer.clearLayers();
    var multiCoords = []; // 采集点的坐标
    var deviceNo = []; // 所有设备的编号信息
    var deviceNoAndCoords = {}; // 设备与坐标的匹配关系
    infos.forEach(function (info) {
        deviceNo.push(info.location.split("/")[2]);
    });
    var queryWhere = "";
    deviceNo.forEach(function (no) {
        queryWhere += "'" + no + "',";
    });
    if (deviceNo.length > 1){
        queryWhere = queryWhere.substring(0, queryWhere.length - 1); // 去掉最后一个,
    }
    // 查询所有设备的坐标
    var query = L.esri.query({
        url: gis_2d_url + 'arcgis/rest/services/deviceService/MapServer/0'
    });
    query.where("no in (" + queryWhere + ")").run(function(error, featureCollection){
        featureCollection.features.forEach(function (feature) {
            deviceNoAndCoords[feature.properties.no] = [feature.properties.lat, feature.properties.lon];
        });

        // 整合数据
        infos.forEach(function (info, i) {
            // 获取坐标
            var deviceCoord = deviceNoAndCoords[info.location.split("/")[2]];
            // 添加line的坐标
            multiCoords.push(deviceCoord);
            // 添加marker
            if (i == 0){
                routeLayer.addLayer(L.marker(deviceCoord,{icon:L.icon({iconUrl:"../img/end.png", iconSize:[26,45], iconAnchor:[13,45]})}));
            }else if (i == infos.length - 1){
                routeLayer.addLayer(L.marker(deviceCoord,{icon:L.icon({iconUrl:"../img/start.png", iconSize:[26,45], iconAnchor:[13,45]})}));
            }else{
                routeLayer.addLayer(L.marker(deviceCoord,{icon:L.icon({iconUrl:"../img/pass.png", iconSize:[24,24], iconAnchor:[12,12]})}));
            }
        });

        multiCoords.reverse();// 逆序

        // 添加直线
        routeLayer.addLayer(L.polyline(multiCoords));
        // 添加箭头
        routeLayer.addLayer(L.polylineDecorator(multiCoords, {
            patterns: [
                {offset: 0, repeat: 100, symbol: L.Symbol.arrowHead({pixelSize: 15, pathOptions: {fillOpacity: 1, weight: 0}})}
            ]
        }));
        map.fitBounds(L.polyline(multiCoords).getBounds(), {animate:true, padding:L.point(100, 100)});
    });
}