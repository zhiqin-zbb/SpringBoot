/**
 * Created by zhangbinbin on 2017/8/31.
 */

//文件来源，开发环境以及生产环境
var fileFrom = window.location.origin + "/springboot";

(function (window) {
    var Loader = {};
    Loader.loader = function (config) {
        var cssjsVersion = 20170831;
        var cssjs = "";
        for (var i = 0; i < config.cssArr.length; i++) {
            cssjs += "<link rel='stylesheet' type='text/css' href='" + fileFrom + config.cssArr[i] + "?v=" + cssjsVersion + "'></link>";
        }

        for (var i = 0; i < config.jsArr.length; i++) {
            cssjs += "<script type='text/javascript' src='" + fileFrom + config.jsArr[i] + "?v=" + cssjsVersion+ "'></script>";
        }
        document.write(cssjs);
    }
    window.Loader = Loader;

})(window);
