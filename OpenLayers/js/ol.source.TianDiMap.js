/**
 * 扩展天地图
 * @param options
 * @constructor
 */

ol.source.TianDiMap = function (options) {

    // 处理用户自定义的属性
    var options = options ? options : {};
    var attributions;
    if (options.attributions !== undefined) {
        attributions = options.attributions;
    } else {
        attributions = [ol.source.TianDiMap.ATTRIBUTION];
    }

    // 设置天地图的url
    var url;
    if (options.mapType === "地图") {
        url = "http://t{0-4}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}";
    }else if (options.mapType === "卫星") {
        url = "http://t{0-4}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}";
    } else if (options.mapType == "卫星标签") {
        url = "http://t{0-4}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}";
    } else if (options.mapType == "地图标签") {
        url = "http://t{0-4}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}";
    }

    // 设置其他的属性
    ol.source.XYZ.call(this, {
        attributions: attributions,
        projection: ol.proj.get('EPSG:3857'),
        cacheSize: options.cacheSize !== undefined ? options.cacheSize : 2048, // Default is 2048.
        crossOrigin: 'anonymous',
        opaque: options.opaque !== undefined ? options.opaque : true,
        maxZoom: options.maxZoom !== undefined ? options.maxZoom : 19,
        reprojectionErrorThreshold: options.reprojectionErrorThreshold,
        tileLoadFunction: options.tileLoadFunction,
        url: url,
        wrapX: options.wrapX
    });
}

// 设置TianDiMap是XYZ的继承关系
ol.inherits(ol.source.TianDiMap, ol.source.XYZ);

// 天地图的属性说明
ol.source.TianDiMap.ATTRIBUTION = new ol.Attribution({
    html: '&copy; <a class="ol-attribution-tianmap" ' + 'href="http://www.tianditu.cn/">' + '天地图</a>'
});