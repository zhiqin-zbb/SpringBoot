/**
 * Created by zhangbinbin on 2017/8/31.
 */
var Country;

Country = (function () {
    function Country() {
        var self = this;
        $(function () {
            self.bindEvent();
        });
    }

    Country.prototype.bindEvent = function () {
        var self;
        self = this;

        $("#list").click(function (e) {
            e.preventDefault();
            $(".pageDetail").toggleClass("show");
        });

        $("#test").click(function (e) {
            var userInfo = {};
            userInfo.username = "aaa";
            userInfo.password = "bbb";
            System.ajaxSubmit(System.getRequestParams(userInfo), "GET", Util.urlMap.getAllUsers, function (json) {
                alert("ddd");
            });

            // Ajax.request({
            //     url: Util.urlMap.getAllUsers,
            //     type: "GET",
            //     listener: {
            //         success: function (json) {
            //             alert("add");
            //         }
            //     }
            // });
        });
    };

    return Country;
})();

new Country();