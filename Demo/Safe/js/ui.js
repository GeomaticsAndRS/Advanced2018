/**
 * 这个类主要用于跟CS客户端进行交互
 */

/**
 * 接受客户端的消息
 * @param name 标识符
 * @param data 数据
 * @constructor
 */
function RecvUIMessage(name,data){
    recvUIMessage(name,data);
}

/**
 * 向客户端发送消息
 * @param name 标识符
 * @param data 数据
 * @constructor
 */
function SendUIMessage(name,data) {
    window.external.SendUIMessage(name,data);
}