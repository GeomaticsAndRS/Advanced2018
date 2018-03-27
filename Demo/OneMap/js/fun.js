/**
 * 进一步封装消息接受发送的分发操作
 */

/**
 * 处理接受的消息
 * @param name
 * @param data
 */
function recvUIMessage(name, data) {

    if (name === "重点人员"){
        initLayer("important", data);
    }else if (name === "显示行踪"){
        initLayer("important_route", data);
    }else if(name === "取消行踪显示"){
        updateLayer("important_route");
    }else if(name === "重点人员定位"){
        centerImportant(data);
    }

    else if (name === "告警事件"){
        initLayer("alarm", data);
    }else if(name === "添加告警"){
        updateLayer("alarm", data);
    }else if (name === "告警定位"){
        centerAlarm(data);
    }

    else if (name === "综治力量"){
        initLayer("power", data);
    }else if (name === "人员定位"){
        centerPower(data);
    }else if (name === "刷新综治力量"){
        refreshPower(data);
    }

    else if(name === "黑名单行踪轨迹"){
        initLayer("blacklist", data);
    }

    else if (name === "调度人员结果"){
        fillSearchContent(data);
    }
}

/**
 * 发送消息
 * @param name
 * @param data
 */
function sendUIMessage(name, data) {
    SendUIMessage(name, data);
}


