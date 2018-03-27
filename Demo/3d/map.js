$(function () {

    mapOperation.initMap("sceneDiv");

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
                $("#searchValue").attr({"type": "b", "no": building.buildingId, "item": building.buildingName});
                searchKey();
            }else {
                $("#searchValue").autocomplete("search", term);
            }
        });
    });

    // 图层控制按钮组
    $(".layersDiv input").on("change",function () {
        var id = $(this).attr("id");
        if ($(this).prop("checked") === true){
            mapOperation.layerSearch(id);
        }else{
            mapOperation.closeLayer(id);
        }
    });

    // 异步分色
    $("#differColor").on("click",function () {
        mapOperation.differColor();
    });

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
                                    label : person.name + " --- " + house.buildingInfo.fullBuildingName.replace(new RegExp('/', 'g'),'') +
                                    house.unitNumber + "单元" + house.floorNumber + leftPad(house.houseNumber,2),
                                    value : person.name,
                                    house : house.buildingInfo.fullBuildingName + "/" + house.unitNumber + "单元" + "/" + house.floorNumber + leftPad(house.houseNumber,2),
                                    type: "p"
                                });
                            })
                        } else if (key === "BUILDING") {
                            value.forEach(function (building) {
                                result.push({
                                    id:building.buildingId,
                                    building:building.buildingName,
                                    value:building.buildingName.replace(new RegExp('/', 'g'),''),
                                    type:"b"
                                });
                            })
                        }
                    });
                }
                response(result);
            });
        },
        select:function (event,ui) {
            if (ui.item.type === "b"){
                $("#searchValue").attr({"type": ui.item.type, "no" : ui.item.id, "item": ui.item.building});
                searchKey();
            }else if(ui.item.type === "p"){
                if(ui.item.house === ""){
                    alert(ui.item.value + " 还未与房屋关联，请及时补充相关信息");
                    $("#searchValue").attr({"type": "", "no" : "", "item": ""});
                }else{
                    $("#searchValue").attr({"type": ui.item.type, "no" : ui.item.id, "item": ui.item.house});
                    searchKey();
                }
            }else if(ui.item.type === "n"){
                alert("没有查询到此记录");
                $("#searchValue").attr({"type": "", "no" : "", "item": ""});
            }
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
});

function searchKey() {
    var id = $("#searchValue").attr("no"); // 人或楼栋编号
    var type = $("#searchValue").attr("type"); // 标识人或楼栋
    var item = $("#searchValue").attr("item"); // 房屋名或者楼栋名
    if (id == undefined || id == null || id === "undefined" || id === ""){
        return false;
    }else{
        mapOperation.keySearch(id, type, item);
    }
}