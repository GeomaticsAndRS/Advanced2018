/**
 * 进一步封装消息接受发送的分发操作
 */

/**
 * 处理接受的消息
 * @param name
 * @param data
 */
function recvUIMessage(name, data) {

    if (name === "企业") {
        initLayer("enterprise", data);
    } else if (name === "一般") {
        initLayer("general", data);
    } else if (name === "严重") {
        initLayer("major", data);
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


