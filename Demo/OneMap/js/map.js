/**
 * //=================================================================
 * //========================地图核心操作类=============================
 * //=================================================================
 * //=================================================================
 */

// ==============地图基础数据图层
var map = null; // 地图容器
var baseLayer = null; // 底图
var bussLayer = null; // 业务图层
var gridLayer = null; // 网格

// ==============业务事件模块使用的地图图层
var importantLayer = null; // 重点人员
var cameraLayer = null; // 摄像头
var energyLayer = null; // 警力
var alarmLayer = null; // 告警事件

// ==============综治力量模块使用的地图图层
var policeLayer = null; // 警察
var auxiliaryPoliceLayer = null; // 协警
var gridManLayer = null; // 网格员
var policeCarLayer = null; // 警车
var policeKioskLayer = null; // 警营亭
var securityStaffLayer = null; // 保安
var volunteerLayer = null; // 志愿者

// ==============特殊人群模块使用的地图图层
var routeLayer = null; // 特殊人群行踪轨迹图层

// ==============以图搜图
var blackLayer = null; // 以图搜图行踪轨迹图层

// ==============搜索框气泡
var locateLayer = null;

$(function () {

    $("input,button").on("click", function (e) {
        e.stopPropagation();
    });

    //========================================地图初始化===========================
    // 初始化地图容器
    map = L.map('viewDiv', {
        center: [30.44326443351204, 114.43944445432024],
        zoom: 18,
        maxBounds: [[29.9666558418404279, 113.7004008688582957], [31.3612494982628114, 115.0808047302495396]]
    });

    // 添加基础影像图层
    baseLayer = L.esri.tiledMapLayer({
        url: gis_2d_url + 'arcgis/rest/services/GoogleMap/MapServer',
        maxZoom: 21,
        minZoom: 12,
        zIndex:100
    });
    map.addLayer(baseLayer);

    bussLayer = L.esri.tiledMapLayer({
        url: gis_2d_url + 'arcgis/rest/services/OneMap3/MapServer',
        maxZoom: 21,
        minZoom: 12,
        zIndex:200
    });
    map.addLayer(bussLayer);

    // 网格图层
    gridLayer = L.featureGroup();

    // 综治力量图层
    policeLayer = L.featureGroup();
    auxiliaryPoliceLayer = L.featureGroup();
    gridManLayer = L.featureGroup();
    policeCarLayer = L.featureGroup();
    policeKioskLayer = L.featureGroup();
    securityStaffLayer = L.featureGroup();
    volunteerLayer = L.featureGroup();

    // 业务事件图层
    importantLayer = L.featureGroup();
    cameraLayer = L.featureGroup();
    map.addLayer(cameraLayer);
    energyLayer = L.featureGroup();
    alarmLayer = L.featureGroup();

    // 特殊人群图层
    routeLayer = L.featureGroup();

    // 以图搜图
    blackLayer = L.featureGroup();

    locateLayer = L.featureGroup();
    map.addLayer(locateLayer);

    // 获取token值并写入当前的cookie中
    var auth_token = getQueryString("auth-token");
    if (auth_token != null && auth_token != undefined && auth_token != "") {
        document.cookie = "auth-token=" + auth_token + ";Path=/";
    }
    //
    // var data = [{"name":"06","no":"06"},{"name":"16","no":"16"},{"name":"26","no":"26"},{"name":"调度台","no":"36"},{"name":"向苗苗","no":"46"},{"name":"严丹丹","no":"56"},{"name":"胡玉贞","no":"60"},{"name":"6000","no":"6000"},{"name":"6001","no":"6001"},{"name":"6002","no":"6002"},{"name":"6003","no":"6003"},{"name":"6004","no":"6004"},{"name":"6005","no":"6005"},{"name":"6006","no":"6006"},{"name":"6007","no":"6007"},{"name":"6008","no":"6008"},{"name":"6009","no":"6009"},{"name":"6010","no":"6010"},{"name":"6011","no":"6011"},{"name":"6012","no":"6012"},{"name":"6013","no":"6013"},{"name":"6014","no":"6014"},{"name":"6015","no":"6015"},{"name":"6016","no":"6016"},{"name":"6017","no":"6017"},{"name":"6018","no":"6018"},{"name":"6019","no":"6019"},{"name":"6020","no":"6020"},{"name":"6021","no":"6021"},{"name":"6022","no":"6022"},{"name":"6023","no":"6023"},{"name":"6024","no":"6024"},{"name":"6025","no":"6025"},{"name":"6026","no":"6026"},{"name":"6027","no":"6027"},{"name":"6028","no":"6028"},{"name":"6029","no":"6029"},{"name":"6030","no":"6030"},{"name":"6031","no":"6031"},{"name":"6032","no":"6032"},{"name":"6033","no":"6033"},{"name":"6034","no":"6034"},{"name":"6035","no":"6035"},{"name":"6036","no":"6036"},{"name":"6037","no":"6037"},{"name":"6038","no":"6038"},{"name":"6039","no":"6039"},{"name":"6040","no":"6040"},{"name":"6041","no":"6041"},{"name":"6042","no":"6042"},{"name":"6043","no":"6043"},{"name":"6044","no":"6044"},{"name":"6045","no":"6045"},{"name":"6046","no":"6046"},{"name":"6047","no":"6047"},{"name":"6048","no":"6048"},{"name":"6049","no":"6049"},{"name":"6050","no":"6050"},{"name":"6051","no":"6051"},{"name":"6052","no":"6052"},{"name":"6053","no":"6053"},{"name":"6054","no":"6054"},{"name":"6055","no":"6055"},{"name":"6056","no":"6056"},{"name":"6057","no":"6057"},{"name":"6058","no":"6058"},{"name":"6059","no":"6059"},{"name":"6060","no":"6060"},{"name":"6061","no":"6061"},{"name":"6062","no":"6062"},{"name":"6063","no":"6063"},{"name":"6064","no":"6064"},{"name":"6065","no":"6065"},{"name":"6066","no":"6066"},{"name":"6067","no":"6067"},{"name":"6068","no":"6068"},{"name":"6069","no":"6069"},{"name":"6070","no":"6070"},{"name":"6071","no":"6071"},{"name":"6072","no":"6072"},{"name":"6073","no":"6073"},{"name":"6074","no":"6074"},{"name":"6075","no":"6075"},{"name":"6076","no":"6076"},{"name":"6077","no":"6077"},{"name":"6078","no":"6078"},{"name":"6079","no":"6079"},{"name":"6080","no":"6080"},{"name":"6081","no":"6081"},{"name":"6082","no":"6082"},{"name":"6083","no":"6083"},{"name":"6084","no":"6084"},{"name":"6085","no":"6085"},{"name":"6086","no":"6086"},{"name":"6087","no":"6087"},{"name":"6088","no":"6088"},{"name":"6089","no":"6089"},{"name":"6090","no":"6090"},{"name":"6091","no":"6091"},{"name":"6092","no":"6092"},{"name":"6093","no":"6093"},{"name":"6094","no":"6094"},{"name":"6095","no":"6095"},{"name":"6096","no":"6096"},{"name":"6097","no":"6097"},{"name":"6098","no":"6098"},{"name":"6099","no":"6099"},{"name":"王琪","no":"61"},{"name":"熊豫","no":"62"},{"name":"钱欢欢","no":"63"},{"name":"姚旋","no":"64"},{"name":"王墁","no":"65"},{"name":"朱亚芳","no":"66"},{"name":"胡娟","no":"67"},{"name":"田露","no":"68"},{"name":"舒方峰","no":"69"},{"name":"舒娟娟","no":"76"},{"name":"86","no":"86"},{"name":"96","no":"96"}];
    // fillSearchContent(data);

    // 初始化
    $.ajax({
        type: "GET",
        url: baseUrl + "m/sysuser/n/valid",
        success: function (data) {
            initLayer("camera");
            initLayer("grid");

            // 测试
            //initLayer("power");
            //initLayer("alarm");
        },
        error: function (xhr) {
            // 请求登录
            if (xhr.status == 401) {
                //alert("访问数据出错，请检查是否登录");
            }
        }
    });

    $('.dropdown-toggle').dropdown();

    //========================================end===================================

    //=====================================地图事件=============================
    // 图层点击自动查询
    map.on("click", function (e) {
        identifyBuilding(e);
    });
    //========================================end===============================

    //=====================================地图底图切换==========================
    $("#mapType .map").on("click", function () {
        map.removeLayer(baseLayer);
        baseLayer = L.esri.tiledMapLayer({
            url: gis_2d_url + 'arcgis/rest/services/GoogleMap/MapServer',
            maxZoom: 24,
            minZoom: 16
        });
        map.addLayer(baseLayer);
        $("#mapType .mapTypeCard").removeClass("active");
        $(this).addClass("active");
    });

    $("#mapType .satelite").on("click", function () {
        map.removeLayer(baseLayer);
        baseLayer = L.esri.tiledMapLayer({
            url: gis_2d_url + 'arcgis/rest/services/GoogleSatelite/MapServer',
            maxZoom: 24,
            minZoom: 16
        });
        map.addLayer(baseLayer);
        $("#mapType .mapTypeCard").removeClass("active");
        $(this).addClass("active");
    });
    //=====================================end==========================

    //=======================================基础地图图层控制=======================
    $("input,button").on("click", function (e) {
        e.stopPropagation();
    });

    $(".title").on("click", function (e) {
        $(".subtitle").slideUp();
        $(this).next().slideDown();
        e.stopPropagation();
    });

    // 网格图层
    $("#grid").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(gridLayer);
            if (gridLayer.getLayers().length > 0) {
                map.flyToBounds(gridLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(gridLayer);
        }
    });
    $("#baseMap").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(baseLayer);
        } else {
            map.removeLayer(baseLayer);
        }
    });
    $("#bussMap").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(bussLayer);
        } else {
            map.removeLayer(bussLayer);
        }
    });

    //==========================================end=========================

    //=====================================特殊人群======================
    // 行径路线
    $("#route").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(routeLayer);
            if (routeLayer.getLayers().length > 0) {
                map.flyToBounds(routeLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(routeLayer);
        }
    });
    //=============================================end======================================


    //===========================================综治力量===================================
    // 警察
    $("#police").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(policeLayer);
            if (policeLayer.getLayers().length > 0) {
                map.flyToBounds(policeLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(policeLayer);
        }
    });
    // 协警
    $("#auxiliaryPolice").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(auxiliaryPoliceLayer);
            if (auxiliaryPoliceLayer.getLayers().length > 0) {
                map.flyToBounds(auxiliaryPoliceLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(auxiliaryPoliceLayer);
        }
    });
    // 网格员
    $("#gridMan").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(gridManLayer);
            if (gridManLayer.getLayers().length > 0) {
                map.flyToBounds(gridManLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(gridManLayer);
        }
    });
    // 警车
    $("#policeCar").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(policeCarLayer);
            if (policeCarLayer.getLayers().length > 0) {
                map.flyToBounds(policeCarLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(policeCarLayer);
        }
    });
    //警营亭
    $("#policeKiosk").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(policeKioskLayer);
            if (policeKioskLayer.getLayers().length > 0) {
                map.flyToBounds(policeKioskLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(policeKioskLayer);
        }
    });
    // 保安
    $("#securityStaff").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(securityStaffLayer);
            if (securityStaffLayer.getLayers().length > 0) {
                map.flyToBounds(securityStaffLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(securityStaffLayer);
        }
    });
    // 志愿者
    $("#volunteer").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(volunteerLayer);
            if (volunteerLayer.getLayers().length > 0) {
                map.flyToBounds(volunteerLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(volunteerLayer);
        }
    });
    //======================================end======================

    //================================业务事件==============
    // 重点人员
    $("#important").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(importantLayer);
            if (importantLayer.getLayers().length > 0) {
                map.flyToBounds(importantLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(importantLayer);
        }
    });
    // 摄像头
    $("#camera").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(cameraLayer);
            if (cameraLayer.getLayers().length > 0) {
                map.flyToBounds(cameraLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(cameraLayer);
        }
    });
    // 警力
    $("#energy").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(energyLayer);
            if (energyLayer.getLayers().length > 0) {
                map.flyToBounds(energyLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(energyLayer);
        }
    });
    // 告警事件
    $("#alarm").on("click", function () {
        if ($(this).prop("checked")) {
            map.addLayer(alarmLayer);
            if (alarmLayer.getLayers().length > 0) {
                map.flyToBounds(alarmLayer.getBounds(), {animate: true, padding: L.point(50, 50)});
            }
        } else {
            map.removeLayer(alarmLayer);
        }
    });
    //================================end======================

    //====================下拉选择框查询======================
    $(".searchDiv .dropdown-menu a").on("click", function () {
        $(".searchDiv .menuText").html($(this).html());
    });


    // 即时搜索
    $("#searchText").on("input propertychange", function () {
        if($(this).val().trim() != ""){
            $(".clearSearch").show();
        }else{
            $(".clearSearch").hide();
        }
        keySearch();
    });

    // 聚焦
    $("#searchText").on("focus", function () {
        $(".searchContent").show();
    });

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
    if (layerType === "camera") {
        // $.get("http://10.129.56.56:6080/arcgis/rest/services/CameraService/MapServer/0/query?where=1=1&outFields=*&f=json", function (data) {
        //     data = eval("(" + data + ")");
        //     data.features.forEach(function (feature) {
        //         var icon = L.divIcon({
        //             html: "<div class='popIcon camera'></div>"
        //         });
        //         var marker = L.marker([feature.attributes.lat, feature.attributes.lon], {icon: icon})
        //             .bindPopup(getPopupTemplate("摄像头信息", "<P>编号：" + feature.attributes.no + "</P>"
        //                 + "<P>名称：" + feature.attributes.name + "</P>"
        //                 + "<P>地址：" + feature.attributes.address + "</P>"
        //                 + "<P>类别：" + feature.attributes.type + "</P>"
        //                 + "<P>摄像头提供商：" + feature.attributes.support + "</P>"
        //                 + "<P>IP：" + feature.attributes.ip + "</P>"
        //                 + "<p><a onclick='openCamera(" + feature.attributes.no + ");'>打开摄像头</a></P>"), {className: "popTable"});
        //         cameraLayer.addLayer(marker);
        //     })
        // })
        $.get(gis_2d_url + "arcgis/rest/services/SafeCommunity/MapServer/5/query?where=1=1&outFields=*&f=json",function (data) {
            data = eval("(" + data + ")");
            data.features.forEach(function (feature) {
                var icon = L.divIcon({
                    html:"<div class='popIcon camera'></div>"
                });
                var marker = L.marker([feature.attributes.lat,feature.attributes.lon], {icon: icon})
                    .bindPopup(getPopupTemplate("摄像头信息","<P>编号：" + feature.attributes.no + "</P>"
                        + "<P>地址：" + feature.attributes.Name.split('/')[0] + "</P>"
                        + "<P>类别：" + feature.attributes.type + "</P>"
                        + "<p><a onclick='openCamera(this);'>打开摄像头</a></P>"),{className:"popTable"});
                cameraLayer.addLayer(marker);
            })
        })
    } else if (layerType === "grid") {
        $.get(baseUrl + "m/frontpage/layer?layers=GRIDER", function (data) {
            data.GRIDER.forEach(function (feature) {
                if (feature.region != null){
                    var rings = [];
                    feature.region.split(";").forEach(function (lngLat) {
                        rings.push([parseFloat(lngLat.split(',')[1]), parseFloat(lngLat.split(',')[0])]);
                    });
                    var polyline = L.polyline(rings, {stroke: true, color: '#00ff00'});
                    // 网格员
                    var gridMan = feature.griders.length > 0 ? feature.griders[0] : {realName: "", mobilephone: ""};
                    polyline.bindPopup(getPopupTemplate("网格信息", "<p>网格编号：" + feature.gridId + "</p>"
                        + "<p>网格名称：" + feature.gridName + "</p>"
                        + "<p>网格员：" + gridMan.realName + "</p>"
                        + "<p>联系电话：" + gridMan.mobilephone + "</p>"
                        + "<p>网格覆盖楼栋：" + feature.buildings + "</p>"), {className: "popTable"});
                    gridLayer.addLayer(polyline);
                }
            })
        })
    } else if (layerType === "important") {
        // $.get("http://172.29.1.20:8080/m/alarm/info/labels/latest?startTime=2017-12-28 15:20:07", function (data) {

        importantLayer.clearLayers();
        var deviceNoMap = {}; // 存储设备的编号，如果有重复，要适当偏移坐标
        data.forEach(function (info) {
            if (info.status === "未处理") {
                var no = info.alarmLocation.split("/")[2]; // 设备编号
                var captureImageUri = info.captureImageUri; // 抓拍的图片
                var icon = L.divIcon({
                    html: "<div class='importantPopup' style='background-image: url(" + baseUrl + captureImageUri + ")'></div>",
                });
                // 查询坐标
                var query = L.esri.query({
                    url: gis_2d_url + 'arcgis/rest/services/deviceService/MapServer/0'
                });
                query.where("no='" + no + "'").run(function (error, featureCollection) {
                    if (error || featureCollection == null || featureCollection.features.length == 0) {
                        return false;
                    }
                    if (deviceNoMap[no] == undefined) {
                        deviceNoMap[no] = 1;
                    } else {
                        deviceNoMap[no]++;
                    }
                    var feature = featureCollection.features[0].properties;
                    var longitude = feature.lon + 0.000010458 * 5 * (deviceNoMap[no] - 1); // 同一个地方计算偏移
                    var latitude = feature.lat;
                    var marker = L.marker([latitude, longitude], {icon: icon})
                        .bindPopup(getPopupTemplate("重点人员信息",
                            "<p>姓名：" + info.relationPerson + "</p>"
                            + "<p>身份证：" + info.identityCard + "</p>"
                            + "<p>出现时间：" + info.alarmTime + "</p>"
                            + "<p>出现地址：" + info.alarmLocation.split('/')[0] + "</p>"), {className: "importantTable important_" + info.id});
                    importantLayer.addLayer(marker);
                });
            }
        });
        // });
    } else if (layerType === "important_route") {
        // $.get("http://172.29.1.20:8080/m/alarm/info/personal/trace?startTime=2018-01-08 10:00:00&idno=420122196204052865", function (data) {

        routeLayer.clearLayers();
        var multiCoords = []; // 采集点的坐标
        var deviceNo = []; // 所有设备的编号信息
        var deviceNoAndCoords = {}; // 设备与坐标的匹配关系
        data.forEach(function (info) {
            if (info.alarmLocation.split("/").length == 3) {
                deviceNo.push(info.alarmLocation.split("/")[2]);
            }
        });
        var queryWhere = "";
        deviceNo.forEach(function (no) {
            queryWhere += "'" + no + "',";
        });
        if (deviceNo.length > 1) {
            queryWhere = queryWhere.substring(0, queryWhere.length - 1); // 去掉最后一个,
        }
        // 查询所有设备的坐标
        var query = L.esri.query({
            url: gis_2d_url + 'arcgis/rest/services/deviceService/MapServer/0'
        });
        query.where("no in (" + queryWhere + ")").run(function (error, featureCollection) {
            featureCollection.features.forEach(function (feature) {
                deviceNoAndCoords[feature.properties.no] = [feature.properties.lat, feature.properties.lon];
            });

            var deviceNoMap = {};
            // 整合数据
            data.forEach(function (info) {
                // 获取坐标
                if (info.alarmLocation.split("/").length == 3) {
                    var no = info.alarmLocation.split("/")[2];
                    if (deviceNoMap[no] == undefined) {
                        deviceNoMap[no] = 1;
                    } else {
                        deviceNoMap[no]++;
                    }
                    var deviceCoord = deviceNoAndCoords[no];
                    var longitude = deviceCoord[1] + 0.000010458 * 5 * (deviceNoMap[no] - 1); // 同一个地方计算偏移
                    var latitude = deviceCoord[0];

                    // 添加line的坐标
                    multiCoords.push([latitude, longitude]);
                    // 添加头像
                    var icon = L.divIcon({
                        html: "<div class='routeDiv'>" +
                        "<img src='" + baseUrl + info.captureImageUri + "'><span>" + info.content.split(" ")[1] + "</span>" +
                        "</div>"
                    });
                    var marker = L.marker([latitude, longitude], {icon: icon})
                        .bindPopup("<img width='720px' height='auto' style='margin-bottom: 5px;' src='" + baseUrl + info.fullImageUri + "'>", {className: "captureImage"});
                    routeLayer.addLayer(marker);
                }
            });

            // 添加直线
            routeLayer.addLayer(L.polyline(multiCoords, {color: "#EE4000"}));

            multiCoords.reverse();// 时间逆序

            // 添加箭头
            routeLayer.addLayer(L.polylineDecorator(multiCoords, {
                patterns: [
                    {
                        offset: 0,
                        repeat: 100,
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 15,
                            pathOptions: {color: "#EE4000", fillOpacity: 1, weight: 0}
                        })
                    }
                ]
            }));

            map.addLayer(routeLayer);

            $("#route").prop("checked", true);
        });
        // });
    } else if (layerType === "alarm") {
        //$.get("http://172.29.1.20:8080/m/alarm/info/nopage/list?status=%E6%9C%AA%E5%A4%84%E7%90%86&alarmType=event&bigScreen=yes&startTime=2018-03-24%2010:00:00", function (data) {

        alarmLayer.clearLayers();
        var deviceNoMap = {}; // 存储设备的编号，如果有重复，要适当偏移坐标
        data.forEach(function (info) {
            if (info.status === "未处理") {
                if (info.alarmLocation != null){
                    var no = info.alarmLocation.split("/")[2]; // 设备编号
                    var icon = L.divIcon({
                        html: "<div class='popIcon alarm'></div>"
                    });
                    // 查询坐标
                    var query = L.esri.query({
                        url: gis_2d_url + 'arcgis/rest/services/deviceService/MapServer/0'
                    });
                    query.where("no='" + no + "'").run(function (error, featureCollection) {
                        if (error || featureCollection == null || featureCollection.features.length == 0) {
                            return false;
                        }
                        if (deviceNoMap[no] == undefined) {
                            deviceNoMap[no] = 1;
                        } else {
                            deviceNoMap[no]++;
                        }
                        var feature = featureCollection.features[0].properties;
                        var longitude = feature.lon + 0.000010458 * 5 * (deviceNoMap[no] - 1); // 同一个地方计算偏移
                        var latitude = feature.lat;
                        var marker = L.marker([latitude, longitude], {icon: icon})
                            .bindPopup(getPopupTemplate("报警信息",
                                "<p>报警位置：" + info.alarmLocation.split("/")[0] + "</p>"
                                + "<p>报警时间：" + info.alarmTime + "</p>"
                                + "<p>报警内容：" + info.alarmDesc + "</p>"
                                + "</table>"), {className: "popTable alarm_" + info.id});
                        alarmLayer.addLayer(marker);
                    });
                }
            }
        });
        //});
    } else if (layerType === "power") {
        //$.get("http://172.29.1.20:8080/m/frontpage/power", function (data) {

            gridManLayer.clearLayers();
            policeLayer.clearLayers();
            auxiliaryPoliceLayer.clearLayers();
            securityStaffLayer.clearLayers();
            volunteerLayer.clearLayers();

            data.forEach(function (info) {
                if (info.groupName === "网格员") {
                    info.users.forEach(function (user) {
                        $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
                            if (location.latitude != undefined && location.longitude != undefined) {
                                var icon = L.icon({
                                    iconUrl: (user.onLineState == 0 ? "images/gridman_1.png" : "images/gridman.png"),
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 40],
                                    popupAnchor: [0, -40]
                                });
                                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("网格员信息",
                                    "<p>网格员：" + user.realName + "</p>"
                                    + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                                    + "<p>身份证：" + checkNull(user.idcard) + "</p>"
                                    + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                                    + "<p>所属网格：" + user.gridNames + "</p>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                                    + "</button>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                                    + "</button>"), {className: "gridman_" + user.userId});
                                gridManLayer.addLayer(marker);
                            }
                        })
                    });
                } else if (info.groupName === "警察") {
                    info.users.forEach(function (user) {
                        $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
                            if (location.latitude != undefined && location.longitude != undefined) {
                                var icon = L.icon({
                                    iconUrl: (user.onLineState == 0 ? "images/police_1.png" : "images/police.png"),
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 40],
                                    popupAnchor: [0, -40]
                                });
                                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("警察信息",
                                    "<p>警察：" + user.realName + "</p>"
                                    + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                                    + "<p>身份证：" + checkNull(user.idcard) + "</td></tr>"
                                    + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                                    + "<p>所属网格：" + user.gridNames + "</p>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                                    + "</button>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                                    + "</button>"), {className: "police_" + user.userId});
                                policeLayer.addLayer(marker);
                            }
                        })
                    });
                } else if (info.groupName === "协警") {
                    info.users.forEach(function (user) {
                        $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
                            if (location.latitude != undefined && location.longitude != undefined) {
                                var icon = L.icon({
                                    iconUrl: (user.onLineState == 0 ? "images/auxiliaryPolice_1.png" : "images/auxiliaryPolice.png"),
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 40],
                                    popupAnchor: [0, -40]
                                });
                                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("协警信息",
                                    "<p>协警：" + user.realName + "</p>"
                                    + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                                    + "<p>身份证：" + checkNull(user.idcard) + "</p>"
                                    + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                                    + "<p>所属网格：" + user.gridNames + "</p>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                                    + "</button>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                                    + "</button>"), {className: "auxiliaryPolice_" + user.userId});
                                auxiliaryPoliceLayer.addLayer(marker);
                            }
                        })
                    });
                } else if (info.groupName === "保安") {
                    info.users.forEach(function (user) {
                        $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
                            if (location.latitude != undefined && location.longitude != undefined) {
                                var icon = L.icon({
                                    iconUrl: (user.onLineState == 0 ? "images/security_1.png" : "images/security.png"),
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 40],
                                    popupAnchor: [0, -40]
                                });
                                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("保安信息",
                                    "<p>保安：" + user.realName + "</p>"
                                    + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                                    + "<p>身份证：" + checkNull(user.idcard) + "</p>"
                                    + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                                    + "<p>所属网格：" + user.gridNames + "</p>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                                    + "</button>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                                    + "</button>"), {className: "security_" + user.userId});
                                securityStaffLayer.addLayer(marker);
                            }
                        })
                    });
                } else if (info.groupName === "志愿者") {
                    info.users.forEach(function (user) {
                        $.get(baseUrl + "m/sysuser/s/currentlocation/" + user.userId, function (location) {
                            if (location.latitude != undefined && location.longitude != undefined) {
                                var icon = L.icon({
                                    iconUrl: (user.onLineState == 0 ? "images/volunteer_1.png" : "images/volunteer.png"),
                                    iconSize: [40, 40],
                                    iconAnchor: [20, 40],
                                    popupAnchor: [0, -40]
                                });
                                var marker = L.marker([location.latitude, location.longitude], {icon: icon}).bindPopup(getPopupTemplate("志愿者信息",
                                    "<p>志愿者：" + user.realName + "</p>"
                                    + "<p>联系电话：" + checkNull(user.mobilephone) + "</p>"
                                    + "<p>身份证：" + checkNull(user.idcard) + "</p>"
                                    + "<p>状态：" + (user.onLineState == 0 ? '离线' : '在线') + "</p>"
                                    + "<p>所属网格：" + user.gridNames + "</p>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSinglePhone(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 语音通话"
                                    + "</button>"
                                    + "<button type='button' class='btn btn-default btn-call' onclick='callSingleVideo(" + user.userId + ")'>"
                                    + "<span class='glyphicon glyphicon-phone-alt'></span> 视频通话"
                                    + "</button>"), {className: "volunteer_" + user.userId});
                                volunteerLayer.addLayer(marker);
                            }
                        });
                    });
                }
            });
        //});
    } else if (layerType === "blacklist") {

        var multiCoords = []; // 采集点的坐标
        var deviceNo = []; // 所有设备的编号信息
        var deviceNoAndCoords = {}; // 设备与坐标的匹配关系
        data.forEach(function (info) {
            if (info.location.split("/").length == 3) {
                deviceNo.push(info.location.split("/")[2]);
            }
        });
        var queryWhere = "";
        deviceNo.forEach(function (no) {
            queryWhere += "'" + no + "',";
        });
        if (deviceNo.length > 1) {
            queryWhere = queryWhere.substring(0, queryWhere.length - 1); // 去掉最后一个,
        }
        // 查询所有设备的坐标
        var query = L.esri.query({
            url: gis_2d_url + 'arcgis/rest/services/deviceService/MapServer/0'
        });
        query.where("no in (" + queryWhere + ")").run(function (error, featureCollection) {
            featureCollection.features.forEach(function (feature) {
                deviceNoAndCoords[feature.properties.no] = [feature.properties.lat, feature.properties.lon];
            });
            var deviceNoMap = {}; // 存储设备的编号，如果有重复，要适当偏移坐标
            // 整合数据
            data.forEach(function (info, index) {
                // 获取坐标
                if (info.location.split("/").length == 3) {

                    var no = info.location.split("/")[2];

                    if (deviceNoMap[no] == undefined) {
                        deviceNoMap[no] = 1;
                    } else {
                        deviceNoMap[no]++;
                    }

                    var deviceCoord = deviceNoAndCoords[no];
                    var longitude = deviceCoord[1] + 0.000010458 * 5 * (deviceNoMap[no] - 1); // 同一个地方计算偏移
                    var latitude = deviceCoord[0];

                    // 添加line的坐标
                    multiCoords.push([latitude, longitude]);
                    // 添加头像
                    var icon = L.divIcon({
                        html: "<div class='routeDiv'>" +
                        "<img style='cursor: default' src='" + baseUrl + info.imageUrl + "'>" +
                        "<span style='cursor: default;'>" + info.captureTime.split(" ")[1] + "</span>" +
                        (index == data.length - 1 ? "<img onclick='closeBlank()' class='closeBtn'>" : "") +
                        "</div>"
                    });
                    var marker = L.marker([latitude, longitude], {icon: icon});
                    blackLayer.addLayer(marker);
                }
            });

            // 添加直线
            blackLayer.addLayer(L.polyline(multiCoords, {color: "#EE4000"}));

            // 添加箭头
            blackLayer.addLayer(L.polylineDecorator(multiCoords, {
                patterns: [
                    {
                        offset: 0,
                        repeat: 100,
                        symbol: L.Symbol.arrowHead({
                            pixelSize: 15,
                            pathOptions: {color: "#EE4000", fillOpacity: 1, weight: 0}
                        })
                    }
                ]
            }));
            map.addLayer(blackLayer);
            map.flyToBounds(L.polygon(multiCoords).getBounds(), {animate: true, padding: L.point(50, 50)});
        });
    }
}

/**
 * 图层修改
 * @param layerType
 */
function updateLayer(layerType, data) {
    if (layerType === "important_route") {
        map.removeLayer(routeLayer); // 取消显示
        $("#route").prop("checked", false);
    } else if (layerType === "alarm") {
        // 取消之前的闪缩
        alarmLayer.eachLayer(function (layer) {
            // 如果是相同的位置，则删掉之前的
            var location = $(layer.getPopup().getContent()).find("tr").eq(0).find("td").eq(1).html();
            if (location === data.alarmLocation.split("/")[0]) {
                alarmLayer.removeLayer(layer);
            } else {
                layer.setIcon(L.divIcon({
                    html: "<div class='popIcon alarm'></div>"
                }));
            }
        });
        // 添加最新的一个告警
        var no = data.alarmLocation.split("/")[2]; // 设备编号
        var icon = L.divIcon({
            html: "<div class='popIcon alarm blink-fast'></div>"
        });
        // 查询坐标
        var query = L.esri.query({
            url: gis_2d_url + 'arcgis/rest/services/deviceService/MapServer/0'
        });
        query.where("no='" + no + "'").run(function (error, featureCollection) {
            if (error || featureCollection == null || featureCollection.features.length == 0) {
                return false;
            }
            var feature = featureCollection.features[0].properties;
            var longitude = feature.lon;
            var latitude = feature.lat;
            var marker = L.marker([latitude, longitude], {icon: icon})
                .bindPopup(getPopupTemplate("最新报警信息",
                    "<p>报警位置：" + data.alarmLocation.split("/")[0] + "</p>"
                    + "<p>报警时间：" + data.alarmTime + "</p>"
                    + "<p>报警内容：" + data.alarmDesc + "</p>"), {className: "popTable"});
            alarmLayer.addLayer(marker);
            map.addLayer(alarmLayer);
            $("#alarm").prop("checked", true);
            marker.openPopup();
            map.flyTo(marker.getLatLng(), 21, {animate: true}); // 居中
        });
    }
}

/**
 * 居中重点人员
 */
function centerImportant(data) {
    if (data != "" && typeof(data) === "string") {
        data = eval("(" + data + ")");
    }
    if (!map.hasLayer(importantLayer)) {
        map.addLayer(importantLayer);
        $("#important").prop("checked", true);
    }
    importantLayer.eachLayer(function (layer) {
        var className = layer.getPopup().options.className;
        if (className.indexOf("important_" + data.id) != -1) {
            layer.openPopup();
            map.panTo(layer.getLatLng(), {animate: true});
            return false;
        }
    });
}

/**
 * 居中告警位置
 * @param data
 */
function centerAlarm(data) {
    if (data != "" && typeof(data) === "string") {
        data = eval("(" + data + ")");
    }
    if (!map.hasLayer(alarmLayer)) {
        map.addLayer(alarmLayer);
        $("#alarm").prop("checked", true);
    }
    alarmLayer.eachLayer(function (layer) {
        var className = layer.getPopup().options.className;
        if (className.indexOf("alarm_" + data.id) != -1) {
            layer.openPopup();
            map.panTo(layer.getLatLng(), {animate: true});
            return false;
        }
    });
}

/**
 * 刷新综治力量
 * @param data
 */
function refreshPower(data) {
    initLayer("power", data);
}

/**
 * 居中综治力量人员
 * @param obj
 */
function centerPower(data) {
    if (data != "" && typeof(data) === "string") {
        data = eval("(" + data + ")");
    }
    if (data.groupName === "网格员") {
        if (!map.hasLayer(gridManLayer)) {
            map.addLayer(gridManLayer);
            $("#gridMan").prop("checked", true);
        }
        gridManLayer.eachLayer(function (layer) {
            var className = layer.getPopup().options.className;
            if (className === "gridman_" + data.userId) {
                layer.openPopup();
                map.panTo(layer.getLatLng(), {animate: true});
                return false;
            }
        });
    } else if (data.groupName === "警察") {
        if (!map.hasLayer(policeLayer)) {
            map.addLayer(policeLayer);
            $("#police").prop("checked", true);
        }
        policeLayer.eachLayer(function (layer) {
            var className = layer.getPopup().options.className;
            if (className === "police_" + data.userId) {
                layer.openPopup();
                map.panTo(layer.getLatLng(), {animate: true});
                return false;
            }
        });
    } else if (data.groupName === "协警") {
        if (!map.hasLayer(auxiliaryPoliceLayer)) {
            map.addLayer(auxiliaryPoliceLayer);
            $("#auxiliaryPolice").prop("checked", true);
        }
        auxiliaryPoliceLayer.eachLayer(function (layer) {
            var className = layer.getPopup().options.className;
            if (className === "auxiliaryPolice_" + data.userId) {
                layer.openPopup();
                map.panTo(layer.getLatLng(), {animate: true});
                return false;
            }
        });
    } else if (data.groupName === "保安") {
        if (!map.hasLayer(securityStaffLayer)) {
            map.addLayer(securityStaffLayer);
            $("#securityStaff").prop("checked", true);
        }
        securityStaffLayer.eachLayer(function (layer) {
            var className = layer.getPopup().options.className;
            if (className === "security_" + data.userId) {
                layer.openPopup();
                map.panTo(layer.getLatLng(), {animate: true});
                return false;
            }
        });
    } else if (data.groupName === "志愿者") {
        if (!map.hasLayer(volunteerLayer)) {
            map.addLayer(volunteerLayer);
            $("#volunteer").prop("checked", true);
        }
        volunteerLayer.eachLayer(function (layer) {
            var className = layer.getPopup().options.className;
            if (className === "volunteer_" + data.userId) {
                layer.openPopup();
                map.panTo(layer.getLatLng(), {animate: true});
                return false;
            }
        });
    }
}

/**
 * 关闭以图搜图轨迹
 */
function closeBlank() {
    blackLayer.clearLayers();
    map.removeLayer(blackLayer);
}

/**
 * 人脸识别搜索
 */
function searchMessage() {
    sendUIMessage("人脸检索", "");
}

/**
 * 群组对讲
 */
function callPhone() {
    sendUIMessage("群组对讲", "");
}

/**
 * 点击识别楼栋信息
 */
function identifyBuilding(e) {
    var latlng = e.latlng;
    L.esri.identifyFeatures({
        url: gis_2d_url + 'arcgis/rest/services/SafeCommunity/MapServer'
    })
    .on(map)
    .at([latlng.lat, latlng.lng])
    .layers('all:7')
    .run(function (error, featureCollection, response) {
        if (error === undefined && featureCollection != undefined && featureCollection.features.length > 0) {
            var feature = featureCollection.features[0].properties;
            L.popup().setLatLng(latlng).setContent(
                getPopupTemplate("楼栋基础信息", "<p>街道:" + feature.District + "</p>" +
                    "<p>社区:" + feature.Community + "</p>" +
                    "<p>楼栋名称:" + feature.buildno + "</p>")
            ).openOn(map);
            sendUIMessage("查看建筑", feature.Name);
        }
    });
}

/**
 * 自定义气泡模板
 * @param title 气泡标题
 * @param content 气泡内容html
 * @returns {string}
 */
function getPopupTemplate(title, content) {
    return "<div class='popContent'>" +
        "<div class='popHead'><div class='popTitle'>" + title + "</div></div>" +
        "<div class='popBody'>" + content + "</div>" +
        "<div class='popFoot'></div>" +
        "</div>";
}

/**
 * 打开摄像头
 * @param obj
 */
function openCamera(feature) {
    var type = $(feature).parent().prev().html().split("：")[1];
    var addr = $(feature).parent().prev().prev().html().split("：")[1];
    var no = $(feature).parent().prev().prev().prev().html().split("：")[1];
    sendUIMessage("视频信息", addr + "/" + type + "/" + no);
}

/**
 * 搜索框
 */
function keySearch() {
    var type = $("#searchType").find(".menuText").text();
    var text = $("#searchText").val().trim();

    if (text === ""){
        $(".searchContent ul").empty();
        return true;
    }

    if (type === "调度人员") {
        sendUIMessage("搜索调度人员", text); // 搜索调度人员
    } else {
        $.get(baseUrl + "m/frontpage/key?key=" + encodeURI(text), function (data) {
            if (isEmptyObject(data)) {
                $(".searchContent ul").empty();
            } else {
                $(".searchContent ul").empty();
                $.each(data, function (key, value) {
                    if (key === "RESIDENT") {
                        for (var i = 0; i < value.length; i++) {
                            var person = value[i]; // 人
                            var houses = person.houses; // 对应房屋
                            if (houses.length == 0) {
                                return ture;
                            }
                            var house = houses[0].houseInfo;
                            var html = "<li>" +
                                "<a onclick=\"showPerson(this)\">" + person.name + "</a>" +
                                "<span>" + house.buildingInfo.fullBuildingName + "/" + house.unitNumber + "单元" + "/" +
                                house.floorNumber + leftPad(house.houseNumber, 2) + "</span>" +
                                "</li>";
                            $(".searchContent ul").append(html);
                        }
                    } else if (key === "BUILDING") {
                        for (var i = 0; i < value.length; i++) {
                            var building = value[i]; // 楼栋
                            var html = " <li>" +
                                "<a onclick=\"showBuilding(this)\">" + building.fullBuildingName + "</a>" +
                                "</li>";
                            $(".searchContent ul").append(html);
                        }
                    }
                });
            }
        })
    }
}

/**
 * 调度人员接口回调
 * @param data
 */
function fillSearchContent(data) {
    if (data != "" && typeof(data) === "string") {
        data = eval("(" + data + ")");
    }
    $(".searchContent ul").empty();
    data.forEach(function (person) {
        var html = "<li>" +
            "<span>" + person.name + "</span>" +
            "<span>" + person.no + "</span>" +
            "<button onclick='callSinglePhone(" + person.no + ")'>语音</button>" +
            "<button onclick='callSingleVideo(" + person.no + ")'>视频</button>" +
            "<span>在线</span>"+
            "</li>";
        $(".searchContent ul").append(html);
    })
}

/**
 * 单人对讲
 * @param no
 */
function callSinglePhone(no) {
    //alert(no);
    sendUIMessage("语音呼叫", no.toString());
}

/**
 * 单人视频通话
 * @param no
 */
function callSingleVideo(no) {
    //alert(no);
    sendUIMessage("视频呼叫", no.toString());
}

/**
 * 显示查询到的人所在位置
 */
function showPerson(obj) {
    var house = $(obj).next().text();
    house = house.substring(0, house.indexOf('栋') + 1);
    locatePlace(house);
}

/**
 * 显示查询到的建筑
 * @param obj
 */
function showBuilding(obj) {
    var build = $(obj).text();
    locatePlace(build);
}

/**
 * 定位
 * @param buildName
 */
function locatePlace(buildName) {
    // 查询坐标
    var query = L.esri.query({
        url: gis_2d_url + 'arcgis/rest/services/SafeCommunity/MapServer/7'
    });
    query.where("Name='" + buildName + "'").run(function (error, featureCollections) {
        if (error || featureCollections == null || featureCollections.features.length == 0) {
            //alert("未知的位置信息，无法定位");
            return false;
        }
        var buildInfo = featureCollections.features[0].properties;
        var buildMarker = L.marker([buildInfo.lat, buildInfo.lon]);
        locateLayer.addLayer(buildMarker);
        map.panTo(buildMarker.getLatLng());
    });
}

/**
 * 关闭搜索定位信息
 */
function removePin() {
    locateLayer.clearLayers();
    $(".clearSearch").hide();
    $("#searchText").val("");
    $(".searchContent ul").empty();
}