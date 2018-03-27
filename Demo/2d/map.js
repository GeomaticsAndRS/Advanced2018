var map = null; // 地图容器
var baseLayer = null; // 底图
// var baseRoadLayer        = null; // 路网底图
var buildLayer = null; // 楼栋平面图
var importantLayer = null;
var helpLayer = null;
var gridAdministrator = null;
var gridNetLayer = null;
var waitWorkSheetLayer = null;
var keyWordLayer = null;

var highlightLayer = null; // 高亮图层
var houseColorLayer = null; // 房屋分色图层

// 定义10种人员的显示颜色与气泡图片
var getTypePin = {
    // 英文
    "emancipist": {color: "#7ac3ff", picture: "pin/emancipist.png"},     // 刑满释放
    "rectify": {color: "#6db81f", picture: "pin/rectify.png"},     // 社区矫正
    "pertition": {color: "#9792f7", picture: "pin/pertition.png"},   // 非法上访
    "drug": {color: "#c687fa", picture: "pin/drug.png"},   // 吸毒
    "alloeosis": {color: "#ffb966", picture: "pin/alloeosis.png"},   // 精神障碍
    "aids": {color: "#ff8caa", picture: "pin/aids.png"},   // 艾滋病
    "teenager": {color: "#2da3f7", picture: "pin/teenager.png"},   // 重点青少年
    "suballow": {color: "#87dbfa", picture: "pin/suballow.png"},   // 低保
    "disabled": {color: "#8caaff", picture: "pin/disabled.png"},   // 残障
    "livealone": {color: "#66ddff", picture: "pin/livealone.png"},   // 独居老人

    // 中文
    "刑满释放人员": {color: "#7ac3ff", picture: "pin/emancipist.png"},     // 刑满释放
    "社区矫正人员": {color: "#6db81f", picture: "pin/rectify.png"},     // 社区矫正
    "非法上访人员": {color: "#9792f7", picture: "pin/pertition.png"},   // 非法上访
    "吸毒人员": {color: "#c687fa", picture: "pin/drug.png"},   // 吸毒
    "肇事肇祸等严重精神障碍患者": {color: "#ffb966", picture: "pin/alloeosis.png"},   // 精神障碍
    "艾滋病危险人员": {color: "#ff8caa", picture: "pin/aids.png"},   // 艾滋病
    "重点青少年": {color: "#2da3f7", picture: "pin/teenager.png"},   // 重点青少年
    "低保人员": {color: "#87dbfa", picture: "pin/suballow.png"},   // 低保
    "残障人士": {color: "#8caaff", picture: "pin/disabled.png"},   // 残障
    "独居老人": {color: "#66ddff", picture: "pin/livealone.png"},   // 独居老人

    "multiple": {color: "#ea0000", picture: "pin/multiple.png"}  // 多种类型
};

var importantFlag = "刑满释放人员、社区矫正人员、非法上访人员、吸毒人员、肇事肇祸等严重精神障碍患者、艾滋病危险人员、重点青少年";
var helpFlag = "低保人员、残障人士、独居老人";

$(function () {

    //===============================地图初始化===============================//

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
        minZoom: 13,
        position: 'back'
    });
    map.addLayer(baseLayer);

    // 添加楼栋要素图层
    // buildLayer = L.esri.featureLayer({
    //     url: 'http://10.129.56.56:6080/arcgis/rest/services/SafeCommunity/FeatureServer/7',
    //     style:{
    //         stroke:true,
    //         color:'#3388ff',
    //         weight:3,
    //         fill:true,
    //         fillColor:'#FFDAB9',
    //         fillOpacity:1,
    //         className: "buildLayer"
    //     }
    // });
    // map.addLayer(buildLayer);

    // 添加基础路网\楼栋名称图层
    buildLayer = L.esri.dynamicMapLayer({
        url: gis_2d_url + "arcgis/rest/services/SafeCommunity2/MapServer",
        layers: [6, 7, 8, 9 , 10, 11, 12, 13]
        // url: "http://10.129.56.56:6080/arcgis/rest/services/OneMap3/MapServer",
        // maxZoom: 21,
        // minZoom: 13
    });
    map.addLayer(buildLayer);

    // 初始化其他图层
    importantLayer = L.featureGroup(); // 重点人员
    helpLayer = L.featureGroup(); // 帮扶人员
    gridAdministrator = L.featureGroup(); // 网格员
    gridNetLayer = L.featureGroup(); // 网格
    waitWorkSheetLayer = L.featureGroup(); // 待办工单统计
    keyWordLayer = L.featureGroup(); // 关键字
    highlightLayer = L.featureGroup();
    houseColorLayer = L.featureGroup();

    // 添加重点人员marker图层
    map.addLayer(importantLayer);
    // 添加帮扶人员marker图层
    map.addLayer(helpLayer);
    // 添加网格员marker图层
    map.addLayer(gridAdministrator);
    // 添加网格
    map.addLayer(gridNetLayer);
    // 添加待办工单markder图层
    map.addLayer(waitWorkSheetLayer);
    // 添加关键字marker图层
    map.addLayer(keyWordLayer);
    map.addLayer(highlightLayer);

    //================================================注册事件===============================================//

    var importantState = null;
    var helpState = null;
    $("#toggleControl #btn_close").on("click", function () {
        $("#layerSwitch").fadeOut();
        $(".keyInputDiv").fadeOut();
        $("#mapSwitch").fadeOut();
        $(this).hide();
        $("#btn_open").show();
        importantState = $("#important").is(":hidden");
        helpState = $("#help").is(":hidden");
        $("#important").fadeOut();
        $("#help").fadeOut();
    });
    $("#toggleControl #btn_open").on("click", function () {
        $("#layerSwitch").fadeIn();
        $(".keyInputDiv").fadeIn();
        $("#mapSwitch").fadeIn();
        $(this).hide();
        $("#btn_close").show();
        if (!importantState) {
            $("#important").fadeIn();
        }
        if (!helpState) {
            $("#help").fadeIn();
        }
    });

    $("#mapBtn").on("click", function () {
        map.removeLayer(baseLayer);
        baseLayer = L.esri.tiledMapLayer({
            url: gis_2d_url + 'arcgis/rest/services/GoogleMap/MapServer',
            maxZoom: 21,
            minZoom: 13,
            position: 'back'
        });
        map.addLayer(baseLayer);
        $("#mapBtn").toggle();
        $("#sateliteBtn").toggle();
    });

    $("#sateliteBtn").on("click", function () {
        map.removeLayer(baseLayer);
        baseLayer = L.esri.tiledMapLayer({
            url: gis_2d_url + 'arcgis/rest/services/GoogleSatelite/MapServer',
            maxZoom: 21,
            minZoom: 13,
            position: 'back'
        });
        map.addLayer(baseLayer);
        $("#mapBtn").toggle();
        $("#sateliteBtn").toggle();
    });

    $("input,button").on("click", function (e) {
        e.stopPropagation();
    });

    $("#importantTag").on("click", function () {
        $("#important input:not(:disabled)").prop("checked", $(this).prop("checked"));
        showImportants();
    });
    $("#important input").on("click", function () {
        showImportants();
    });

    $("#helpTag").on("click", function () {
        $("#help input").prop("checked", $(this).prop("checked"));
        showHelps();
    });
    $("#help input").on("click", function () {
        showHelps();
    });

    $(".more").on("click", function () {
        if ($(this).hasClass("normal")) {

            // 判断是否已有打开的二级菜单
            if ($("#layerSwitch li a.expand").length > 0) {
                $("#layerSwitch li").removeClass("active");
                $("#layerSwitch li a.expand").addClass("normal");
                $("#layerSwitch li a.expand").removeClass("expand");
                $("#important").fadeOut();
                $("#help").fadeOut();
            }

            $(this).removeClass("normal");
            $(this).addClass("expand");
            $(this).parent().parent().find("li").removeClass("active");
            $(this).parent().addClass("active");
            if ($(this).hasClass("i")) {
                $("#important").fadeIn();
            } else {
                $("#help").fadeIn();
            }
        } else {
            $(this).removeClass("expand");
            $(this).addClass("normal");
            $(this).parent().removeClass("active");
            if ($(this).hasClass("i")) {
                $("#important").fadeOut();
            } else {
                $("#help").fadeOut();
            }
        }

    });


    // 待办工单
    $("#pageTag").on("click", function () {
        if ($(this).prop("checked")) {
            showWorkSheets();
        } else {
            waitWorkSheetLayer.clearLayers();
        }
    });

    // 网格员查询触发
    $("#griderTag").on("click", function () {
        if ($(this).prop("checked")) {
            showGriders();
        } else {
            gridAdministrator.clearLayers();
        }
    });

    // 图层点击自动查询
    map.on("click", function (e) {
        identifyBuilding(e);
    });

    map.on("popupopen", function (e) {
        $("#layerSwitch li").removeClass("active");
        $("#layerSwitch li a.expand").addClass("normal");
        $("#layerSwitch li a.expand").removeClass("expand");
        $("#important").fadeOut();
        $("#help").fadeOut();
    })

    // 注册地图缩放事件
    map.on("zoomend", function () {
        showZoomInfo();
    });

    keyWordLayer.on("popupclose", function () {
        keyWordLayer.clearLayers();
    });

    // 房屋分色
    $("#letTag").on("click", function () {
        if ($(this).prop("checked")) {
            houseDifferColor();
        } else {
            houseResetColor();
        }
    });

    // 模糊查询
    $("#searchValue").autocomplete({
        source: function (request, response) {
            $.get(baseUrl + "m/frontpage/key?key=" + encodeURI(request.term), function (data) {
                var result = [];
                if (isEmptyObject(data)) {
                    result.push({
                        value: "没有查询到记录",
                        type: "n"
                    });
                } else {
                    $.each(data, function (key, value) {
                        if (key === "RESIDENT") {
                            value.forEach(function (person) {
                                var houses = person.houses; // 检查该人员是否有关联的房屋
                                if (houses.length == 0) {
                                    result.push({
                                        id: person.residentBaseId,
                                        value: person.name,
                                        house: "",
                                        type: "p"
                                    });
                                    return true;
                                }
                                var house = houses[0].houseInfo;
                                result.push({
                                    id: person.residentBaseId,
                                    label: person.name + " --- " + house.buildingInfo.fullBuildingName.replace(new RegExp('/', 'g'), '') +
                                    house.unitNumber + "单元" + house.floorNumber + leftPad(house.houseNumber, 2),
                                    value: person.name,
                                    house: house.buildingInfo.fullBuildingName + "/" + house.unitNumber + "单元" + "/" + house.floorNumber + leftPad(house.houseNumber, 2),
                                    type: "p"
                                });
                            })
                        } else if (key === "BUILDING") {
                            value.forEach(function (building) {
                                result.push({
                                    id: building.buildingId,
                                    building: building.fullBuildingName,
                                    value: building.fullBuildingName.replace(new RegExp('/', 'g'), ''),
                                    type: "b"
                                });
                            })
                        }
                    });
                }
                response(result);
            });
        },
        select: function (event, ui) {
            if (ui.item.type === "b") {
                $("#searchValue").attr({"type": ui.item.type, "no": ui.item.id, "item": ui.item.building});
                searchKey();
            } else if (ui.item.type === "p") {
                if (ui.item.house === "") {
                    alert(ui.item.value + " 还未与房屋关联，请及时补充相关信息");
                    $("#searchValue").attr({"type": "", "no": "", "item": ""});
                } else {
                    $("#searchValue").attr({"type": ui.item.type, "no": ui.item.id, "item": ui.item.house});
                    searchKey();
                }
            } else if (ui.item.type === "n") {
                alert("没有查询到此记录");
                $("#searchValue").attr({"type": "", "no": "", "item": ""});
            }
        }
    });
    $("#searchBtn").on("click", function () {
        var term = $("#searchValue").val();
        $.get(baseUrl + "m/frontpage/key?key=" + encodeURI(term), function (data) {
            if (isEmptyObject(data)) {
                alert("没有查询到记录");
            } else if (data.RESIDENT != null && data.RESIDENT.length == 1 && data.BUILDING == undefined) {
                var person = data.RESIDENT[0];
                var houses = person.houses; // 检查该人员是否有关联的房屋
                if (houses.length == 0) {
                    alert(person.name + " 还未与房屋关联，请及时补充相关信息");
                } else {
                    var house = houses[0].houseInfo;
                    $("#searchValue").attr({
                        "type": "p",
                        "no": person.residentBaseId,
                        "item": house.buildingInfo.fullBuildingName + "/" + house.unitNumber + "单元" + "/" + house.floorNumber + leftPad(house.houseNumber, 2)
                    });
                    searchKey();
                }
            } else if (data.BUILDING != null && data.BUILDING.length == 1 && data.RESIDENT == undefined) {
                var building = data.BUILDING[0];
                $("#searchValue").attr({"type": "b", "no": building.buildingId, "item": building.building});
                searchKey();
            } else {
                $("#searchValue").autocomplete("search", term);
            }
        });
    });
});

function searchKey() {
    var id = $("#searchValue").attr("no"); // 人或楼栋编号
    var type = $("#searchValue").attr("type"); // 标识人或楼栋
    var item = $("#searchValue").attr("item"); // 房屋名或者楼栋名
    if (id == undefined || id == null || id === "undefined" || id === "") {
        return false;
    } else {
        keySearch(id, type, item);
    }
}

/**
 * 关键字搜索
 * @param id
 * @param type
 * @param item
 */
function keySearch(id, type, item) {
    if (type === "b") {
        // 查询坐标
        var query = L.esri.query({
            url: gis_2d_url + 'arcgis/rest/services/SafeCommunity/MapServer/7'
        });
        query.where("Name='" + item + "'").run(function (error, featureCollections) {
            if (error || featureCollections == null || featureCollections.features.length == 0) {
                //alert("尚不支持该楼栋");
                return false;
            }
            var buildInfo = featureCollections.features[0].properties;
            $.get(baseUrl + "m/frontpage/getBi?uid=" + id + "&layerType=BUILDING", function (building) {
                var buildMarker = L.marker([buildInfo.lat, buildInfo.lon])
                    .bindPopup(
                        "<table class='table table-bordered table-striped table-hover' style='width: 350px!important;'>" +
                        "<tr><td rowspan='9' style='text-align: center;width: 118px;display: none'>" +
                        "<img src='" + checkPicture(building.picUrl) + "' width='100px' height='auto' /></td>" +
                        "<td style='width: 65px'>楼栋ID</td><td>" + building.buildingId + "</td></tr>" +
                        "<tr><td>楼栋名称</td><td>" + building.buildingName + "</td></tr>" +
                        "<tr><td>楼栋用途</td><td>" + getBuildingType(building.buildingPurpose) + "</td></tr>" +
                        "<tr><td>商铺数量</td><td>" + building.shops + "</td></tr>" +
                        "<tr><td>自住数量</td><td>" + building.owners + "</td></tr>" +
                        "<tr><td>租户数量</td><td>" + building.tenants + "</td></tr>" +
                        "<tr><td>企业房屋</td><td>" + building.firms + "</td></tr>" +
                        "<tr><td>租住比例</td><td>" + building.usage + "%</td></tr>" +
                        "<tr><td colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/roomInfoxq.html?buildingId=" + building.buildingId + "\', \'_blank\'))\">详情</a></td></tr>" +
                        "</table>"
                    );
                keyWordLayer.addLayer(buildMarker);
                buildMarker.openPopup();
                map.panTo(buildMarker.getLatLng());
            });
        });
    } else {
        item = item.substring(0, item.indexOf('栋') + 1);
        // 查询坐标
        var query = L.esri.query({
            url: gis_2d_url + 'arcgis/rest/services/SafeCommunity/MapServer/7'
        });
        query.where("name='" + item + "'").run(function (error, featureCollections) {
            if (error || featureCollections == null || featureCollections.features.length == 0) {
                // alert("尚不支持该楼栋");
                return false;
            }
            var buildInfo = featureCollections.features[0].properties;
            $.get(baseUrl + "m/frontpage/getBi?uid=" + id + "&layerType=RESIDENT", function (person) {
                var buildMarker = L.marker([buildInfo.lat, buildInfo.lon])
                    .bindPopup(
                        "<table class='table table-bordered table-striped table-hover' style='width: 345px!important;'>" +
                        "<tr style='text-align: center;display: none;'><td rowspan='7'>" +
                        "<img src='" + checkPicture(person.picture) + "' width='100px' height='auto' /></td>" +
                        "<td>人员ID</td><td>" + person.residentBaseId + "</td></tr>" +
                        "<tr><td>人员姓名</td><td>" + person.name + "</td></tr>" +
                        "<tr><td>性别</td><td>" + getSex(person.sex) + "</td></tr>" +
                        "<tr><td>身份证号</td><td>" + checkNull(person.idNo) + "</td></tr>" +
                        "<tr><td>联系方式</td><td>" + checkNull(person.contact) + "</td></tr>" +
                        "<tr><td>职业</td><td>" + checkNull(person.profession) + "</td></tr>" +
                        "<tr><td colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" + person.residentBaseId + "\', \'_blank\'))\">详情</a></td></tr>" +
                        "</table>"
                    );
                keyWordLayer.addLayer(buildMarker);
                buildMarker.openPopup();
                map.panTo(buildMarker.getLatLng());
            });
        });
    }
}

/**
 * 显示重点人员信息统计
 * @returns {boolean}
 */
function showImportants() {

    importantLayer.clearLayers(); // 清空图层内容
    var type = "";
    $("#important input:checked").each(function () {
        type += $(this).attr("id") + ",";
    });
    if (type === "") {
        $("#importantTag")[0].indeterminate = false; // 取消半选
        $("#importantTag").prop("checked", false);
        return false;
    } else {
        type = type.substr(0, type.length - 1); // 去掉最后一个,号
        if (type.split(",").length == 4) {
            $("#importantTag")[0].indeterminate = false; // 取消半选
            $("#importantTag").prop("checked", true);
        } else if (type.split(",").length < 4) {
            $("#importantTag")[0].indeterminate = true; // 半选
        }
    }
    $.get(baseUrl + "m/frontpage/layer?layers=HAZARDOUS&subLayers=" + type, function (response) {
        var data = new Array();
        response.HAZARDOUS.forEach(function (building) {
            if (building.specialCrowd == null || isEmptyObject(building.specialCrowd)) {
                return true;
            }
            data.push(building);
        });
        data.forEach(function (building) {
            var buildId = building.buildingId;
            var buildName = building.street + "/" + building.community + "/" + building.buildingName;
            // 查询坐标
            var query = L.esri.query({
                url: gis_2d_url + 'arcgis/rest/services/SafeCommunity/MapServer/7'
            });
            query.where("name='" + buildName + "'").run(function (error, featureCollection) {
                if (error || featureCollection == null || featureCollection.features.length == 0) {
                    //  alert("尚不支持该楼栋");
                    return false;
                }
                var feature = featureCollection.features[0].properties;
                var coordinate = {"longitude": feature.lon, "latitude": feature.lat};
                var importants = building.specialCrowd; // 重点人员集合
                var keys = []; // 重点人员标签集合
                var sum = 0; // 重点人员数量
                $.each(importants, function (key, value) {
                    if (value != 0 && importantFlag.indexOf(key) != -1) {
                        keys.push(key);
                        sum += parseInt(value);
                    }
                });
                var icon = null;
                if (keys.length == 0) {
                    console.log("尚无重点人员");
                    return false;
                } else if (keys.length == 1) {
                    // 单种人员，单色显示
                    icon = L.divIcon({
                        html: "<div class='iconDiv' style='background-image: url(" + getTypePin[keys[0]].picture + ")'>" +
                        "<p class='iconDiv_number' style='color: " + getTypePin[keys[0]].color + "'>" + sum + "</p></div>",
                        iconSize: [28, 45],
                        iconAnchor: [14, 45]
                    });
                } else {
                    // 有多种重点人员，则用红色气泡标识
                    icon = L.divIcon({
                        html: "<div class='iconDiv' style='background-image: url(" + getTypePin["multiple"].picture + ")'>" +
                        "<p class='iconDiv_number' style='color: " + getTypePin["multiple"].color + "'>" + sum + "</p></div>",
                        iconSize: [28, 45],
                        iconAnchor: [14, 45]
                    });
                }
                var marker = L.marker([coordinate.latitude, coordinate.longitude], {icon: icon})
                    .bindPopup(function () {
                        map.panTo(marker.getLatLng());
                        $.get(baseUrl + "m/frontpage/getBi?uid=" + buildId + "&layerType=HAZARDOUS&subLayers=" + type, function (response) {
                            // 待数据查询后 填充容器
                            response.residents.forEach(function (resident) {
                                $(marker.getPopup().getElement()).find("table tbody").append(
                                    "<tr>" +
                                    "<td style='display: none'>" + resident.residentBaseId + "</td>" +
                                    "<td>" + resident.name + "</td>" +
                                    "<td>" + getSex(resident.sex) + "</td>" +
                                    "<td>" + getOccupation(resident.occupation) + "</td>" +
                                    "<td>" + checkNull(resident.currentResidence) + "</td>" +
                                    "<td><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" + resident.residentBaseId + "\', \'_blank\'))\">详情</a></td>" +
                                    "</tr>"
                                );
                            });
                            var height = $(marker.getPopup().getElement()).height(); // 获取气泡的高度
                            if (height > $(window).height() / 2 - 140) {
                                // 超过了容器高度
                                map.panBy(L.point(0, $(window).height() / 2 - 140 - height));
                            }
                        });
                        // 预先返回一个能固定位置和大小的容器*******这是重点**************
                        return "<table style='width: 380px!important;text-align: center' class='table table-bordered table-striped table-hover'>" +
                            "<thead>" +
                            "<tr>" +
                            "<td style='display: none;'>ID</td><td>姓名</td><td>性别</td><td>类别</td><td>房号</td><td>详情</td>" +
                            "</tr>" +
                            "</thead>" +
                            "<tbody>" +
                            "</tbody>" +
                            "</table>";
                    }, {className: 'importantPopup'});
                importantLayer.addLayer(marker);
            });
        });
    });
}

/**
 * 显示帮扶人员信息统计
 * @returns {boolean}
 */
function showHelps() {

    helpLayer.clearLayers(); // 清空图层内容
    var type = "";
    $("#help input:checked").each(function () {
        type += $(this).attr("id") + ",";
    });
    if (type === "") {
        $("#helpTag")[0].indeterminate = false; // 取消半选
        $("#helpTag").prop("checked", false);
        return false;
    } else {
        type = type.substr(0, type.length - 1); // 去掉最后一个,号
        if (type.split(",").length == 3) {
            $("#helpTag")[0].indeterminate = false; // 取消半选
            $("#helpTag").prop("checked", true);
        } else if (type.split(",").length < 3) {
            $("#helpTag")[0].indeterminate = true; // 半选
        }
    }

    $.get(baseUrl + "m/frontpage/layer?layers=OLDANDWEAK&subLayers=" + type, function (response) {
        var data = new Array();
        response.OLDANDWEAK.forEach(function (building) {
            if (building.specialCrowd == null || isEmptyObject(building.specialCrowd)) {
                return true;
            }
            data.push(building);
        });
        data.forEach(function (building) {
            var buildId = building.buildingId;
            var buildName = building.street + "/" + building.community + "/" + building.buildingName;
            // 查询坐标
            var query = L.esri.query({
                url: gis_2d_url + 'arcgis/rest/services/SafeCommunity/MapServer/7'
            });
            query.where("name='" + buildName + "'").run(function (error, featureCollection) {
                if (error || featureCollection == null || featureCollection.features.length == 0) {
                    //  alert("尚不支持该楼栋");
                    return false;
                }
                var feature = featureCollection.features[0].properties;
                var coordinate = {"longitude": feature.lon, "latitude": feature.lat};
                var helps = building.specialCrowd; // 帮扶人员集合
                var keys = new Array(); // 帮扶人员标签集合
                var sum = 0; // 帮扶人员数量
                $.each(helps, function (key, value) {
                    if (value != 0 && helpFlag.indexOf(key) != -1) {
                        keys.push(key);
                        sum += parseInt(value);
                    }
                });
                var icon = null;
                if (keys.length == 0) {
                    console.log("尚无帮扶人员");
                    return false;
                } else if (keys.length == 1) {
                    // 单种人员，单色显示
                    icon = L.divIcon({
                        html: "<div class='iconDiv' style='background-image: url(" + getTypePin[keys[0]].picture + ")'>" +
                        "<p class='iconDiv_number' style='color: " + getTypePin[keys[0]].color + "'>" + sum + "</p></div>",
                        iconSize: [28, 45],
                        iconAnchor: [14, 45]
                    });
                } else {
                    // 有多种重点人员，则用红色气泡标识
                    icon = L.divIcon({
                        html: "<div class='iconDiv' style='background-image: url(" + getTypePin["multiple"].picture + ")'>" +
                        "<p class='iconDiv_number' style='color: " + getTypePin["multiple"].color + "'>" + sum + "</p></div>",
                        iconSize: [28, 45],
                        iconAnchor: [14, 45]
                    });
                }
                var marker = L.marker([coordinate.latitude, coordinate.longitude + 0.000052], {icon: icon})
                    .bindPopup(function () {
                        map.panTo(marker.getLatLng());
                        $.get(baseUrl + "m/frontpage/getBi?uid=" + buildId + "&layerType=OLDANDWEAK&subLayers=" + type, function (response) {
                            // 待数据查询后 填充容器
                            response.residents.forEach(function (resident) {
                                $(marker.getPopup().getElement()).find("table tbody").append(
                                    "<tr>" +
                                    "<td style='display: none;'>" + resident.residentBaseId + "</td>" +
                                    "<td>" + resident.name + "</td>" +
                                    "<td>" + getSex(resident.sex) + "</td>" +
                                    "<td>" + getOccupation(resident.occupation) + "</td>" +
                                    "<td>" + checkNull(resident.currentResidence) + "</td>" +
                                    "<td><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" + resident.residentBaseId + "\', \'_blank\'))\">详情</a></td>" +
                                    "</tr>"
                                );
                            });
                            var height = $(marker.getPopup().getElement()).height(); // 获取气泡的高度
                            if (height > $(window).height() / 2 - 140) {
                                // 超过了容器高度
                                map.panBy(L.point(0, $(window).height() / 2 - 140 - height));
                            }
                        });
                        return "<table style='width: 380px!important;text-align: center' class='table table-bordered table-striped table-hover'>" +
                            "<thead>" +
                            "<tr>" +
                            "<td style='display: none'>ID</td><td>姓名</td><td>性别</td><td>类别</td><td>房号</td><td>详情</td>" +
                            "</tr>" +
                            "</thead>" +
                            "<tbody>" +
                            "</tbody>" +
                            "</table>";
                    }, {className: 'helpPopup'});
                helpLayer.addLayer(marker);
            });
        });
    });
}

// 显示待办工单
function showWorkSheets() {
    $.get(baseUrl + "m/frontpage/layer?layers=WORKORDER", function (response) {
        var workSheets = response.WORKORDER;
        workSheets.forEach(function (sheet) {
            var buildName = sheet.gridName;
            if (buildName === "其他") { // 未定位到楼栋的工单，单独在旁边显示
                var sheetNum = sheet.workOrderCount; // 楼栋待办工单数量
                var icon = L.divIcon({
                    html: "<div class='workDiv'><div class='workNum'>" + sheetNum + "</div></div>",
                    iconSize: [48, 48],
                    iconAnchor: [24, 48]
                });
                var sheetMarker = L.marker([30.4431506227736, 114.44117233157161], {icon: icon}).bindPopup(
                    "<div class='workPop'>其他待办工单 <b>" + sheetNum + "</b> 起" + "</div>",
                    {className: 'workPopup'}
                );
                waitWorkSheetLayer.addLayer(sheetMarker);
            } else {
                // var buildId = sheet.gridId; // 楼栋ID
                var houseNum = sheet.region; // 楼栋房屋总数
                var sheetNum = sheet.workOrderCount; // 楼栋待办工单数量

                if (houseNum.indexOf(";") != -1) {
                    // 此时返回的是网格总数
                    var rings = [];
                    houseNum.split(";").forEach(function (lnglat) {
                        rings.push([parseFloat(lnglat.split(',')[1]), parseFloat(lnglat.split(',')[0])]);
                    });
                    var polygon = L.polygon(rings, {
                        stroke: true,
                        color: '#00ff00',
                        fill: false,
                        fillColor: '#FFC0CB',
                        fillOpacity: 0.4
                    });
                    waitWorkSheetLayer.addLayer(polygon); // 添加网格信息

                    var icon = L.divIcon({
                        html: "<div class='workDiv'><div class='workNum'>" + sheetNum + "</div></div>",
                        iconSize: [48, 48],
                        iconAnchor: [24, 48]
                    });
                    var sheetMarker = L.marker(polygon.getCenter(), {icon: icon}).bindPopup(
                        "<div class='workPop'><b>" + buildName + "</b> 总共有待办工单 <b>" + sheetNum + "</b> 起" + "</div>",
                        {className: 'workPopup'}
                    ).on("popupopen", function (event) {
                        map.panTo(sheetMarker.getLatLng());
                    });
                    waitWorkSheetLayer.addLayer(sheetMarker);
                } else {
                    // 查询坐标
                    var query = L.esri.query({
                        url: gis_2d_url + 'arcgis/rest/services/SafeCommunity/MapServer/7'
                    });
                    query.where("name='" + buildName + "'").run(function (error, featureCollection) {
                        if (error || featureCollection == null || featureCollection.features.length == 0) {
                            return false;
                        }
                        var feature = featureCollection.features[0].properties;
                        var longitude = feature.lon;
                        var latitude = feature.lat;

                        var icon = L.divIcon({
                            html: "<div class='workDiv'><div class='workNum'>" + sheetNum + "</div></div>",
                            iconSize: [48, 48],
                            iconAnchor: [24, 48]
                        });
                        var sheetMarker = L.marker([latitude, longitude + 0.000052 * 3], {icon: icon}).bindPopup(
                            "<div class='workPop'><b>" + buildName.split("/")[2].replace("栋", "") + "</b> 栋 总共有 " +
                            "<b>" + houseNum + "</b> 房<br/>有待办工单 <b>" + sheetNum + "</b> 起" + "</div>",
                            {className: 'workPopup'}
                        ).on("popupopen", function (event) {
                            map.panTo(sheetMarker.getLatLng());
                        });
                        waitWorkSheetLayer.addLayer(sheetMarker);
                    });
                }
            }
        });
    });
}

/**
 * 显示网格员
 */
function showGriders() {

    $.get(baseUrl + "m/frontpage/layer?layers=GRIDER", function (response) {
        var grids = response.GRIDER;
        grids.forEach(function (grid) {
            var rings = [];
            grid.region.split(";").forEach(function (lnglat) {
                rings.push([parseFloat(lnglat.split(',')[1]), parseFloat(lnglat.split(',')[0])]);
            });
            var polygon = L.polygon(rings, {
                stroke: true,
                color: '#00ff00',
                fill: false,
                fillColor: '#FFC0CB',
                fillOpacity: 0.4
            });
            gridAdministrator.addLayer(polygon); // 添加网格信息

            grid.griders.forEach(function (grider, index) {
                var icon = L.icon({
                    iconUrl: '../img/person.png',
                    iconSize: [36, 36]
                });
                var latlng = null;
                if (index == 0) {
                    latlng = polygon.getCenter()
                } else {
                    latlng = [polygon.getCenter().lat, polygon.getCenter().lng + 0.000052 * index]; // 相距5m
                }
                var adminMarker = L.marker(latlng, {icon: icon}).bindPopup(function () {
                    map.panTo(adminMarker.getLatLng());
                    $.get(baseUrl + "m/sysuser/s/user/" + grider.userId, function (response) {
                        if (response.pic === "") {
                            $(adminMarker.getPopup().getElement()).find("table img").attr("src", "../img/default.jpg");
                        } else {
                            $(adminMarker.getPopup().getElement()).find("table img").attr("src", "data:image/png;base64," + response.pic);
                        }
                    });
                    return "<table style='width: 350px!important;' class='table table-bordered table-striped table-hover'>" +
                        "<tr><td rowspan='4' style='display: none'><img width='100px' height='150px'/></td>" +
                        "<td>所属网格号</td><td>" + grid.gridName + "</td></tr>" +
                        "<tr><td>姓名</td><td>" + grider.realName + "</td></tr>" +
                        "<tr><td>工号</td><td>" + checkNull(grider.idcard) + "</td></tr>" +
                        "<tr><td>联系方式</td><td>" + checkNull(grider.mobilephone) + "</td></tr>" +
                        "</table>"
                });
                gridAdministrator.addLayer(adminMarker);
            });
        });
    });
}

/**
 * 房屋分色显示
 */
function houseDifferColor() {
    $.get(baseUrl + "m/frontpage/layer?layers=BUILDING", function (response) {
        response.BUILDING.forEach(function (build) {
            var buildName = build.buildingName;
            var rate = parseFloat(build.usage);
            var color = "";
            if (rate > 70) {
                //color = "#FF4500";
                color = "red";
            } else if (rate > 35) {
                //color = "#FFD700";
                color = "yellow";
            } else {
                // color = "#90EE90";
                color = "green";
            }
            // 查询坐标
            var query = L.esri.query({
                url: gis_2d_url + 'arcgis/rest/services/SafeCommunity/MapServer/7'
            });
            query.where("name='" + buildName + "'").run(function (error, featureCollection, response) {
                if (error || featureCollection.features.length == 0) {
                    //  alert("尚不支持该楼栋");
                    return false;
                }
                houseColorLayer.addLayer(L.geoJSON(featureCollection.features, {
                    style: {
                        color: 'magenta',
                        weight: 2,
                        fill: true,
                        fillColor: color,
                        fillOpacity:0.8
                    }
                }));
                map.addLayer(houseColorLayer);
            });
        });
    });
    // 显示图例
    $("#houseRentRate").show();
}

/**
 * 重置房屋分色显示
 */
function houseResetColor() {
    map.removeLayer(houseColorLayer);
    // 隐藏图例
    $("#houseRentRate").hide();
}

/**
 * 当地图缩放到一定层级时，显示相关信息
 */
function showZoomInfo() {
    if (map.getZoom() == 19) {
        // 显示重点人员统计数量
        if ($("#importantTag").prop("checked")) {
            $.get(baseUrl + "m/frontpage/layer?layers=GRIDER", function (response) {
                var grids = response.GRIDER;
                if (gridNetLayer.getLayers().length == 0) {
                    grids.forEach(function (info) {
                        var rings = [];
                        info.region.split(";").forEach(function (lnglat) {
                            rings.push([parseFloat(lnglat.split(',')[1]), parseFloat(lnglat.split(',')[0])]);
                        });
                        var polygon = L.polygon(rings, {
                            stroke: true,
                            color: '#FFD700',
                            fill: true,
                            fillColor: '#FFC0CB',
                            fillOpacity: 0.6
                        });
                        gridNetLayer.addLayer(polygon);
                        var myIcon = L.divIcon({
                            html: "<div class='worksheet grid_" + info.gridId + "'>" + info.gridName + "有 " + info.hazardousCount + " 名重点人员</div>"
                        });
                        var marker = L.marker(polygon.getCenter(), {icon: myIcon});
                        gridNetLayer.addLayer(marker);
                    })
                } else {
                    grids.forEach(function (info) {
                        $(".worksheet.grid_" + info.gridId).append("<br>" + info.gridName + "有 " + info.hazardousCount + " 名重点人员");
                    });
                }
            });
        }
        // 显示帮扶人员统计数量
        if ($("#helpTag").prop("checked")) {
            $.get(baseUrl + "m/frontpage/layer?layers=GRIDER", function (response) {
                var grids = response.GRIDER;
                if (gridNetLayer.getLayers().length == 0) {
                    grids.forEach(function (info) {
                        var rings = [];
                        info.region.split(";").forEach(function (lnglat) {
                            rings.push([parseFloat(lnglat.split(',')[1]), parseFloat(lnglat.split(',')[0])]);
                        });
                        var polygon = L.polygon(rings, {
                            stroke: true,
                            color: '#FFD700',
                            fill: true,
                            fillColor: '#FFC0CB',
                            fillOpacity: 0.6
                        });
                        gridNetLayer.addLayer(polygon);
                        var myIcon = L.divIcon({
                            className: "grid_" + info.gridId, // 用于识别icon
                            html: "<div class='worksheet grid_" + info.gridId + "'>" + info.gridName + "有 " + info.oldAndWeakCount + " 名帮扶人员</div>"
                        });
                        var marker = L.marker(polygon.getCenter(), {icon: myIcon});
                        gridNetLayer.addLayer(marker);
                    })
                } else {
                    grids.forEach(function (info) {
                        $(".worksheet.grid_" + info.gridId).append("<br>" + info.gridName + "有 " + info.oldAndWeakCount + " 名帮扶人员");
                    });
                }
            });
        }
        // 显示工单统计数量
        if ($("#pageTag").prop("checked")) {
            $.get(baseUrl + "m/frontpage/layer?layers=WORKORDER&subLayers=sd", function (response) {
                var grids = response.WORKORDER;
                if (gridNetLayer.getLayers().length == 0) {
                    grids.forEach(function (info) {
                        var rings = [];
                        info.region.split(";").forEach(function (lnglat) {
                            rings.push([parseFloat(lnglat.split(',')[1]), parseFloat(lnglat.split(',')[0])]);
                        });
                        var polygon = L.polygon(rings, {
                            stroke: true,
                            color: '#00ff00',
                            fill: false,
                            fillColor: '#FFC0CB',
                            fillOpacity: 0.6
                        });
                        gridNetLayer.addLayer(polygon);
                        var myIcon = L.divIcon({
                            className: "grid_" + info.gridId, // 用于识别icon
                            html: "<div class='worksheet grid_" + info.gridId + "'>" + info.gridName + "有 " + info.workOrderCount + " 起待办工单</div>"
                        });
                        var marker = L.marker(polygon.getCenter(), {icon: myIcon});
                        gridNetLayer.addLayer(marker);
                    })
                } else {
                    grids.forEach(function (info) {
                        $(".worksheet.grid_" + info.gridId).append("<br>" + info.gridName + "有 " + info.workOrderCount + " 起待办工单");
                    });
                }
            });
        }
    } else {
        gridNetLayer.clearLayers(); // 清空
    }
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
                var buildName = feature.Name;
                buildName = buildName.replace(new RegExp('/', 'g'), ''); // identify识别出来的是别名
                $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(buildName) + "&layerType=BUILDING", function (building) {
                    if (building.buildingId != 0) {
                        L.popup().setLatLng(latlng).setContent(
                            "<table style='width: 350px!important;' class='table table-bordered table-striped table-hover'> " +
                            "<tr><td rowspan='9' style='text-align: center;width: 118px;display: none'>" +
                            "<img src='" + checkPicture(building.picUrl) + "' width='100px' height='auto' /></td>" +
                            "<td style='width: 65px;display: none'>楼栋ID</td><td style='display: none;'>" + building.buildingId + "</td></tr>" +
                            "<tr><td>楼栋名称</td><td>" + building.buildingName + "</td></tr>" +
                            "<tr><td>楼栋用途</td><td>" + getBuildingType(building.buildingPurpose) + "</td></tr>" +
                            "<tr><td>商铺数量</td><td>" + building.shops + "</td></tr>" +
                            "<tr><td>自住数量</td><td>" + building.owners + "</td></tr>" +
                            "<tr><td>租户数量</td><td>" + building.tenants + "</td></tr>" +
                            "<tr><td>企业房屋</td><td>" + building.firms + "</td></tr>" +
                            "<tr><td>租住比例</td><td>" + building.usage + "%</td></tr>" +
                            "<tr><td colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/roomInfoxq.html?buildingId=" + building.buildingId + "\', \'_blank\'))\">详情</a></td></tr>" +
                            "</table>")
                            .openOn(map)
                            .on("remove", function () {
                                highlightLayer.clearLayers();
                            });
                        highlightLayer.addLayer(L.geoJSON(featureCollection.features, {
                            style: {
                                color: 'magenta',
                                weight: 2,
                                fill: true,
                                fillColor: 'green',
                                fillOpacity:0.8
                            }
                        }));
                        map.panTo(latlng);
                    }
                });
            }
        });
}