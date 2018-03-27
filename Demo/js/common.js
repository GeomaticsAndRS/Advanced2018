//================公司环境================
// 基础业务地址
// var baseUrl = "http://172.29.1.20:8080/"; // 服务器地址
// 二维服务地址
var gis_2d_url = "http://10.129.56.56:6080/";
// 三维服务地址
var gis_3d_url = "http://10.129.56.56:8090/";

//================街道办环境===============
// // 基础业务地址
var baseUrl = window.location.protocol + "//" + window.location.host + "/";
// // 二维服务地址
// var gis_2d_url = "http://10.0.151.253:6080/";
// // 三维服务地址
// var gis_3d_url = "http://10.0.151.253:8090/";

/**
 * 获取url参数
 * @param name
 * @returns {*}
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 左对齐
function leftPad(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

/**
 * 翻译性别字典
 * @param code
 * @returns {string}
 */
function getSex(code) {
    switch (code){
        case "0" : return "未知的性别";
        case "1" : return "男性";
        case "2" : return "女性";
        case "9" : return "未说明的性别";
        default  : return "";
    }
}

/**
 * 翻译人员类别
 * @param code
 * @returns {string}
 */
function getOccupation(code){
    switch (code){
        case "teenager"     : return "重点青少年";
        case "drug"         : return "吸毒人员";
        case "emancipist"   : return "刑满释放人员";
        case "pertition"    : return "非法上访人员";
        case "rectify"      : return "社区矫正人员";
        case "aids"         : return "艾滋病危险人员";
        case "alloeosis"    : return "严重精神障碍患者";
        case "suballow"     : return "低保人员";
        case "livealone"    : return "独居老人";
        case "disabled"     : return "残障人士";
        default             : return "";
    }
}

/**
 * 配置楼栋基础信息中的图片
 * @param url
 * @returns {*}
 */
function checkPicture(url) {
    if (url === null || url === ""){
        return "../img/default.png";
    }else return url;
}

/**
 * 翻译楼栋用途字典
 * @param code
 * @returns {string}
 */
function getBuildingType(code) {
    switch (code){
        case "01" : return "住宅";
        case "02" : return "商业";
        case "03" : return "办公";
        case "04" : return "工业";
        case "05" : return "仓储";
        case "06" : return "商住混用";
        default   : return "";
    }
}

/**
 * 翻译房屋用途字典
 * @param code
 * @returns {string}
 */
function getHouseType(code) {
    switch (code){
        case "01" : return "宿舍";
        case "02" : return "住房";
        case "03" : return "商铺";
        case "04" : return "办公";
        case "05" : return "仓库";
        case "06" : return "厂房";
        case "99" : return "其他";
        default   : return "";
    }
}

/**
 * 检测空对象
 * @param obj
 * @returns {boolean}
 */
function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

/**
 * 判断是否为null
 * @param value
 * @returns {string}
 */
function checkNull(value) {
    if (value == null || value === "null" || value == undefined || value === "undefined"){
        return "";
    }else return value;
}

/**
 * 获取距离今天days天的日期
 * @param days
 */
function getTimeString(days) {
    var date = new Date();
    date.setDate(date.getDate() - days);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours()
        + ":" + date.getMinutes() + ":" + date.getSeconds();
}

/**
 * 计算二阶贝塞尔曲线的控制点
 * @param p1 基础点p1
 * @param p2 基础点p2
 * @param k 弹性系数(0-1)
 */
function getSecondLevelCurve(p1, p2, k) {
    var dis = 111000 * Math.cos( 30.60 * Math.PI  / 180); // 佛祖岭1°的实际距离
    var cpx = (p1[0] + p2[0]) / 2; // 中点x
    var cpy = (p1[1] + p2[1]) / 2; // 中点y
    var s = Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2)) * dis; // p1和p2之间的距离
    var l = s * 0.5 * k; // 控制点与中点的距离
    var arc = Math.atan((p1[1] - p2[1]) / (p1[0] - p2[0])); // p1 和 p2之间的角度(弧度)
    //arc = 180 * arc / Math.PI; //转换为角度值
    var l2 = Math.abs(l * Math.sin(arc)); // 控制点到中点的水平距离
    l2 = l2 / dis; // 弧度转度
    var x = arc > 0 ? cpx - l2 : cpx + l2; // 控制点x
    var l3 = Math.abs(l * Math.cos(arc)); // 控制点到中点的垂直距离
    l3 = l3 / dis; // 弧度转度
    var y = cpy + l3; // 控制点y
    return [x, y];
}