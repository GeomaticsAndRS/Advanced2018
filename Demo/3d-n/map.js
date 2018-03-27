/**
 * 全局对象
 * @type {null}
 */
var viewer = null;
var scene = null;
var selectedEntity = null;

// 点选气泡模式
var pinType = null;

function onload(Cesium) {

    //初始化viewer部件
    viewer = new Cesium.Viewer('cesiumContainer', {
        infoBox:true,
        selectionIndicator:false,
        imageryProvider: new Cesium.BingMapsImageryProvider({
            url: 'https://dev.virtualearth.net',
            key: 'Ao42l-0u7fJXMmQSGY0_5zW6kfuHPeTtanya4rs8bItYH982UV42_xNccLDq70lY',
            mapStyle: Cesium.BingMapsStyle.AERIAL
        })
    });

    selectedEntity = new Cesium.Entity(); // infoBox需要的Entity
    scene = viewer.scene;
    var widget = viewer.cesiumWidget;
    $('#loadingbar').remove();
    try {

        var abc = scene.addS3MTilesLayerByScp(gis_3d_url + "iserver/services/3D-FOZHULING/rest/realspace/datas/ABC/config", {name: 'abc'});
        var police = scene.addS3MTilesLayerByScp(gis_3d_url + "iserver/services/3D-FOZHULING/rest/realspace/datas/POLICE/config", {name: 'police'});
        var office = scene.addS3MTilesLayerByScp(gis_3d_url + "iserver/services/3D-FOZHULING/rest/realspace/datas/OFFICE/config", {name: 'office'});
        var phoenix = scene.addS3MTilesLayerByScp(gis_3d_url + "iserver/services/3D-FOZHULING/rest/realspace/datas/FHSQ/config", {name: 'phoenix'});
        var mx = scene.addS3MTilesLayerByScp(gis_3d_url + "iserver/services/3D-FOZHULING/rest/realspace/datas/QXMX@dom/config", {name: 'mx'});

        abc.then(function (layer) {
            layer.selectEnabled = false;
            layer.hasLight = false; //关闭光照  关键
            layer.style3D._fillForeColor.alpha = 1;
        });
        police.then(function (layer) {
            layer.selectEnabled = false;
            layer.hasLight = false; //关闭光照  关键
            layer.style3D._fillForeColor.alpha = 1;
        });
        office.then(function (layer) {
            layer.selectEnabled = false;
            layer.hasLight = false; //关闭光照  关键
            layer.style3D._fillForeColor.alpha = 1;
        });
        phoenix.then(function (layer) {
            layer.selectEnabled = false;
            layer.hasLight = false; //关闭光照  关键
            layer.style3D._fillForeColor.alpha = 1;
        });
        mx.then(function (layer) {
            layer.cullEnabled = false; //双面渲染  关键
            layer.hasLight = false; //关闭光照  关键
            layer.style3D._fillForeColor.alpha = 0; //半透
            layer.selectColorType = 1.0;
            layer.selectedColor = Cesium.Color.RED;
            layer.selectedColor.alpha = 0.2;
        });

        Cesium.when(mx, function (layer) {
            if (!scene.pickPositionSupported) {
                alert('不支持深度拾取,属性查询功能无法使用！');
            }
            //设置属性查询参数
            layer.setQueryParameter({
                url: gis_3d_url + 'iserver/services/data-FOZHULING/rest/data', //查询分层信息矢量面数据服务
                dataSourceName: 'dom',
                dataSetName: 'QXMX'
            });
            //设置相机视角
            scene.camera.setView({
                destination: new Cesium.Cartesian3.fromDegrees(114.44206211550622, 30.443255137917298, 66.95554732116818),
                orientation: {
                    heading: 4.542065333060519,
                    pitch: -0.24412114065229407,
                    roll: 6.283185307169116
                }
            });

            // 设置选择模式
            pinType = "house";

        }, function (e) {
            if (widget._showRenderLoopErrors) {
                var title = '渲染时发生错误，已停止渲染。';
                widget.showErrorPanel(title, undefined, e);
            }
        });

        //注册鼠标点击事件
        viewer.pickEvent.addEventListener(function (feature) {
            var name = feature.NAME;// 佛祖岭街道/佛祖岭B区/36栋/2单元/8层/803 ----- 佛祖岭街道/佛祖岭B区/36栋/1单元/3/1
            var street = feature.DISTRICT; // 街道
            var comm = feature.COMMUNITY; // 社区
            var build = feature.BUILDNO; // 楼栋
            var unit = feature.UNIT; // 单元
            var room = feature.ROOM; // 房号

            // 以下是异步获取数据返回html的示例
            // 将101拆分成1/1 1001拆分成10/1
            room = (room.length == 3) ? room.substring(0, 1) + "/" + room.substring(2, 3) : room.substring(0, 2) + "/" + room.substring(3, 4);
            var houseName = street + "/" + comm + "/" + build + "栋/" + unit + "单元/" + room;

            if (pinType === "house"){
                selectedEntity.name = "房屋信息";
                selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
                viewer.selectedEntity = selectedEntity;

                $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(houseName) + "&layerType=HOUSE", function (response) {
                    if (response != null && response != "" && response != undefined && response != "undefined") {
                        selectedEntity.description = "<table class=\"cesium-infoBox-defaultTable\"><tbody>" +
                            "<tr><th>房屋名称</th><td>" + name + "</td></tr>" +
                            "<tr><th>房屋用途</th><td>" + getHouseType(response.useType) + "</td></tr>" +
                            "<tr><th>房主姓名</th><td>" + (response.residents == null || response.residents.length == 0 ? '' : response.residents[0].name) + "</td></tr>" +
                            "<tr><th>联系方式</th><td>" + (response.residents == null || response.residents.length == 0 ? '' : response.residents[0].contact) + "</td></tr>" +
                            "<tr><th>房号</th><td>" + response.floorNumber + '0' + response.houseNumber + "</td></tr>" +
                            //"<tr><th colspan='2'><a href=\"javascript:void(window.open(\'/s/resident/roomInfo.html?houseId=" + response.uid + "\', \'_blank\'))\">详情</a></th></tr>" +
                            "</tbody></table>";
                    }else{
                        selectedEntity.description = "未查询到记录...";
                    }
                });
            }else if (pinType === "important"){
                selectedEntity.name = "重点人员信息";
                selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
                viewer.selectedEntity = selectedEntity;

                $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(houseName) + "&layerType=HOUSE&subLayers=teenager,drug,emancipist,pertition,rectify,aids,alloeosis",function (response) {
                    var persons = response.residents;
                    if(persons != null && persons.length != 0){
                        var html = "";
                        persons.forEach(function (person) {
                            html +=
                                "<tr><td>" + person.residentBaseId + "</td>" +
                                "<td>" + person.name + "</td>" +
                                "<td>" + getSex(person.sex) + "</td>" +
                                "<td>" + getOccupation(person.occupation) + "</td>" +
                                "<td>" + room + "</td>";
                                //"<td><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" +
                                //person.residentBaseId + "\', \'_blank\'))\">详情</a></td>";
                        });
                        selectedEntity.description = "<table class=\"cesium-infoBox-defaultTable centerTable\">" +
                            "<thead><tr><th>人员ID</th><th>人员姓名</th><th>性别</th><th>人员类别</th><th>房号</th></tr></thead><tbody>" + //<th>详情</th>
                            html +
                            "</tbody></table>";
                    }else{
                        selectedEntity.description = "未查询到记录...";
                    }
                });
            }else if (pinType === "help"){
                selectedEntity.name = "帮扶人员信息";
                selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
                viewer.selectedEntity = selectedEntity;

                $.get(baseUrl + "m/frontpage/getGi?name=" + encodeURI(houseName) + "&layerType=HOUSE&subLayers=suballow,livealone,disabled",function (response) {
                    var persons = response.residents;
                    if(persons != null && persons.length != 0){
                        var html = "";
                        persons.forEach(function (person) {
                            html +=
                                "<tr><td>" + person.residentBaseId + "</td>" +
                                "<td>" + person.name + "</td>" +
                                "<td>" + getSex(person.sex) + "</td>" +
                                "<td>" + getOccupation(person.occupation) + "</td>" +
                                "<td>" + room + "</td>";
                                //"<td><a href=\"javascript:void(window.open(\'/s/resident/peopleInfoxq.html?residentBaseId=" +
                                // person.residentBaseId + "\', \'_blank\'))\">详情</a></td>";
                        });
                        selectedEntity.description = "<table class=\"cesium-infoBox-defaultTable\">" +
                            "<thead><tr><th>人员ID</th><th>人员姓名</th><th>性别</th><th>人员类别</th><th>房号</th></tr></thead><tbody>" + //<th>详情</th>
                            html +
                            "</tbody></table>";
                    }else{
                        selectedEntity.description = "未查询到记录...";
                    }
                });
            }
        });

        // 设置相机的最大高度
        // scene.screenSpaceCameraController.minimumZoomDistance = 120; // 默认拍摄高度

    } catch (e) {
        if (widget._showRenderLoopErrors) {
            var title = '渲染时发生错误，已停止渲染。';
            widget.showErrorPanel(title, undefined, e);
        }
    }
}