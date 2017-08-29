(function () {
    /**
     * convert GET parameter to JSON
     */
    var _toJson = function (str) {
        str = str.replace(/&/g, '","').replace(/=/g, '":"');
        str = '{"' + str + '"}';
        return str;
    };

    var __System = {
        redirect: function (str) {
            window.location.href =  window.location.origin + window.location.pathname + "?" + BASE64.encoder(_toJson(str));
        }
    };

    window.System = __System;
})();