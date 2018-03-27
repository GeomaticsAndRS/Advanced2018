// 地图 = http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}
// 卫星 = http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}
// 卫星标注 = http://webst0{1-4}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}

// 弹框气泡对象
var container = document.getElementById('popup');
var title = document.getElementById('popup-title');
var body = document.getElementById('popup-body');
var overlay = new ol.Overlay(({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    },
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -14]
}));

// 两化企业
var enterpriseLayer = null;
// 一般隐患
var generalDanderLayer = null;
// 重大隐患
var majorDangerLayer = null;

// 创建一个Map对象
var map = new ol.Map({
    // 图层(数据)
    layers: [
        // Tile(瓦片类型图层)
        new ol.layer.Tile({
            // 瓦片数据源
            source: new ol.source.XYZ({
                url: "http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
            })
        })
    ],
    // 对应的dom元素
    target: 'map',
    // 视图(渲染)
    view: new ol.View({
        // 地图中心点（默认为EPSG:3857坐标系统），需要EPSG:4326经纬度转换
        center: ol.proj.fromLonLat([114.43944445432024, 30.44326443351204]),
        zoom: 12
    }),
    overlays: [overlay] // 覆盖物
});

map.on("click", function (e) {
    var feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
        return feature;
    });
    if (feature) {
        var coordinate = feature.getGeometry().getCoordinates();
        overlay.setPosition(coordinate);
        $(title).html(feature.get("name"));
        var type = feature.get("type");
        if (type === 1) {
            $(body).html("代表人：" + feature.get("represent") +
                "<br>联系电话：" + feature.get("tel") +
                "<br>注册日期：" + feature.get("date") +
                "<br>主管部门：" + feature.get("department"));
        } else if (type === 2) {
            $(body).html("隐患名称：" + feature.get("ld_name") +
                "<br>来源：" + getSource(feature.get("source_type")) +
                "<br>填报日期：" + feature.get("fd_date") +
                "<br>排查日期：" + feature.get("fill_date") +
                "<br>截止日期：" + feature.get("till_date") +
                "<br>整改完成日期：" + feature.get("finish_date") +
                "<br>整改状态：" + getStatus(feature.get("ld_status")));
        }

        $(container).show();
    } else {
        $(container).hide();
    }
});

// 修改鼠标样式
map.on("pointermove", function (e) {
    var hit = map.hasFeatureAtPixel(e.pixel);
    $("#map").css("cursor", (hit ? 'pointer' : ''));
});


var hasCoor_1 = 0;
var noCoor_1 = 0;

// 添加数据
$("#enterprise").on("change", function () {
    if ($(this).prop("checked")) {
        map.addLayer(enterpriseLayer);
    } else {
        map.removeLayer(enterpriseLayer);
    }
    showCoorText();
});

var hasCoor_2 = 0;
var noCoor_2 = 0;

$("#general").on("change", function () {
    if ($(this).prop("checked")) {
        map.addLayer(generalDanderLayer);
    } else {
        map.removeLayer(generalDanderLayer);
    }
    showCoorText();
});

var hasCoor_3 = 0;
var noCoor_3 = 0;

$("#major").on("change", function () {
    if ($(this).prop("checked")) {
        map.addLayer(majorDangerLayer);
    } else {
        map.removeLayer(majorDangerLayer);
    }
    showCoorText();
});


/**
 * 初始化图层
 * @param layerType 图层类型 required
 * @param data 附带的数据 optional
 */
function initLayer(layerType, data) {
    // 如果接受的是json字符串将其转换为json对象
    if (data != "" && typeof(data) === "string") {
        data = eval("(" + data + ")");
    }
    if (layerType === "enterprise") {

        // 重置统计数量
        hasCoor_1 = 0;
        noCoor_1 = 0;

        map.removeLayer(enterpriseLayer); // 剔除图层
        enterpriseLayer = null; // 重置为空

        // 数据集
        var data = data.results;

        // 要素集
        var features = [];

        data.forEach(function (item) {

            // 如果没有经纬度，则跳过
            if (parseFloat(item.ent_longitude) == 0.0) {
                noCoor_1++;
            } else {
                hasCoor_1++;
                // 创建要素
                var iconFeature = new ol.Feature({
                    type: 1,
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([item.ent_longitude, item.ent_latitude])), // 几何对象(required)
                    name: item.ent_name,
                    represent: item.legal_representative,
                    tel: item.ent_prtel,
                    date: item.ent_regdate,
                    department: item.ent_department
                });
                // 定义要素样式
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        src: item.ent_operation_status == 1 ? "./img/normalRunning.png" : "./img/stopRunning.png"
                    })
                });
                // 给要素设置样式
                iconFeature.setStyle(iconStyle);
                features.push(iconFeature);
            }
        });

        // 初始化图层
        enterpriseLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: features
            })
        });
    } else if (layerType === "general") {
        hasCoor_2 = 0;
        noCoor_2 = 0;
        map.removeLayer(generalDanderLayer); // 剔除图层
        generalDanderLayer = null; // 重置为空
        var data = data.results;
        var features = [];

        data.forEach(function (item) {

            if (parseFloat(item.ld_longitude) == 0.0) {
                noCoor_2++;
            } else {
                hasCoor_2++;
                if (item.ld_status === 2) { // 整改中
                    // 要素对象
                    var iconFeature = new ol.Feature({
                        type: 2,
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([item.ld_longitude, item.ld_latitude])), // 几何对象(required)
                        name: item.ent_name, // 企业名称
                        ld_name: item.ld_name, // 隐患名称
                        source_type: item.ld_source_type, // 来源
                        fd_date: item.fd_date, //填报日期
                        fill_date: item.fill_date, // 排查日期
                        till_date: item.till_date, // 截止日期
                        finish_date: item.finish_date, // 整改完成日期
                        ld_status: item.ld_status // 整改状态
                    });
                    // 定义要素样式
                    var iconStyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            src: "./img/checkDan.png"
                        })
                    });
                    iconFeature.setStyle(iconStyle);
                    features.push(iconFeature);
                }
            }
        });

        generalDanderLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: features
            })
        });
    } else if (layerType === "major") {
        hasCoor_3 = 0;
        noCoor_3 = 0;
        map.removeLayer(majorDangerLayer); // 剔除图层
        majorDangerLayer = null; // 重置为空
        var data = data.results;
        var features = [];

        data.forEach(function (item) {
            // if (parseFloat(item.ld_longitude) == 0.0) {
            //     noCoor_3++;
            // } else {
            //     hasCoor_3++;
            //     if (item.ld_status === 2) { // 整改中
            //         // 要素对象
            //         var iconFeature = new ol.Feature({
            //             type: 2,
            //             geometry: new ol.geom.Point(ol.proj.fromLonLat([item.ld_longitude, item.ld_latitude])), // 几何对象(required)
            //             name: item.ent_name, // 企业名称
            //             ld_name: item.ld_name, // 隐患名称
            //             source_type: item.ld_source_type, // 来源
            //             fd_date: item.fd_date, //填报日期
            //             fill_date: item.fill_date, // 排查日期
            //             till_date: item.till_date, // 截止日期
            //             finish_date: item.finish_date, // 整改完成日期
            //             ld_status: item.ld_status // 整改状态
            //         });
            //         // 定义要素样式
            //         var iconStyle = new ol.style.Style({
            //             image: new ol.style.Icon({
            //                 src: "./img/checkDan.png"
            //             })
            //         });
            //         iconFeature.setStyle(iconStyle);
            //         features.push(iconFeature);
            //     }
            // }
        });
        majorDangerLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: features
            })
        });
    }
}


function getSource(source) {
    if (source === 1) {
        return "登记隐患";
    } else if (source === 2) {
        return "检查隐患";
    } else if (source === 3) {
        return "督察隐患";
    } else return "未知来源";
}

function getStatus(status) {
    if (status === 2) {
        return "整改中";
    } else if (status === 3) {
        return "已整改";
    }
}

function showCoorText() {
    var totalHas = 0;
    var totalNo = 0;
    if ($("#enterprise").prop("checked")) {
        totalHas += hasCoor_1;
        totalNo += noCoor_1;
    }
    if ($("#general").prop("checked")) {
        totalHas += hasCoor_2;
        totalNo += noCoor_2;
    }
    if ($("#major").prop("checked")) {
        totalHas += hasCoor_3;
        totalNo += noCoor_3;
    }
    $(".yes").html("有坐标：" + totalHas + "记录");
    $(".no").html("无坐标：" + totalNo + "记录");

    if ($("#layerSwitch input[type='checkbox']:checked").length == 0) {
        $(".com_look").hide();
    } else {
        $(".com_look").show();
    }
}
