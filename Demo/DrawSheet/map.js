$(function () {
    //=============实时跟踪鼠标位置，提供用户操作提示信息==============

});


// /**
//  * 获取url中的参数
//  * @param name
//  * @returns {*}
//  * @constructor
//  */
// function getQueryString(name) {
//     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//     var r = window.location.search.substr(1).match(reg);
//     if(r!=null)return  unescape(r[2]); return null;
// }

require([
        "esri/Map",
        "esri/Basemap",
        "esri/views/MapView",
        "esri/views/SceneView",
        "esri/layers/TileLayer",
        "esri/layers/MapImageLayer",
        "esri/Graphic",
        "esri/layers/GraphicsLayer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/geometry/Polygon",
        "esri/geometry/Polyline",
        "esri/tasks/IdentifyTask","esri/tasks/support/IdentifyParameters",
        "esri/widgets/BasemapToggle",
        "dojo/dom", "dojo/on",
        "dojo/domReady!"
    ],
    function (Map, Basemap, MapView, SceneView,
              TileLayer, MapImageLayer, Graphic, GraphicsLayer, SimpleFillSymbol, SimpleLineSymbol, Polygon, Polyline, IdentifyTask, IdentifyParameters, BasemapToggle, dom, on) {


        //======================瓦片图层=======================
        var baseMapLayer = new TileLayer({
            url: gis_2d_url + "arcgis/rest/services/GoogleMap/MapServer"
        });
        //======================卫星图层
        var baseSateliteLayer = new TileLayer({
            url: gis_2d_url + "arcgis/rest/services/GoogleSatelite/MapServer"
        });

        //======================楼栋图层=======================
        var buildLayer = new MapImageLayer({
            url: gis_2d_url + "arcgis/rest/services/SafeCommunity/MapServer"
        });

        //======================绘图图层=======================
        var gLayer = new GraphicsLayer();

        //======================地图==========================
        var customMapBasemap = new Basemap({
            baseLayers: [baseMapLayer],
            title: "地图",
            thumbnailUrl:"../img/map.png"
        });
        var customSateliteBasemap = new Basemap({
            baseLayers: [baseSateliteLayer],
            title: "卫星",
            thumbnailUrl:"../img/satelite.png"
        });
        var map = new Map({
            basemap:customMapBasemap,
            layers: [ buildLayer, gLayer ]
        });

        //======================视图=========================
        var view = new MapView({
            container: "viewDiv",
            map: map,
            center: [114.43944445432024, 30.44326443351204],
            zoom: 18 // 0-7
        });
        var basemapToggle = new BasemapToggle({
            view: view,
            nextBasemap: customSateliteBasemap
        });

        //=================视图加载完毕后==============
        view.then(function () {
            view.ui.add(basemapToggle, "top-right");

            //=================定义线样式================
            var symbol_line = new SimpleLineSymbol({
                color: "red",
                width: "2px",
                style: "solid"
            });
            //=================定义编辑时面样式=============
            var symbol_doing = new SimpleFillSymbol({
                style: "backward-diagonal",
                outline: {
                    color: "red",
                    width: 2
                }
            });
            //=================定义编辑完成时面样式==================
            var symbol_done = new SimpleFillSymbol({
                color: [255, 0, 0, 0.4],
                style: "solid",
                outline: {
                    color: "yellow",
                    width: 2
                }
            });

            var tipsText = [
                "单击以开始绘制",
                "单击以继续绘制",
                "单击以继续绘制，双击完成绘制，右击删除上一个点",
                "如需编辑，单击选择要移动的折点，无需编辑请点击结束绘制",
                "请移动该点至正确的位置后单击确认"
            ];
            var rings = [];                  // 存储折点坐标，不存最后一个点，绘制图形的时候逻辑添加
            var lineGraphic = null;          // 临时线对象
            var polygonGraphic = null;       // 临时面对象

            // ===================================绘制==================================

            //===================定义需要注册的事件对象=====================
            var clickEvent = null;
            var moveEvent = null;
            var doubleClickEvent = null;

            on(dom.byId("btn_draw_start"), "click", function () {
                $(".tip").show();
                $("#btn_draw_start").addClass("disabled");
                //========================注册点击事件======================================
                clickEvent = view.on("click", function (e) {
                    if (e.button == 0) {
                        addPoint(e.mapPoint.longitude, e.mapPoint.latitude); // 添加点
                    } else if (e.button == 2) {
                        dropPoint(e.mapPoint.longitude, e.mapPoint.latitude);// 删除点
                    }
                    //==================动态改变操作提示文字============
                    if (rings.length == 0) {
                        $(".tip").html(tipsText[0]);
                    } else if (rings.length <= 2) {
                        $(".tip").html(tipsText[1]);
                    }else{
                        $(".tip").html(tipsText[2]);
                    }
                });
                //========================注册点击事件O======================================
                //========================注册移动事件======================================
                moveEvent = view.on("pointer-move", function (e) {
                    var p = view.toMap(e.x, e.y);
                    drawTempLine(p.longitude, p.latitude); // 实时跟踪鼠标踪迹，绘制临时线
                });
                //========================注册移动事件O======================================
                //========================注册双击事件======================================
                doubleClickEvent = view.on("double-click", function (e) {
                    $(".tip").hide();
                    e.stopPropagation();// 阻止地图的默认双击事件
                    clickEvent.remove();
                    clickEvent = null;
                    moveEvent.remove();
                    moveEvent = null;
                    doubleClickEvent.remove();
                    doubleClickEvent = null;
                    drawArea();
                    startEdit(); // 直接进入编辑模式
                    $("#btn_draw_end").removeClass("disabled");
                    $("#btn_clear").removeClass("disabled");
                    //======================================================================
                });
                //========================注册双击事件O======================================
            });

            // =====================================清除===============================
            on(dom.byId("btn_clear"), "click", function () {
                gLayer.removeAll();
                rings = [];
                if (editClickEvent != null){
                    editClickEvent.remove();
                }
                if (pointMoveEvent != null){
                    pointMoveEvent.remove();
                }
                $("#btn_draw_start").removeClass("disabled");
                $("#btn_draw_end").addClass("disabled");
                $(".tip").hide();
                $(".tip").html(tipsText[0]);
            });
            // =====================================清除O===============================
            // =====================================编辑==============================

            //===================定义需要注册的事件对象=====================
            var editClickEvent = null;
            var pointMoveEvent = null;

            function startEdit() {
                var clickType = "click_select";
                var nearestIndex = -1;
                $(".tip").html(tipsText[3]);// 重置tip文字
                $(".tip").show();
                //===================================注册点击事件=======================
                editClickEvent = view.on("click", function (e) {
                    //================================点击事件-------->选择行为==========
                    if (clickType == "click_select") {
                        nearestIndex = findNearestPointIndex(e.mapPoint.longitude, e.mapPoint.latitude);
                        //console.log("最近的点Index=" + nearestIndex);
                        $(".tip").html(tipsText[4]);// 重置tip文字
                        drawTempArea();
                        if (nearestIndex == -1) {
                            //console.log("操作错误，不支持该操作");
                            return false;
                        }
                        //===============================注册鼠标移动事件=======================
                        pointMoveEvent = view.on("pointer-move", function (e) {
                            var p = view.toMap(e.x, e.y);
                            rings.splice(nearestIndex, 1, [p.longitude, p.latitude]);
                            drawTempArea();
                        });
                        //===============================注册鼠标移动事件O=======================
                        clickType = "click_sure";
                    }
                    //================================点击事件-------->选择行为O==========
                    //===================================点击事件----------->确认行为=================
                    else if (clickType == "click_sure") {
                        pointMoveEvent.remove();
                        pointMoveEvent = null;
                        var p = view.toMap(e.x, e.y);
                        rings.splice(nearestIndex, 1, [p.longitude, p.latitude]);
                        drawArea();
                        clickType = "click_select";
                        $(".tip").html(tipsText[3]);// 重置tip文字
                    }
                    //===================================点击事件----------->确认行为O=================
                });
                //===================================注册点击事件O=======================
            }
            // =====================================编辑O==============================
            //==========================完成编辑=======================
            on(dom.byId("btn_draw_end"), "click", function () {
                // 判断是否选择到了网格
                var gridId = $("#selectGrid option:selected").val();
                if (gridId == undefined || gridId == null || gridId == "undefined"){
                    alert("请选择网格");
                    return false;
                }
                editClickEvent.remove();
                editClickEvent = null;
                $(".tip").hide();
                $("#btn_draw_start").removeClass("disabled");
                $("#btn_draw_end").addClass("disabled");
                $("#btn_submit").removeClass("disabled");
                getUserDrawInfo();
            });
            //==========================完成编辑O========================

            function getUserDrawInfo() {
                var queryUrl = gis_2d_url + "arcgis/rest/services/SafeCommunity/MapServer";
                var identifyTask = new IdentifyTask({
                    url : queryUrl
                });
                var ringsCopy = rings.slice(0);
                ringsCopy.push(ringsCopy[0]); // 组成一个闭合ring
                var polygon = new Polygon({
                    rings: ringsCopy
                });
                // 判断用户绘制的点是否为顺时针
                var isClockwise = polygon.isClockwise(ringsCopy);
                if(!isClockwise){
                    ringsCopy.reverse(); // 如果是逆时针的则将点集调整为顺时针
                }

                console.log(ringsCopy); // 打印坐标值******************************************************

                // 识别查询
                var parameters = new IdentifyParameters();
                parameters.geometry = polygon; // 识别对象
                parameters.layerIds = [1, 2, 3, 4, 5, 7]; // 识别其中指定的图层
                parameters.layerOption = "all"; // 识别所有的图层
                parameters.mapExtent = view.extent; // 识别范围
                parameters.tolerance = 0; // 识别容差

                identifyTask.execute(parameters).then(function(response){ // results == IdentifyResult[]
                    var buildName = ""; // 楼栋名称
                    var facilityName = ""; // 设备名称
                    $.each(response.results, function (index, identifyResult) {
                        if(identifyResult.layerName === "楼栋"){
                            buildName += identifyResult.feature.attributes.buildno + ",";
                        }else {
                            facilityName += identifyResult.feature.attributes.name + ",";
                        }
                    });
                    if (facilityName != ""){
                        facilityName = facilityName.substr(0, facilityName.length - 1);
                        console.log(facilityName); // 打印设备名*******************************************************
                    }
                    if (buildName != ""){
                        buildName = buildName.substr(0, buildName.length - 1);
                        console.log(buildName); // 打印栋*******************************************************
                    }

                    // =============提交服务器===================
                    var gridId = $("#selectGrid option:selected").val();
                    var region = ringsCopy.join(";");
                    var baseUrl = window.location.protocol + "//" + window.location.host + "/";
                    $.get(baseUrl + "m/grid/addPointOfGrid?gridId=" + gridId + "&region=" + region + "&buildings=" + encodeURI(buildName) + "&deviceNames=" + encodeURI(facilityName),function (state) {
                        if (state == true){
                            alert("添加成功");
                        }else{
                            alert(state);
                        }
                    });
                },function(error){
                    console.error(error);
                });
            }

            // 找到用户选择编辑的最近的一个点
            function findNearestPointIndex(lng, lat) {
                if (rings.length <= 0) {
                    return -1;
                } else {
                    var index = 0;
                    var distance = Number.MAX_VALUE;
                    for (var i = 0; i < rings.length; i++) {
                        var ringP = rings[i];
                        var tempDis = Math.sqrt(Math.pow((ringP[0] - lng), 2) + Math.pow((ringP[1] - lat), 2));
                        if (tempDis < distance) {
                            distance = tempDis;
                            index = i;
                        }
                    }
                    return index;
                }
            }

            function addPoint(lng, lat) {
                rings.push([lng, lat]); // 依次添加用户点击的坐标点
                drawTempArea();
            }

            function dropPoint() {
                rings.pop(); // 删除最后一个点
                drawTempArea();
            }

            // 绘制临时线
            function drawTempLine(lng, lat) {
                if (rings.length > 0) {
                    gLayer.remove(lineGraphic); // 清除临时线对象
                    var paths = [
                        rings[rings.length - 1],
                        [lng, lat]
                    ];
                    var polyLine = new Polyline({
                        paths: paths
                    });
                    lineGraphic = new Graphic({
                        geometry: polyLine,
                        symbol: symbol_line
                    });
                    gLayer.add(lineGraphic);
                }
            }

            // 绘制临时面
            function drawTempArea() {
                //console.log(rings);
                if (rings.length > 1) {
                    gLayer.remove(polygonGraphic); // 清除临时面对象
                    var ringsCopy = rings.slice(0);
                    ringsCopy.push(ringsCopy[0]); // 组成一个闭合ring
                    var polygon = new Polygon({
                        rings: ringsCopy
                    });
                    polygonGraphic = new Graphic({
                        geometry: polygon,
                        symbol: symbol_doing
                    });
                    gLayer.add(polygonGraphic);
                }
            }

            // 绘制确定面
            function drawArea() {
                gLayer.remove(lineGraphic);
                gLayer.remove(polygonGraphic); // 清除临时面对象
                var ringsCopy = rings.slice(0);
                ringsCopy.push(ringsCopy[0]); // 组成一个闭合ring
                var polygon = new Polygon({
                    rings: ringsCopy
                });
                polygonGraphic = new Graphic({
                    geometry: polygon,
                    symbol: symbol_done
                });
                gLayer.add(polygonGraphic);
            }
        });
    });