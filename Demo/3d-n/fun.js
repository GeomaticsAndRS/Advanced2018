/**
 * 获取当前视角
 */
function getCamera() {
    var heading = scene.camera.heading;
    var pitch = scene.camera.pitch;
    var roll = scene.camera.roll;
    var position = scene.camera.position;
    var ellipsoid = scene.globe.ellipsoid;
    var cartographic = ellipsoid.cartesianToCartographic(position);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lon = Cesium.Math.toDegrees(cartographic.longitude);
    var height = cartographic.height;
    console.log(heading);
    console.log(pitch);
    console.log(roll);
    console.log(lat);
    console.log(lon);
    console.log(height);
}

$(function () {
    // 视角切换
    $(".place select").on("change", function () {
        if ($(this).val() == "a") {
            scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromDegrees(114.43693230432554, 30.437780235891793, 100),
                orientation: {
                    heading: 1.0285182970234157,
                    pitch: -0.26251550198059914,
                    roll: 6.283185307179579
                }
            })
        } else if ($(this).val() == "b") {
            scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromDegrees(114.44206211550622, 30.443255137917298, 66.95554732116818),
                orientation: {
                    heading: 4.542065333060519,
                    pitch: -0.24412114065229407,
                    roll: 6.283185307169116
                }
            })
        } else if ($(this).val() == "c") {
            scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromDegrees(114.43632591104227, 30.446413271269066, 109.85024687727478),
                orientation: {
                    heading: 2.5192943364066784,
                    pitch: -0.5898894375006405,
                    roll: 6.283185296281172
                }
            })
        } else if ($(this).val() == "police") {
            scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromDegrees(114.44560496257438, 30.4387367746608, 39.2284821149149),
                orientation: {
                    heading: 6.174300863793121,
                    pitch: -0.4364571323510429,
                    roll: 1.3379253260836776e-10
                }
            })
        } else if ($(this).val() == "office") {
            scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromDegrees(114.44649408606982, 30.459651848062446, 29.532953018716945),
                orientation: {
                    heading: 0.018714729409784248,
                    pitch: -0.25437704611598333,
                    roll: 6.283185307179586
                }
            })
        } else if($(this).val() == "phoenix"){
            scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromDegrees(114.46408683210903, 30.443490675868624, 65.18892197724546),
                orientation: {
                    heading:   3.2983286818170274,
                    pitch: -0.30147008994945956,
                    roll: 6.283185307179581
                }
            })
        }
    });
    // 重点人员动态
    $.get(baseUrl + "m/alarm/info/labels/latest?startTime=" + getTimeString(5), function (response) {
        var text = "";
        response.forEach(function (info) {
            if (info.status === "未处理"){
                text += "<div class='dot'>&bull;</div>" +
                    "<div class='text'>" +
                    info.alarmDesc + "&nbsp;&nbsp;&nbsp;" +
                    info.content.substring(info.content.indexOf(info.alarmDesc) + info.alarmDesc.length, info.content.indexOf("出现在")) + "&nbsp;&nbsp;&nbsp;" +
                    info.alarmLocation.split("/")[0] + "&nbsp;&nbsp;&nbsp;" +
                    info.alarmTime + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>";
            }
        });
        $(".trend marquee").html(text);
    });

    // 图层控制按钮组
    $(".layersDiv input").on("change",function () {
        var id = $(this).attr("id");
        if ($(this).prop("checked") === true){
            layerSearch(id);
        }else{
            closeLayer(id);
        }
    });

    // 模糊查询
    $("#searchValue").autocomplete({
        source: function (request,response) {
            $.get(baseUrl + "m/frontpage/key?key=" + encodeURI(request.term), function (data) {
                var result = [];
                if (isEmptyObject(data)){
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
        select:function (event,ui) {
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

    $("#searchBtn").on("click",function () {
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
                $("#searchValue").attr({"type": "b", "no": building.buildingId, "item": building.fullBuildingName});
                searchKey();
            }else {
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

var sqlType = ""; //查询类型

function keySearch(id, type, item) {
    $("#hidValue").val(id); // 存储ID值
    if (type === "b") { // 楼栋 佛祖岭街道/佛祖岭B区/36栋
        var SQL = "DISTRICT = '" + item.split("/")[0] +
            "' and COMMUNITY = '" + item.split("/")[1] +
            "' and BUILDNO = '" + item.split("/")[2].substr(0, item.split("/")[2].length - 1) + "'";
        sqlType = "B";
        doSqlQuery(SQL);
    }else if(type === "p"){// 人 佛祖岭街道/佛祖岭社区/3栋/1单元/202

        var SQL = "DISTRICT = '" + item.split("/")[0] +
            "' and COMMUNITY = '" + item.split("/")[1] +
            "' and BUILDNO = '" + item.split("/")[2].substr(0, item.split("/")[2].length - 1) +
            "' and UNIT = '" + item.split("/")[3].substr(0, item.split("/")[3].length - 2) +
            "' and ROOM = '" + item.split("/")[4] + "'";
        sqlType = "P";
        doSqlQuery(SQL);
    }
}

/**
 * 显示模型
 * @param queryEventArgs
 */
function showMX(queryEventArgs) {
    var selectedFeatures = queryEventArgs.originResult.features;
    var IDs = [];
    for (var i = 0; i < selectedFeatures.length; i++) {
        var value = selectedFeatures[i].fieldValues["0"];
        IDs.push(parseInt(value));
    }
    // 获取所有的smid,高亮显示
    var buildingLayer = scene.layers.find("mx");
    if (IDs.length > 0) {
        buildingLayer.setSelection(IDs);
    }
}

/**
 * 当查询成功返回
 * @param queryEventArgs
 */
function onQueryComplete(queryEventArgs) {

    showMX(queryEventArgs);

    if (sqlType == "P"){
        // 获取人信息，创建HTML，显示气泡
        var id = $("#hidValue").val();
        // 先显示提示框
        selectedEntity.name = "人员基本信息";
        selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
        viewer.selectedEntity = selectedEntity;

        $.get(baseUrl + "m/frontpage/getBi?uid=" + id + "&layerType=RESIDENT").then(function (person) {
            var house = person.houses[0].houseInfo;
            var address = house.buildingInfo.fullBuildingName + "/" + house.unitNumber + "单元" + "/" +
                house.floorNumber + leftPad(house.houseNumber, 2);
            selectedEntity.description = "<table class=\"cesium-infoBox-defaultTable\"><tbody>" +
                "<tr><td>人员姓名</td><td>" + person.name + "</td></tr>" +
                "<tr><td>性别</td><td>" + getSex(person.sex) + "</td></tr>" +
                "<tr><td>身份证号</td><td>" + checkNull(person.idNo) + "</td></tr>" +
                "<tr><td>联系方式</td><td>" + checkNull(person.contact) + "</td></tr>" +
                "<tr><td>职业</td><td>" + checkNull(person.profession) + "</td></tr>" +
                "<tr><td>住址</td><td> " + address + "</td></tr>"
            //"<tr><td colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" + person.residentBaseId + "\', \'_blank\'))\">详情</a></td></tr>" +
            "</tbody></table>";
        });
    }else if (sqlType == "B"){
        // 获取楼栋信息，创建HTML，显示气泡
        var id = $("#hidValue").val();
        // 先显示提示框
        selectedEntity.name = "楼栋信息";
        selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
        viewer.selectedEntity = selectedEntity;

        $.get(baseUrl + "m/frontpage/getBi?uid=" + id + "&layerType=BUILDING").then(function (building) {
            // 获取数据后显示
            selectedEntity.description = "<table class=\"cesium-infoBox-defaultTable\"><tbody>" +
                "<tr><td>楼栋名称</td><td>" + building.buildingName + "</td></tr>" +
                "<tr><td>楼栋用途</td><td>" + getBuildingType(building.buildingPurpose) + "</td></tr>" +
                "<tr><td>商铺数量</td><td>" + building.shops + "</td></tr>" +
                "<tr><td>自住数量</td><td>" + building.owners + "</td></tr>" +
                "<tr><td>租户数量</td><td>" + building.tenants + "</td></tr>" +
                "<tr><td>企业房屋</td><td>" + building.firms + "</td></tr>" +
                "<tr><td>租住比例</td><td>" + building.usage + "%</td></tr>" +
                //"<tr><td colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/roomInfoxq.html?buildingId=" + building.buildingId + "\', \'_blank\'))\">详情</a></td></tr>" +
                "</tbody></table>";
        });
    }else if (sqlType == "I"){
        pinType = "important";
    }else if (sqlType == "H"){
        pinType = "help";
    }

}

/**
 * 执行查询
 * @param SQL
 * @param type
 */
function doSqlQuery(SQL, type) {
    // 查询SQL参数
    var getFeatureParam = new SuperMap.REST.FilterParameter({
        attributeFilter: SQL
    });
    // 设置查询REST参数
    var getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: ["dom:QXMX"]
    });
    // 设置查询服务
    var getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(
        gis_3d_url + "iserver/services/data-FOZHULING/rest/data", {
        eventListeners: {
            "processCompleted": onQueryComplete,
            "processFailed": processFailed
        }
    });
    // 异步查询
    getFeatureBySQLService.processAsync(getFeatureBySQLParams);
}

function processFailed(queryEventArgs) {
    alert('查询失败！');
}

/**
 * 图层查询
 * @param type
 */
function layerSearch(type) {
    if(type === "important"){ // 重点人员
        $.get(baseUrl + "m/frontpage/layer?layers=HAZARDOUS3D").then(function (response) {
            var houses = response.HAZARDOUS3D;
            var houseNames = "";
            if (houses.length != 0){
                houses.forEach(function (houseName) {
                    // 佛祖岭街道/佛祖岭B区/36栋/2-902 ===========返回的数据不标准，得转换============= 佛祖岭街道/佛祖岭B区/36栋/1单元/5层/501
                    var room = houseName.split('-')[1];
                    var roomU = (room.length == 3) ? room.substring(0,1) + "层/" + room : room.substring(0,2) + "层/" + room;
                    houseNames += "'" + houseName.split('-')[0] + "单元/" + roomU + "',";
                });
                houseNames = houseNames.substring(0,houseNames.length - 1);
            }
            // 构造SQL
            var SQL = "NAME IN (" + houseNames + ")";
            sqlType = "I";
            doSqlQuery(SQL);
        });
    }else if(type === "help"){
        $.get(baseUrl + "m/frontpage/layer?layers=OLDANDWEAK3D").then(function (response) {
            var houses = response.OLDANDWEAK3D;
            var houseNames = "";
            if (houses.length != 0){
                houses.forEach(function (houseName) {
                    // 佛祖岭街道/佛祖岭B区/36栋/2-902 ===========返回的数据不标准，得转换=============
                    var room = houseName.split('-')[1];
                    var roomU = (room.length == 3) ? room.substring(0,1) + "层/" + room : room.substring(0,2) + "层/" + room;
                    houseNames += "'" + houseName.split('-')[0] + "单元/" + roomU + "',";
                });
                houseNames = houseNames.substring(0,houseNames.length - 1);
            }
            // 构造SQL
            var SQL = "NAME IN (" + houseNames + ")";
            sqlType = "H";
            doSqlQuery(SQL);
        });
    }else if(type === "grid"){ // 网格
        $.get(baseUrl + "m/frontpage/layer?layers=GRIDER").then(function (response) {
            var grids = response.GRIDER;
            for(var i = 0 ; i < grids.length; i++) {
                var rings = [];
                grids[i].region.split(";").forEach(function (lnglat) {
                    rings.push(parseFloat(lnglat.split(',')[0]));
                    rings.push(parseFloat(lnglat.split(',')[1]));
                    rings.push(18);
                });
                sceneEntitys = [];
                // 绘制立体墙
                var wallEntity = viewer.entities.add({
                    name : '网格信息',
                    description : "<table class=\"cesium-infoBox-defaultTable\"><tbody>" +
                            "<tr><td>网格名称</td><td>" + grids[i].gridName + "</td></tr>" +
                            "<tr><td>所属区域</td><td>" + "佛祖岭B区" + "</td></tr>" +
                            "<tr><td>所属街道</td><td>" + "佛祖岭街道" + "</td></tr>" +
                            "<tr><td>负责人</td><td>" + (grids[i].griders.length == 0 ? "" : grids[i].griders[0].realName) + "</td></tr>" +
                            "<tr><td>电话</td><td>" + (grids[i].griders.length == 0 ? "" : grids[i].griders[0].mobilephone) + "</td></tr>" +
                            "</tbody></table>",
                    polygon : {
                        hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(rings),
                        extrudedHeight: 0,
                        perPositionHeight : true,
                        material : Cesium.Color.GREEN.withAlpha(0.5),
                        outline : true,
                        outlineWidth: 2,
                        outlineColor : Cesium.Color.YELLOW
                    }
                });
                sceneEntitys.push(wallEntity);
            }
            scene.camera.flyTo({
                destination: new Cesium.Cartesian3.fromDegrees(114.43983966618063, 30.43922193644994, 528.3606527016767),
                orientation: {
                    heading: 6.186741308717543,
                    pitch: -0.8872335139792216,
                    roll: 6.283185307035197
                }
            })

        });
    }
}

var sceneEntitys = []; // 场景中自定义Entity

/**
 * 关闭图层
 * @param layerName
 */
function closeLayer(layerName) {
    if(layerName === "grid"){
        viewer.entities.removeAll();
    }else if(layerName === "important" || layerName === "help"){
        scene.layers.find("mx").releaseSelection(); // 释放选择集
        viewer.selectedEntity = null;
        pinType = "house";
    }else if (layerName === "lots"){
    }
};