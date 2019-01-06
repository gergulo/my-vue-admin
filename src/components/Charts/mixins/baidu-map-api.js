export default {

    init: function (){
      const AK = "4aaufCObC3ACdZTBCIzNui2r3OLXz0qm";
      const apiVersion = "2.0";
      const url = "http://api.map.baidu.com/api?v="+ apiVersion +"&ak="+ AK +"&callback=onBMapCallback";
      return new Promise((resolve, reject) => {
        // 如果已加载直接返回
        if(typeof BMap !== "undefined") {
          resolve(BMap);
          return true;
        }
        // 百度地图异步加载回调处理
        window.onBMapCallback = function () {
          console.log("百度地图API初始化成功...");
          resolve(BMap);
          return true;
        };

        // 插入script脚本
        let scriptNode = document.createElement("script");
        scriptNode.setAttribute("type", "text/javascript");
        scriptNode.setAttribute("src", url);
        document.body.appendChild(scriptNode);
      });
    }
  }