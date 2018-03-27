
/*
* ====================================已废弃的代码=================================*
************************地图操作******************************
* 原 ArcGIS API for javascript 4.4 功能代码*******************
* 通过Sketchup软件建模, 单体化输出, ArcGIS PRO2.0导入模型与gdb中(导入gdb中是为了保证材质不丢失),最后发布场景服务,通过场景ID调用服务************
 */
function MapOperation() {

    var scene   = null; //场景或者地图
    var view    = null; //视图

    var housesLayer = null; // 36栋房屋图层
    var lotsLayer   = null; // 物联网设备图层

    var highlight           = null; // 存储高亮模型
    var housesLayerView     = null; // 房屋高亮容器
    var lotsLayerView       = null; // 物联网设备高亮容器

    var gridGraphicLayer    = null; // 网格边界渲染图层

    // 这几类的气泡展示对象需要动态配置
    var defaultHouseTemplate            = null; // 房屋图层默认的气泡展示对象
    var importantPersonHouseTemplate    = null; // 房屋图层展示重点人员时的气泡展示对象
    var helpPersonHouseTemplate         = null; // 房屋图层展示帮扶人员时的气泡展示对象

    var defaultRender = null; // 初始化的图层控件渲染方式

    // 房屋默认气泡配置
    defaultHouseTemplate = {
        title: "房屋信息",
        content: function(target) {
            // 以下是异步获取数据返回html的示例
            var houseName = target.graphic.attributes.name;// 佛祖岭街道/佛祖岭B区/36栋/2单元/803 --- 佛祖岭街道/佛祖岭B区/36栋/1单元/3/1
            var room = houseName.substring(houseName.lastIndexOf('/') + 1, houseName.length);
            // 将101拆分成1/1 1001拆分成10/1
            room = (room.length == 3) ? room.substring(0,1) + "/" + room.substring(2,3) : room.substring(0,2) + "/" + room.substring(3,4);
            houseName = houseName.substring(0,houseName.lastIndexOf('/') + 1) + room;
            $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(houseName) + "&layerType=HOUSE",function (response) {
                if (response != null && response != "" && response != undefined && response != "undefined"){
                    $(".defaultTable").html(
                        "<tr style='display: none'><th>房屋ID</th><td>" + response.uid + "</td></tr>" +
                        "<tr><th>房屋名称</th><td>" + target.graphic.attributes.name + "</td></tr>" +
                        "<tr><th>房屋用途</th><td>" + getHouseType(response.useType) + "</td></tr>" +
                        "<tr><th>房主姓名</th><td>" + (response.residents == null || response.residents.length == 0 ? '' : response.residents[0].name) + "</td></tr>" +
                        "<tr><th>联系方式</th><td>" + (response.residents == null || response.residents.length == 0 ? '' : response.residents[0].contact) + "</td></tr>" +
                        "<tr><th>房号</th><td>" + response.floorNumber + '0' + response.houseNumber + "</td></tr>" +
                        "<tr><th colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/roomInfo.html?houseId=" + response.uid + "\', \'_blank\'))\">详情</a></th></tr>"
                    );
                }
            });
            return "<table class='defaultTable table'></table>";
        }
    };

    // 重点人员气泡配置
    importantPersonHouseTemplate = {
        title:"重点人员信息",
        content:function (target) {
            var houseName = target.graphic.attributes.name;// 佛祖岭街道/佛祖岭B区/36栋/2单元/803 --- 佛祖岭街道/佛祖岭B区/36栋/1单元/3/1
            var room = houseName.substring(houseName.lastIndexOf('/') + 1, houseName.length);
            // 将101拆分成1/1 1001拆分成10/1
            var roomU = (room.length == 3) ? room.substring(0,1) + "/" + room.substring(2,3) : room.substring(0,2) + "/" + room.substring(3,4);
            houseName = houseName.substring(0,houseName.lastIndexOf('/') + 1) + roomU;
            $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(houseName) + "&layerType=HOUSE&subLayers=teenager,drug,emancipist,pertition,rectify,aids,alloeosis",function (response) {
                var persons = response.residents;
                if(persons != null && persons.length != 0){
                    persons.forEach(function (person) {
                        $(".defaultTable tbody").append(
                            "<tr><td>" + person.residentBaseId + "</td>" +
                            "<td>" + person.name + "</td>" +
                            "<td>" + getSex(person.sex) + "</td>" +
                            "<td>" + getOccupation(person.occupation) + "</td>" +
                            "<td>" + room + "</td>" +
                            "<td><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" + person.residentBaseId + "\', \'_blank\'))\">详情</a></td>"
                        );
                    })
                }
            });
            return "<table class='defaultTable table'>" +
                "<thead><tr><th>人员ID</th><th>人员姓名</th><th>性别</th><th>人员类别</th><th>房号</th><th>详情</th></tr></thead>" +
                "<tbody></tbody></table>";
        }
    };

    // 帮扶人员气泡配置
    helpPersonHouseTemplate = {
        title:"帮扶人员信息",
        content:function (target) {
            var houseName = target.graphic.attributes.name;// 佛祖岭街道/佛祖岭B区/36栋/2单元/803 --- 佛祖岭街道/佛祖岭B区/36栋/1单元/3/1
            var room = houseName.substring(houseName.lastIndexOf('/') + 1, houseName.length);
            // 将101拆分成1/1 1001拆分成10/1
            var roomU = (room.length == 3) ? room.substring(0,1) + "/" + room.substring(2,3) : room.substring(0,2) + "/" + room.substring(3,4);
            houseName = houseName.substring(0,houseName.lastIndexOf('/') + 1) + roomU;
            $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(houseName) + "&layerType=HOUSE&subLayers=suballow,livealone,disabled",function (response) {
                var persons = response.residents;
                if(persons != null && persons.length != 0){
                    persons.forEach(function (person) {
                        $(".defaultTable tbody").append(
                            "<tr><td>" + person.residentBaseId + "</td>" +
                            "<td>" + person.name + "</td>" +
                            "<td>" + getSex(person.sex) + "</td>" +
                            "<td>" + getOccupation(person.occupation) + "</td>" +
                            "<td>" + room + "</td>" +
                            "<td><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" + person.residentBaseId + "\', \'_blank\'))\">详情</a></td>"
                        );
                    })
                }
            });
            return "<table class='defaultTable table'>" +
                "<thead><tr><th>人员ID</th><th>人员姓名</th><th>性别</th><th>人员类别</th><th>房号</th><th>详情</th></tr></thead>" +
                "<tbody></tbody></table>";
        }
    };

    /**
     *  初始化地图
     *  mapDivElementId：地图容器的ID
     */
    this.initMap = function(mapDivElementId, type) {
        require(["esri/Map", "esri/WebScene", "esri/views/SceneView", "esri/layers/GraphicsLayer",
                "esri/geometry/Polygon", "esri/symbols/SimpleFillSymbol", "esri/Graphic",
                "esri/config", "esri/request", "esri/widgets/LayerList", "esri/widgets/Home", "dojo/domReady"],
            function (Map, WebScene, SceneView, GraphicsLayer,
                      Polygon, SimpleFillSymbol, Graphic,
                      esriConfig, esriRequest, LayerList, Home) {

                // 配置数据源
                esriConfig.portalUrl = "https://server.hxct.com/arcgis";
                esriConfig.request.corsEnabledServers.push(baseUrl);

                // 加载场景数据
                scene = new WebScene({
                    portalItem: {
                        id: "b81a8cf9401f4f28b6ae94e8aeded643"
                    }
                });

                // 加载视图渲染
                view = new SceneView({
                    container: mapDivElementId,
                    map: scene,
                    qualityProfile: "low",
                    highlightOptions: {
                        color: [0, 255, 255],
                        fillOpacity: 0.8
                    },
                    environment:{
                        lighting: {
                            cameraTrackingEnabled : true
                        },
                        atmosphereEnabled: true,
                        atmosphere:{
                            quality:"low"
                        },
                        starsEnabled: true
                    }
                });

                // 添加图层控制控件
                var layerList = new LayerList({
                    view: view
                });
                view.ui.add(layerList, "top-right");

                // 添加Home控件
                var homeWidget = new Home({
                    view: view
                });
                view.ui.add(homeWidget, "top-left");

                // 从场景中分离出图层
                scene.then(function () {
                    if (type !== "house"){
                        // 添加其他的图层
                        gridGraphicLayer = new GraphicsLayer({title:"网格图层"});
                        scene.add(gridGraphicLayer);
                    }

                    scene.allLayers.forEach(function (layer, index) {
                        if (type === "house"){
                            if (layer.title !== "房屋" && layer.title !== "卫星底图"){
                                layer.visible = false;
                            }
                        }
                        if (layer.title === "房屋"){
                            housesLayer = layer;
                            housesLayer.popupTemplate = defaultHouseTemplate;
                            defaultRender = housesLayer.renderer;
                        }else if (layer.title === "物联网设备"){
                            lotsLayer = layer;
                        }else {
                            layer.popupEnabled = false; // 禁用弹框
                        }
                    });

                    if (getQueryString("type") === "onemap"){
                        // 添加蒙板
                        var polygon = new Polygon(
                            [[108, 40], [124, 40], [124, 20], [108, 20]]
                        );

                        var fillSymbol = new SimpleFillSymbol({
                            color: [30, 32, 29, 0.95],
                            style: "solid"
                        });

                        var graphic = new Graphic({
                            geometry: polygon,
                            symbol: fillSymbol
                        });
                        view.graphics.add(graphic);
                    }
                });

                // 获取高亮容器
                view.then(function () {
                    view.whenLayerView(housesLayer).then(function (sceneLayerView) {
                        housesLayerView = sceneLayerView;
                    });
                    view.whenLayerView(lotsLayer).then(function (sceneLayerView) {
                        lotsLayerView = sceneLayerView;
                    });
                    view.watch("popup.visible",function (state) {
                        if(state === false){
                            switch (view.popup.title){
                                case "楼栋信息":{
                                    if (highlight) {
                                        highlight.remove();
                                    }
                                };break;
                                case "人员基本信息":{
                                    view.graphics.removeAll();
                                };break;
                                default : break;
                            }
                        }
                    });
                    // view.on("click",function (e) {
                    //     console.log(e.mapPoint.latitude + " ==== " + e.mapPoint.longitude);
                    // });

                });
            });
    };

    /**
     * 关键字模糊匹配查询
     * @param id 人或楼栋编号
     * @param type 标识人或楼栋
     * @param item 房屋名或者楼栋名
     */
    this.keySearch = function(id, type, item) {
        // 房屋点击默认气泡
        housesLayer.popupTemplate = defaultHouseTemplate; // 配置气泡

        require(["esri/tasks/support/Query", "esri/symbols/PointSymbol3D", "esri/symbols/IconSymbol3DLayer",
            "esri/symbols/LabelSymbol3D", "esri/symbols/TextSymbol3DLayer",
            "esri/symbols/callouts/LineCallout3D", "esri/geometry/Point", "esri/Graphic", "esri/request",
            "esri/tasks/QueryTask", "esri/tasks/support/Query"
        ],function(Query, PointSymbol3D, IconSymbol3DLayer, LabelSymbol3D, TextSymbol3DLayer, LineCallout3D,
                   Point, Graphic, esriRequest, QueryTask, Query) {
            if (type === "b") { // 楼栋 佛祖岭街道/佛祖岭B区/36栋
                var query = new Query();
                query.where = "district = '" + item.split('/')[0] +
                    "' and community = '" + item.split('/')[1] +
                    "' and building = '" + item.split('/')[2].match(/(\d)+/g)[0] + "'";
                query.multipatchOption = "xyFootprint";
                query.outFields = ["*"];
                query.returnGeometry = true;
                housesLayer.queryFeatures(query).then(function (featureSet) {
                    if (featureSet === null || featureSet.features.length == 0){
                        alert("尚不支持该楼栋的数据数据支持");
                        return false;
                    }
                    if (highlight) {
                        highlight.remove();
                    }
                    view.goTo(featureSet.features);
                    highlight = housesLayerView.highlight(featureSet.features);
                    // 获取楼栋信息，创建HTML，显示气泡
                    esriRequest(baseUrl + "m/frontpage/getBi?uid=" + id + "&layerType=BUILDING").then(function (response) {
                        var building = response.data;
                        var t = view.viewpoint.targetGeometry;
                        view.popup.clear();
                        view.popup.open({
                            location: t,
                            title: "楼栋信息",
                            content: "<table class='table table-bordered table-striped table-hover'>" +
                            "<tr><td rowspan='9' style='text-align: center;display: none'>" +
                            "<img src='" + checkPicture(building.picUrl) + "' width='100px' height='auto' /></td>" +
                            "<td>楼栋ID</td><td>" + building.buildingId + "</td></tr>" +
                            "<tr><td>楼栋名称</td><td>" + building.buildingName + "</td></tr>" +
                            "<tr><td>楼栋用途</td><td>" + getBuildingType(building.buildingPurpose) + "</td></tr>" +
                            "<tr><td>商铺数量</td><td>" + building.shops + "</td></tr>" +
                            "<tr><td>自住数量</td><td>" + building.owners + "</td></tr>" +
                            "<tr><td>租户数量</td><td>" + building.tenants + "</td></tr>" +
                            "<tr><td>企业房屋</td><td>" + building.firms + "</td></tr>" +
                            "<tr><td>租住比例</td><td>" + building.usage + "%</td></tr>" +
                            "<tr><td colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/roomInfoxq.html?buildingId=" + building.buildingId + "\', \'_blank\'))\">详情</a></td></tr>" +
                            "</table>"
                        });
                    });
                });
            }else if(type === "p"){// 人 佛祖岭街道/佛祖岭社区/3栋/1单元/202
                var statement = "name = '" + item.substring(0, item.indexOf('栋') + 1) + "'";
                //根据楼栋图层具有FeatureService服务查询楼栋坐标以及高度信息
                var buildingLayerUrl = "https://server.hxct.com/server/rest/services/SafeCommunity/FeatureServer/7";
                var queryTask = new QueryTask({
                    url: buildingLayerUrl
                });
                var query = new Query();
                query.outFields = ["*"];
                query.where = statement;
                queryTask.execute(query).then(function(featureSet){
                    if (featureSet === null || featureSet.features.length == 0){
                        alert("尚不支持该楼栋的数据数据支持");
                        return false;
                    }
                    var feature = featureSet.features[0];
                    var longitude = feature.attributes.lon;
                    var latitude = feature.attributes.lat;
                    // var height = feature.attributes.height;
                    var height = 1.12 + 11 * 3.3 + 6 + 10; // 临时高度 1.12的地面偏移 11层 每层3.3 屋顶6 外加10偏移
                    var buildingInfo = {"longitude" : longitude, "latitude" : latitude, "height" : height};
                    // 用一个icon在楼栋上面显示
                    var pointGraphic = new Point({
                        x:buildingInfo.longitude,
                        y:buildingInfo.latitude
                    });
                    var verticalOffset = {
                        screenLength: buildingInfo.height,
                        maxWorldLength: 100,
                        minWorldLength: buildingInfo.height
                    };
                    var symbol = new PointSymbol3D({
                        symbolLayers: [
                            new IconSymbol3DLayer({
                                resource: {
                                    href: "../img/museum.png"
                                },
                                size: 20,
                                outline: {
                                    color: "white",
                                    size: 2
                                }
                            })
                        ],
                        verticalOffset: verticalOffset,
                        callout: new LineCallout3D({
                            color: "white",
                            size: 2,
                            border: {
                                color: "#D13470"
                            }
                        })
                    });
                    var graphic = new Graphic({
                        geometry:pointGraphic,
                        symbol:symbol,
                        popupTemplate:{
                            title:"人员基本信息",
                            content:function () {
                                return esriRequest(baseUrl + "m/frontpage/getBi?uid=" + id + "&layerType=RESIDENT").then(function (response) {
                                    var person = response.data;
                                    return "<table class='table table-bordered table-striped table-hover'>" +
                                        "<tr><td rowspan='7' style='text-align: center;display: none'>" +
                                        "<img src='" + checkPicture(person.picture) + "' width='100px' height='auto' /></td>" +
                                        "<td>人员ID</td><td>" + person.residentBaseId + "</td></tr>" +
                                        "<tr><td>人员姓名</td><td>" + person.name + "</td></tr>" +
                                        "<tr><td>性别</td><td>" + getSex(person.sex) + "</td></tr>" +
                                        "<tr><td>身份证号</td><td>" + checkNull(person.idNo) + "</td></tr>" +
                                        "<tr><td>联系方式</td><td>" + checkNull(person.contact) + "</td></tr>" +
                                        "<tr><td>职业</td><td>" + checkNull(person.profession) + "</td></tr>" +
                                        "<tr><td colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" + person.residentBaseId + "\', \'_blank\'))\">详情</a></td></tr>" +
                                        "</table>";
                                });
                            }
                        }
                    });
                    view.graphics.add(graphic);
                });
            }
        });
    };

    /**
     * 关闭图层
     * @param layerName
     */
    this.closeLayer = function (layerName) {
        if(layerName === "grid"){
            gridGraphicLayer.removeAll();
        }else if(layerName === "important" || layerName === "help"){
            if(highlight){
                highlight.remove();
            }
            housesLayer.popupTemplate = defaultHouseTemplate;
        }else if (layerName === "lots"){
            if(highlight){
                highlight.remove();
            }
        }
    };

    /**
     * 点击图层功能
     * @param type
     */
    this.layerSearch = function(type) {
        require(["esri/tasks/support/Query", "esri/Graphic","esri/geometry/Point",  "esri/geometry/Polyline",
            "esri/geometry/Polygon", "esri/symbols/SimpleFillSymbol", "esri/symbols/PointSymbol3D",
            "esri/symbols/IconSymbol3DLayer", "esri/symbols/SimpleLineSymbol", "esri/request"
        ],function (Query, Graphic, Point, Polyline, Polygon, SimpleFillSymbol, PointSymbol3D, IconSymbol3DLayer, SimpleLineSymbol, esriRequest) {
            if(type === "lots"){  // 高亮所有的摄像头
                var query = new Query();
                query.where = "1=1";
                query.multipatchOption = "xyFootprint";
                query.outFields = ["*"];
                query.returnGeometry = true;
                lotsLayer.queryFeatures(query).then(function (featureSet) {
                    if (highlight) {
                        highlight.remove();
                    }
                    highlight = lotsLayerView.highlight(featureSet.features);
                });
            }else if(type === "important"){ // 重点人员
                housesLayer.popupTemplate = importantPersonHouseTemplate;
                esriRequest(baseUrl + "m/frontpage/layer?layers=HAZARDOUS3D").then(function (response) {
                    var houses = response.data.HAZARDOUS3D;
                    var houseNames = "";
                    if (houses.length != 0){
                        houses.forEach(function (houseName) {
                            // 佛祖岭街道/佛祖岭B区/36栋/2-902 ===========返回的数据不标准，得转换=============
                            houseNames += "'" + houseName.split('-')[0] + "单元/" + houseName.split('-')[1] + "',";
                        });
                        houseNames = houseNames.substring(0,houseNames.length - 1);
                    }
                    var query = new Query();
                    query.where = "name in (" + houseNames + ")";
                    query.multipatchOption = "xyFootprint";
                    query.outFields = ["*"];
                    query.returnGeometry = true;
                    housesLayer.queryFeatures(query).then(function (featureSet) {
                        if(highlight){
                            highlight.remove();
                        }
                        highlight = housesLayerView.highlight(featureSet.features);
                    });
                });
            }else if(type === "help"){// 帮扶人员
                housesLayer.popupTemplate = helpPersonHouseTemplate;
                esriRequest(baseUrl + "m/frontpage/layer?layers=OLDANDWEAK3D").then(function (response) {
                    var houses = response.data.OLDANDWEAK3D;
                    var houseNames = "";
                    if (houses.length != 0){
                        houses.forEach(function (houseName) {
                            // 佛祖岭街道/佛祖岭B区/36栋/2-902 ===========返回的数据不标准，得转换=============
                            houseNames += "'" + houseName.split('-')[0] + "单元/" + houseName.split('-')[1] + "',";
                        });
                        houseNames = houseNames.substring(0,houseNames.length - 1);
                    }
                    var query = new Query();
                    query.where = "name in (" + houseNames + ")";
                    query.multipatchOption = "xyFootprint";
                    query.outFields = ["*"];
                    query.returnGeometry = true;
                    housesLayer.queryFeatures(query).then(function (featureSet) {
                        if(highlight){
                            highlight.remove();
                        }
                        highlight = housesLayerView.highlight(featureSet.features);
                    });
                });
            }else if(type === "grid"){ // 网格
                esriRequest(baseUrl + "m/frontpage/layer?layers=GRIDER").then(function (response) {
                    var grids = response.data.GRIDER;
                    for(var i = 0 ; i < grids.length; i++) {
                        var rings = [];
                        grids[i].region.split(";").forEach(function (lnglat) {
                            rings.push([parseFloat(lnglat.split(',')[0]),parseFloat(lnglat.split(',')[1]),10]);
                        });
                        var polygon = new Polygon(
                            rings
                        );

                        var fillSymbol = new SimpleFillSymbol({
                            color: [227, 139, 79, 0.8],
                            style: "solid",
                            outline: {
                                color: [0, 255, 0],
                                width: 5
                            }
                        });

                        var lineAtt = {
                            ID: grids[i].gridId,
                            Name: grids[i].gridName,
                            Owner: "佛祖岭B区",
                            Street: "佛祖岭街道",  // The length of the pipeline
                            PersonName: grids[i].griders.length == 0 ? "" : grids[i].griders[0].realName,
                            PersonTel: grids[i].griders.length == 0 ? "" : grids[i].griders[0].mobilephone
                        };

                        var graphic = new Graphic({
                            geometry: polygon,
                            symbol: fillSymbol,
                            attributes: lineAtt,
                            popupTemplate: {
                                title: "{Name}",
                                content: [{
                                    type: "fields",
                                    fieldInfos: [{
                                        label: "网格号",
                                        fieldName: "ID"
                                    }, {
                                        label: "网格名称",
                                        fieldName: "Name"
                                    }, {
                                        label: "所属社区",
                                        fieldName: "Owner"
                                    }, {
                                        label: "所属街道",
                                        fieldName: "Street"
                                    }, {
                                        label: "网格员姓名",
                                        fieldName: "PersonName"
                                    }, {
                                        label: "网格员联系方式",
                                        fieldName: "PersonTel"
                                    }]
                                }]
                            }
                        });
                        gridGraphicLayer.add(graphic);
                    }
                });
            }
        });
    };

    /**
     * 根据网格居中地图
     * @param gridId
     */
    this.gridCenter = function (gridId) {
        require(["esri/geometry/Polygon", "esri/request"], function (Polygon, esriRequest) {
            esriRequest(baseUrl + "m/grid/getGridById?id=" + gridId).then(function (response) {
                var rings = [];
                response.data.region.split(";").forEach(function (lngLat) {
                    rings.push([parseFloat(lngLat.split(',')[0]),parseFloat(lngLat.split(',')[1])]);
                });
                var polygon = new Polygon(
                    rings
                );
                view.goTo({
                    center: polygon.centroid,
                    zoom: 21
                })
            });
        });
    };

    /**
     * 异步分色渲染示例（不同类别的房屋显示不同的颜色）
     * @param buildId
     * @param houseType
     */
    this.differColor = function (buildId, houseType) {
        require(["esri/renderers/UniqueValueRenderer", "esri/symbols/MeshSymbol3D",
            "esri/symbols/FillSymbol3DLayer", "esri/request",
        ], function (UniqueValueRenderer, MeshSymbol3D, FillSymbol3DLayer, esriRequest) {
            var url = baseUrl + "m/resident/s/buildinghouse?buildingId=" + buildId + "&houseTypes=" + houseType;
            esriRequest(url).then(function (response) {
                var houses = response.data;
                if (houses == null){
                    housesLayer.renderer = defaultRender;
                }
                var renderer = new UniqueValueRenderer({
                    field: "Name",
                    defaultSymbol: new MeshSymbol3D()
                });
                // 宿舍、商铺、办公、仓库、厂房、其他
                var dict = {
                    "01":"#BF3EFF", // 宿舍
                    "02":"#ffa67a", // 住房
                    "03":"#2963f7", // 商铺
                    "04":"#1fa4b8", // 办公
                    "05":"#92f7a3", // 仓库
                    "06":"#03a2e5", // 厂房
                    "99":"#348923"  // 其他
                };
                $.map(houses,function (key, value) {
                    renderer.addUniqueValueInfo(value,
                        new MeshSymbol3D({
                            symbolLayers: [new FillSymbol3DLayer({
                                material: {color: dict[key]}
                            })]
                        })
                    );
                });
                defaultRender = housesLayer.renderer;
                housesLayer.renderer = renderer;
            });
        });
    };

    /**
     * 重置房屋样式
     */
    this.resetColor = function () {
        housesLayer.renderer = defaultRender;
    }
}
// 提供访问对象
var mapOperation = new MapOperation();