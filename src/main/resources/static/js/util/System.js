var System = {};

var context = "/springboot";

/**
 * Cookie设置
 * public method :
 *        util.cookie.get(key)
 *        util.cookie.set(key, value, days, path, domain, secure)
 */
window.Cookie = System.cookie = new function () {
    this.set = function (b, e, i, g, c, f) {
        if (!c) {
            c = util.config.domain;
        }
        if (!g) {
            g = "/";
        }
        var a = -1;
        if (util.type.isNumber(i) && i >= 0) {
            var h = new Date();
            h.setTime(h.getTime() + (i * 86400000));
            a = h.toGMTString();
        } else {
            if (util.type.isDate(i)) {
                a = i.toGMTString();
            }
        }
        document.cookie = b + "=" + escape(e) + (a != -1 ? ";expires=" + a : "") + (g ? ";path=" + g : "") + (c ? "; domain=" + c : "") + (f ? "; secure" : "");
    };
    this.get = function (a) {
        return (new RegExp(" " + a + "=([^;]*)").test(" " + document.cookie)) ? unescape(RegExp.$1) : "";
    };
    this.clear = function (a) {
        this.set(a, "", -1);
    };
    this.isEnabled = function () {
        if (!util.type.isBoolean(navigator.cookieEnabled)) {
            var b = "CookieAllowed",
                a = "__BrowserForCookieSupport__";
            this.set(a, test, 90, null);
            navigator.cookieEnabled = (b == this.get(a));
            if (navigator.cookieEnabled) {
                this.remove(a);
            }
        }
        return navigator.cookieEnabled;
    };
};

System.getContext = function () {
    return context;
};

String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
};

String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
};

System.initSPCallLink = function (orderId) {
    $("a.sp_link").each(function () {
        var phoneNum = $(this).attr("phoneNum");
        var isLocal = false;
        if (phoneNum) {
            var preffix1 = parseInt(phoneNum.substr(0, 1));
            var preffix3 = phoneNum.substr(0, 3);
            if (preffix1 == 0) {
                phoneNum = phoneNum.replace("-", "");
                if (preffix3 == "025") {
                    phoneNum = phoneNum.replace("025", "");
                }
            } else {
                var phoneList = PhoneRange.nj[preffix3];
                if (phoneList) {
                    var preeffix7 = phoneNum.substr(0, 7);
                    if (matchedResult = phoneList.indexOf(preeffix7) > 0) {
                        isLocal = true;
                    }
                }
                if (!isLocal) {
                    phoneNum = "0" + phoneNum;
                }
            }
            var callLink = "tuniucom://callfun?param1=3" + phoneNum + "&param2=#" + orderId;
            $(this).attr("href", callLink);
            $(this).addClass("link-green");
        }
    });
};

/**
 * json序列化对象+base64编码 return 处理后的字符串
 */
System.getRequestParams = function (object) {
    object = $.extend(true, {}, object);
    return Base64.encode(JSON.stringify(object));
};
/**
 * 解析返回数据
 */
System.parseResponseData = function (data) {
    var respData = new Object();
    if (data) {
        respData = JSON.parse(Base64.decode(data));
    }
    return respData;
};

/**
 * 比较时间大小，格式“HH:mm”
 * timeStart 与 timeEnd 比较
 */
System.compareStrTime = function (timeStart, timeEnd) {
    var dateA = new Date("1900/1/1 " + timeStart);
    var dateB = new Date("1900/1/1 " + timeEnd);
    if (isNaN(dateA) || isNaN(dateB))
        return null;
    if (dateA > dateB) {
        return 1;
    }
    if (dateA < dateB) {
        return -1;
    }
    return 0;
};

/**
 * 用于公共部分代码开发,主要为点击切换效果
 */
System.initDisplayToggle = function () {
    // 移除之前绑定的点击事件
    $(".put").children("a").each(function (index, event) {
        $(this).unbind("click");
    });
    // 绑定新的点击事件
    $(".put").children("a").each(function (index, event) {
        $(this).bind("click", function () {
            var target = $(this).parent().siblings();
            var titleObj = $(this).find("div")[0];
            if (titleObj) {
                titleObj = $(titleObj);
                if (titleObj.hasClass("shrinkage")) {
                    //target.slideDown(300);
                    target.show();
                    titleObj.removeClass("shrinkage");
                } else {
                    //target.slideUp(300);
                    target.hide();
                    titleObj.addClass("shrinkage");
                }
            }
        });
    });
    return true;
};

/**
 * 同步请求
 */
System.ajaxSubmitNonAsync = function (data, type, url) {
    var responseData = null;
    $.ajax({
        // 提交数据的类型 POST GET
        type: type,
        // 提交的网址
        url: url,
        // 提交的数据
        data: data,
        // 返回数据的格式
        dataType: "text",
        async: false,
        // 成功返回之后调用的函数
        success: function (data) {
            responseData = data;
        }
    });
    return responseData;
};
/**
 * data 请求数据 type 请求方式 "get" "post" url 请求服务地址 callback 回调方法
 */
System.ajaxSubmit = function (data, type, url, callback) {
    $.ajax({
        // 提交数据的类型 POST GET
        type: type,
        // 提交的网址
        url: url,
        // 提交的数据
        data: data,
        // 返回数据的格式
        dataType: "text",
        // 成功返回之后调用的函数
        success: function (data) {
            if (callback && typeof callback == "function") {
                callback(data);
            }
        }
    });
};

System.util = {};
System.util.merge = function (obj) {
    for (var i = 1; i < arguments.length; i++) {
        var def = arguments[i];
        for (var n in def) {
            if (obj[n] === undefined) obj[n] = def[n];
        }
    }
    return obj;
};

System.util.DatePack = {
    toString: function (date, format) {
        if (!date) return "";
        if (!System.type.isDate(date)) return "";
        format = format ? format : "y-m-d";
        switch (format) {
            case "y-m":
                return date.getFullYear() + "-" + System.util.DatePack.pad(date.getMonth() + 1, 2);
            case "y-m-d":
                return date.getFullYear() + "-" + System.util.DatePack.pad(date.getMonth() + 1, 2) + "-" + System.util.DatePack.pad(date.getDate(), 2);
            case "h-m-s":
                return System.util.DatePack.pad(date.getHours(), 2) + ":" + System.util.DatePack.pad(date.getMinutes(), 2) + ":" + System.util.DatePack.pad(date.getSeconds(), 2);
            case "y-m-d-h-m-s":
                return date.getFullYear() + "-" + System.util.DatePack.pad(date.getMonth() + 1, 2) + "-" + System.util.DatePack.pad(date.getDate(), 2) + " " + System.util.DatePack.pad(date.getHours(), 2) + ":" + System.util.DatePack.pad(date.getMinutes(), 2) + ":" + System.util.DatePack.pad(date.getSeconds(), 2);
        }
    },
    pad: function (num, n) {
        if (( num + "" ).length >= n)
            return num;
        return arguments.callee("0" + num, n);
    },
    parseDate: function (string) {
        var matches;
        if (matches = string.match(/^(\d{4,4})-(\d{2,2})-(\d{2,2})$/)) {
            return new Date(matches[1], matches[2] - 1, matches[3]);
        } else {
            return null;
        }
        ;
    },
    addDate: function (date, days, format) {
        var dateLong = new Date(date).valueOf();
        dateLong += 24 * 60 * 60 * 1000 * days;
        return this.toString(new Date(dateLong), format || "y-m-d");
    },
    delDate: function (date, days, format) {
        var dateLong = new Date(date).valueOf();
        dateLong -= 24 * 60 * 60 * 1000 * days;
        return this.toString(new Date(dateLong), format || "y-m-d");
    },
    getDay: function (days) {
        return new Date(days).getDay();
    },
    getTime: function (date) {
        return new Date(date).getTime();
    },
    defaultConfig: {
        weekNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        format: "YYYY-MM-DD",
        seconds: 1000, // 1000
        minutes: 60000, // 60 * 1000
        hours: 3600000, // 60 * 60 * 1000
        days: 86400000, // 24 * 60 * 60 * 1000
        weeks: 604800000, // 7 * 24 * 60 * 60 * 1000
        months: 2592000000, // 30 * 24 * 60 * 60 * 1000
        years: 31536000000 // 365 * 24 * 60 * 60 * 1000
    }
};

System.form = {
    get: function (node) {
        var datas = this.datas = {};
        if (!node || ($.isArray(node) && node.length == 0)) {
            return {};
        }
        $("input,select,textarea", $(node)).each(function (i, n) {
            var nodeName = n && n.nodeName;
            switch (nodeName) {
                case "INPUT":
                    switch (n.type) {
                        case "checkbox":
                            if ($(n).attr("name")) {
                                if (!datas[$(n).attr("name")]) {
                                    datas[$(n).attr("name")] = [];
                                }
                                if (n.checked) {
                                    datas[$(n).attr("name")].push(n.value);
                                }
                            }
                            break;
                        case "radio":
                            if ($(n).attr("value") == "on") {
                                if (n.checked) {
                                    datas[$(n).attr("name")] = 1;
                                } else {
                                    datas[$(n).attr("name")] = 0;
                                }
                            } else {
                                if (n.checked) {
                                    datas[$(n).attr("name")] = $(n).attr("value");
                                }
                            }
                            break;
                        default:
                            if ($(n).attr("autocomplete")) {
                                return;
                            }
                            datas[$(n).attr("name")] = $.trim($(n).val());
                    }
                    break;
                case "SELECT":
                    $("option", n).each(function (j, o) {
                        if (o.selected) {
                            if ($(n).attr("name")) {
                                datas[$(n).attr("name")] = $.trim($(o).attr("value"));
                            }
                        }
                    });
                    break;
                case "TEXTAREA":
                    datas[$(n).attr("name")] = $.trim($(n).val());
                    break;
            }
        });
        if ("undefined" in datas) {
            delete datas["undefined"];
        }
        return datas;
    },
    set: function (node, data) {
        if (!$.isPlainObject(data)) {
            return;
        }
        if (!node) {
            return;
        }
        for (var i in data) {
            var input = $("input[name='" + i + "']", $(node));
            switch (input.attr("type")) {
                case "checkbox":
                case "radio":
                    if (input.attr("value") == "on") {
                        if (parseInt(data[i]) === 1) {
                            input[0].checked = true;
                        } else {
                            input[0].checked = false;
                        }
                    } else {
                        if (input.length > 1) {
                            input.each(function (j, n) {
                                if (n.value == data[i]) {
                                    n.checked = true;
                                }
                            });
                        }
                    }
                    break;
                default:
                    input.val(data[i]);
            }
            var select = $("select[name='" + i + "']", $(node));
            $("option[value='" + data[i] + "']", select).attr("selected", "true");
            var textarea = $("textarea[name='" + i + "']", $(node)).val(data[i]);
        }
    }
};

System.tmpl = function tmpl(str, data) {
    var fn;
    if (!/\W/.test(str)) {
        cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML);
    } else {
        fn = new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
    }
    return data ? fn(data) : fn;
};

/**
 * 类型判断
 * public method :
 */
System.type = {
    isArray: function () {
        for (var b = 0, c, a = arguments.length; b < a; b++) {
            c = arguments[b];
            if (Array.isArray && !Array.isArray(c) || !(System.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("Array") > -1 || c instanceof Array))) {
                return false;
            }
        }
        return true;
    },
    isBoolean: function () {
        for (var b = 0, c, a = arguments.length; b < a; b++) {
            c = arguments[b];
            if (!(typeof c === "boolean" || System.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("Boolean") > -1 || c instanceof Boolean))) {
                return false;
            }
        }
        return true;
    },
    isFunction: function () {
        for (var b = 0, a = arguments.length; b < a; b++) {
            if (typeof arguments[b] !== "function") {
                return false;
            }
        }
        return true;
    },
    isNull: function () {
        for (var b = 0, c, a = arguments.length; b < a; b++) {
            c = arguments[b];
            if (c === null || System.type.isUndefined(c)) {
                return true;
            }
        }
        return false;
    },
    isNumber: function () {
        for (var b = 0, c, a = arguments.length; b < a; b++) {
            c = arguments[b];
            if (!(typeof c === "number" || System.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("Number") > -1 || c instanceof Number)) || isNaN(c)) {
                return false;
            }
        }
        return true;
    },
    isObject: function () {
        for (var b = 0, c, a = arguments.length; b < a; b++) {
            c = arguments[b];
            if (typeof c != "object" || c === null) {
                return false;
            }
        }
        return true;
    },
    isString: function () {
        for (var b = 0, c, a = arguments.length; b < a; b++) {
            c = arguments[b];
            if (!(typeof c === "string" || System.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("String") > -1 || c instanceof String))) {
                return false;
            }
        }
        return true;
    },
    isUndefined: function () {
        for (var b = 0, a = arguments.length; b < a; b++) {
            if (typeof arguments[b] === "undefined") {
                return true;
            }
        }
        return false;
    },
    isDefined: function () {
        for (var a = 0; a < arguments.length; a++) {
            if (System.type.isUndefined(arguments[a])) {
                return false;
            }
        }
        return true;
    },
    isNumeric: function () {
        for (var b = 0, c, a = arguments.length; b < a; b++) {
            c = arguments[b];
            if (!(!isNaN(c) && isFinite(c) && (c !== null) && !System.type.isBoolean(c) && !System.type.isArray(c))) {
                return false;
            }
        }
        return true;
    },
    isDate: function () {
        for (var b = 0, a = arguments.length; b < a; b++) {
            o = arguments[b];
            if (!(System.type.isObject(o) && o.constructor && (o.constructor.toString().indexOf("Date") > -1 || o instanceof Date))) {
                return false;
            }
        }
        return true;
    }
};

/**
 * GUID设置
 * public method :
 *        System.guid.guid()
 */
System.guid = function () {
    var S4 = function () {
        return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};


/**
 * 获取url参数（base64）加密过的，
 * public method :
 *        getURLParam(name)
 */
System.getURLParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = Base64.decode(window.location.search.substr(1)).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

System.packageAjax = {};
System.packageAjax.request = function (options) {
    var uid = System.cookie.get("honeydukesUid");
    var nickname = Base64.decode(System.cookie.get("honeydukesUname"));
    var token = System.cookie.get("honeydukesSessionID");
    return new function () {
        var _this = this;
        $.extend(true, this, {
            url: "",
            async: true,
            cache: true,
            dataType: "text",
            type: "POST",
            encode: true,
            //post url中是否需要用户信息
            noUserInfo: false,
            serverTransfer: serverTransfer,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            addlistener: {
                beforerequest: "beforeSend",
                success: "success",
                requestcomplete: "complete",
                error: "error",
                beforesuccess: "dataFilter"
            }
        }, options);
        for (var i in this.listener) {
            var functionStr = 'if ("' + i + '" == "success"){' + 'var data = arguments[0], textStatus = arguments[1];' + 'if (this.encode){' + 'try{' + 'data = Base64.decode(data);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行Base64编码处理！请求地址："+this.url+"返回数据："+data);' + '}' + 'try{' + 'data = JSON.parse(data);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行JSON格式检查！请求地址："+this.url+"返回数据："+data);' + '}' + '}else{' + 'data = JSON.parse(data);' + '}' + 'if(!data.success){' + 'throw new Error("后台数据报错：错误代码：" + data.errorCode + "，错误信息：" + data.msg);return;' + '}else{' + 'this.listener["' + i + '"].call(this, data, textStatus);' + '}' + '}else if("' + i + '" == "requestcomplete"){' + 'var data = arguments[0];' + 'try{' + 'data = Base64.decode(data.responseText);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行Base64编码处理！请求地址："+this.url+"返回数据："+data);' + '}' + 'try{' + 'data = JSON.parse(data);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行JSON格式检查！请求地址："+this.url+"返回数据："+data);' + '}' + 'this.listener["' + i + '"].call(this, data, textStatus);' + '}else if("' + i + '" == "beforesuccess"){' + 'var data = arguments[0], type = arguments[1];' + 'this.listener["' + i + '"].call(this, data, type);return data' + '}else if("' + i + '" == "error"){' + 'this.listener["' + i + '"].call(this, arguments);' + '}else{' + 'this.listener["' + i + '"].call(this, arguments);' + '}';
            this[this.addlistener[i]] = new Function(functionStr);
        }
        try {
            //是否由服务器中转
            var href,
                serverHref;
//				if (this.serverTransfer) {
//					href = serverTransferURL;
//					serverHref = this.url.replace(/http:\/\//gi, "");
//				};
            var userData;
            var connector = "?";
            if (this.type === "GET") {
                userData = $.extend({
                    uid: uid,
                    token: token,
                    nickname: nickname,
                    r: Math.random()
                }, this.data);
                if (this.url.indexOf("?") !== -1) {
                    connector = "&";
                }
                ;
                if (!this.serverTransfer) {
                    userData = Base64.encode(JSON.stringify(userData));
                    this.url = this.url + connector + userData;
                } else {
                    if (serverHref.indexOf("?") !== -1) {
                        connector = "&";
                    }
                    ;
                    userData = Base64.encode(serverHref + connector + Base64.encode(JSON.stringify(userData)));
                    this.url = href + "?" + userData;
                }
                delete this.data;
            }
            if (this.type === "POST") {
                var defaultData = {
                    uid: uid,
                    token: token,
                    nickname: nickname,
                    r: Math.random()
                }
                var defaultDataStr = Base64.encode(JSON.stringify(defaultData));

                this.data = $.extend(true, {}, defaultData, this.data);

                if (this.encode) {
                    this.data = Base64.encode(JSON.stringify(this.data));
                }
                if (this.serverTransfer) {
                    if (serverHref.indexOf("?") !== -1) {
                        connector = "&";
                    }
                    ;
                    serverHref = Base64.encode(serverHref + connector + defaultDataStr);
                    this.url = href + "?" + serverHref;
                } else {
                    if (!!!this.noUserInfo) {
                        this.url = this.url + connector + defaultDataStr;
                    }
                }
            }
            $.ajax(this);
        } catch (e) {
            alert(e.message);
        }
    };
};
/*
 * 输入框校验正则对象
 * */
System.Ver = {
    //手机验证
    cell: function (cell) {
        var test = /^0?1(([3,4,5,7,8]{1}[0-9]{1})|(5[0-9]{1})|(59)){1}[0-9]{8}$/;
        var intTest = /(00)(\d+)/;
        return test.test(cell) || intTest.test(cell);
    },
    //固话区号
    telCode: function (telCode) {
        var test = /^(0[\d]{2,3})$/;
        return test.test(telCode);
    },
    //固话号码
    tel: function (tel) {
        var test = /^\d{6,8}$/;
        return test.test(tel);
    },
    //固话区号加号码
    telAll: function (tel) {
        //var test = /^(0[\d]{2,3}-)?\d{6,8}(-\d{3,6})?$/;带“-”的
        var test = /^(0[\d]{2,3})?\d{6,8}(-\d{3,6})?$/;//bu带“-”的
        return test.test(tel);
    },
    //传真 区号固话号码+分机号
    fax: function (tel) {
        var test = /^(0[\d]{2,3})?\d{6,8}(\+\d{3,6})?$/;
        return test.test(tel);
    },
    //日期YYYY-MM-DD
    date: function (date) {
        var test = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
        return test.test(date);
    },
    //开始日期和结束日期
    rangeDate: function (dates) {
        var start = dates.slice(0, 10);
        var end = dates.slice(12, 22);
        var test = /(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)/;
        return test.test(start) && test.test(end);
    },
    //电子邮件
    email: function (email) {
        var test = /^[A-Za-z0-9]+(\.?[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        return test.test(email);
    },
    //url
    url: function (url) {
        var test = /(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;
        return test.test(url);
    },
    //特殊字符
    charReg: function (ch) {
        var test = /[!@#$%^&*?~\'\"]/;
        return test.test(ch);
    },
    //匹配由数字和26个英文字母组成的字符串
    letterAndNum: function (letterAndNum) {
        var test = /^[A-Za-z0-9\s]+$/;
        return test.test(letterAndNum);
    },
    //匹配价格(整数和小数)
    price: function (price) {
        var test = /^\d+[\.]?\d{0,2}$/;
        return test.test(price);
    },

    num: function (num) {
        var test = /^(-?\d+)(\.\d+)?$/;
        return test.test(num);
    },

    //正整数
    positiveInt: function (positiveInt) {
        var test = /^[0-9]*[1-9][0-9]*$/;
        return test.test(positiveInt);
    },
    //非负整数
    nonnegativeInt: function (nonnegativeInt) {
        var test = /^\d+$/;
        return test.test(nonnegativeInt);
    },
    nonnegativeIntNum: function (nonnegativeIntNum) {
        var test = /^\d+$/;
        return test.test(nonnegativeIntNum);
    },
    //年份
    yearInt: function (year) {
        var test = /^[\d]{4}$/;
        return test.test(year);
    },
    //日期YYYY-MM
    dateEx: function (date) {
        var test = /([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-((0[1-9])|(1[012])){1}$/;
        return test.test(date);
    },
    //固话区号加号码加分机号
    telNum: function (tel) {
        var test = /^(0[\d]{2,3}-)\d{6,8}(-\d{3,6})$/;
        return test.test(tel);
    },
    //优惠码
    codePMF: function (code) {
        var test = /^[\w]{8}$/;
        return test.test(code);
    }
};

/*
 * 校验方法
 * 入参：  container 检查container内部有 ver-pattern 格式类的input、textarea控件输入框是否匹配，不匹配的报红，添加tooltip
 * */
System.verify = {
    verTitle: {
        "num": "请输入浮点数字",
        "cell": "请输入正确的手机号，如：13899977777",
        "telCode": "请输入固话的区号，如：025,010,0510...",
        "tel": "请输入固话号码，如87654321",
        "telAll": "请输入固话区号加号码，如02587654321",
        "fax": "请输入区号传真号码+分机号，如02587654321+001",
        "date": "请输入日期，格式YYYY-MM-DD，如2012-01-01",
        "rangeDate": "请输入时间段，格式YYYY-MM-DD——YYYY-MM-DD，如2012-01-01——2012-07-01",
        "email": "请输入电子邮件地址，如tuniu@tuniu.com",
        "url": "请输入url地址，如http://www.tuniu.com",
        "charReg": "存在特殊字符...",
        "letterAndNum": "请输入字母和数字，如sd823",
        "price": "请输入价格，如4.99",
        "positiveInt": "请输入正整数，如2",
        "nonnegativeIntNum": "请输入不小于0的整数",
        "nonnegativeInt": "请输入非负整数，如0",
        "yearInt": "请输入年份，如2012",
        "dateEx": "请输入年份和月份，格式YYYY-MM，如2012-06",
        "telNum": "请输入固话区号加号码加分机号，如025-87654321-66666",
        "codePMF": "输入的优惠码错误，请重新输入"
    },
    checkIdCard: function (idcard) {
        var Errors = [
            true,
            "身份证号码位数不对!",
            "身份证号码出生日期超出范围或含有非法字符!",
            "身份证号码校验错误!",
            "身份证地区非法!"
        ];
        if (idcard === '') {
            return true;
        }
        var area = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        }

        var idcard, Y, JYM, JYM_X;
        var S, M, M_X;
        var idcard_array = [];
        idcard_array = idcard.split("");
        /*地区检验*/
        if (area[parseInt(idcard.substr(0, 2))] == null) {
//			return Errors[4];
            return false;
        }
        /*身份号码位数及格式检验*/
        switch (idcard.length) {
            case 15:
                if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 400 == 0 )) {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
                } else {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
                }
                if (ereg.test(idcard)) {
                    return true; //15位验证通过
                }
                else {
//					return Errors[2];
                    return false;
                }
                break;

            case 18:
                //18位身份号码检测
                //出生日期的合法性检查
                //闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
                //平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
                if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0 )) {
                    ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
                } else {
                    ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
                }
                if (ereg.test(idcard)) {//测试出生日期的合法性
                    //计算校验位
                    S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7
                        + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9
                        + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10
                        + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5
                        + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8
                        + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4
                        + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2
                        + parseInt(idcard_array[7]) * 1
                        + parseInt(idcard_array[8]) * 6
                        + parseInt(idcard_array[9]) * 3;
                    Y = S % 11;
                    M = "F";

                    JYM = "10x98765432";
                    JYM_X = "10X98765432";
                    M = JYM.substr(Y, 1);
                    /*判断校验位*/
                    M_X = JYM_X.substr(Y, 1);
                    /*判断校验位*/

                    if (M == idcard_array[17] || M_X == idcard_array[17]) {
//						return 1; /*检测ID的校验位false;*/
                        return true;
                    }
                    else {
//						return Errors[3];
                        return false;
                    }
                }
                else {
//					return Errors[2];
                    return false;
                }
                break;

            default:
                return false;
                break;
        }
    },
    check: function (container, placement) { //placement可以不赋值
        var flag = true,
            title = '';
        $('input,textarea,select', container).each(function (i, n) {
            title = '';
            var node = $(n),
                value = $(n).val();
            node.removeClass('error_input').tooltip('destroy');
            if ($.trim(value) != '' && node.hasClass("ver-pattern") && node.attr("ver-type") && System.verify.verTitle[node.attr("ver-type")]) {
                var pattern = node.attr("ver-type");
                if (!System.Ver[pattern]($.trim(value))) {
                    flag = false;
                    title += System.verify.verTitle[pattern];
                }
            } else if (node.hasClass("ver-required") && $.trim(value) == '') {
                flag = false;
                title += '不能为空';
            } else if (node.hasClass("unallowed-lt") && $.trim(value) && $.trim(value).indexOf("<") != -1) {
                flag = false;
                title += '不能含有“<”字符';
            }
            if (node.attr("ver-length")) {
                var len = parseInt(node.attr("ver-length"))
                if (value.length != len) {
                    flag = false;
                    title += '长度必须为' + len + '位';
                }

            }
            if (title != '') {
                if (typeof placement == "undefined") {
                    node.addClass('error_input').tooltip({title: title}); //提示框的提示位置默认为top
                } else {
                    node.addClass('error_input').tooltip({title: title, placement: placement}); //设置提示框的提示位置
                }

            }
        });
        return flag;
    }
};

System.getDate = function (strDate) {
    var st = strDate;
    try {
        var a = st.split(" ");
    } catch (e) {
        var a = ['', ''];
    }
    try {
        var b = a[0].split("-");
    } catch (e) {
        var b = ['', '', ''];
    }
    try {
        var c = a[1].split(":");
    } catch (e) {
        var c = ['', '', ''];
    }
    var date = new Date(b[0], b[1], b[2], c[0], c[1], c[2]);
    return date;
};

System.MsgBox = {
    alert: function (msg, callback) {
        this.GenerateHtml("alert", "提示", msg);
        this.btnOk(callback); //alert只是弹出消息，因此没必要用到回调函数callback
    },
    confirm: function (msg, callback, callbackNo) {
        this.GenerateHtml("confirm", "确认", msg);
        this.btnOk(callback);
        this.btnNo(callbackNo);
    },
    info: function (msg, time) {
        this.GenerateHtml("info", "提示", msg, time);
    },
    GenerateHtml: function (type, title, msg, time) {
        var self = this;
        $(".mb_con").remove();
        var _html = "";

        if (type != "info") {
            _html += '<div class="mb_box"></div>';
        }
        _html += '<div class="mb_con"><span class="mb_tit">' + title + '</span>';
        _html += '<a class="mb_ico">x</a><div class="mb_msg">' + msg + '</div>';

        if (type == "alert") {
            _html += '<div class="mb_btnbox"><span class="mb_btn_ok btn btn-green">确定</span></div>';
        }
        if (type == "confirm") {
            _html += '<div class="mb_btnbox"><span class="mb_btn_ok btn btn-green  mr-10px">确定</span>';
            _html += '<span class="mb_btn_no  btn btn-delete ">取消</span></div>';
        }
        _html += '</div>';
        //必须先将_html添加到body，再设置Css样式
        if (type != "info") {
            self.overlay = $(_html)[0];
            self.container = $(_html)[1];
        } else {
            self.overlay = undefined;
            self.container = $(_html)[0];
        }
        self.GenerateCss.call(self);

        if (type == "info") {
            var setTo = setTimeout(function () {
                clearTimeout(setTo);
                $(self.container).animate({height: "0"}, 500, function () {
                    $(self.container).hide();
                    self.container.style.border = 0;
                    self.overlay && $(self.overlay).remove();
                });
            }, (time || 1500));
        }

        self.btnNo.call(self);
    },
    GenerateCss: function () {
        var self = this;

        //右上角关闭按钮hover样式
        $(".mb_ico", self.container).hover(function () {
            $(this).css({backgroundColor: 'Red', color: 'White'});
        }, function () {
            $(this).css({backgroundColor: '#DDD', color: 'black'});
        });

        var _widht = document.documentElement.clientWidth; //屏幕宽
        var _height = document.documentElement.clientHeight; //屏幕高

        var boxWidth = self.container.style.width || 400;
        var boxHeight = self.container.style.height || 149;

        //让提示框居中
        self.container.style.top = (_height - boxHeight) / 2 + "px";
        self.container.style.left = (_widht - boxWidth) / 2 + "px";
        $("body").append(self.overlay).append(self.container);
    },
    //确定按钮事件
    btnOk: function (callback) {
        $(".mb_btn_ok", "body").click(function () {
            $(".mb_con").remove();
            $(".mb_box").slideUp();
            $(".mb_box").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });
    },
    //取消按钮事件
    btnNo: function (callback) {
        $(".mb_btn_no,.mb_ico", "body").click(function () {
            $(".mb_con").remove();
            $(".mb_box").slideUp();
            $(".mb_box").remove();
            if (typeof (callback) == 'function') {
                callback();
            }
        });
    }
};

System.refreshOrderPrice = function () {
    try {
        //刷新订单总价格
        if (typeof (Confirm) != "undefined" && typeof (Confirm.refreshPrice) == "function") {
            Confirm.refreshPrice();
        } else {
            if (typeof (PriceDetail) != "undefined"
                && typeof (PriceDetail.refresh) == "function") {
                PriceDetail.refresh();
            }
        }
    } catch (e) {
        console.log("refresh order price info error after join promition");
    }
};

System.getGUID = function () {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
};
window.SystemAjax = System.packageAjax;


/*加载数据缓冲动画*/
;(function (win, $) {

    var UtilLoading = {};

    UtilLoading.open = function (msg) {
        var html = '';
        html += '<div class="loading-mask" role="UtilLoading">';
        html += '<div class="loading-wrapper">';
        html += '<a onclick="$(this).parents(\'[role=UtilLoading]\').remove()" class="loading-close-btn">&times;</a>';
        html += '<div class="loading-content">';
        html += '<div class="loading-animate-wrapper">';
        html += '<div class="loading-animate-inner"><div class="loader"><div class="loading-2">';
        html += '<i></i><i></i><i></i><i></i><i></i></div></div></div>';
        if (typeof msg == "undefined") {
            html += '<div class="loading-animate-text">数据正在加载，请稍等';
        } else {
            html += '<div class="loading-animate-text">' + msg;
        }
        html += '<span class="pointer">.</span>';
        html += '<span class="pointer">.</span>';
        html += '<span class="pointer">.</span>';
        html += '<span class="pointer">.</span>';
        html += '<span class="pointer">.</span>';
        html += '</div></div></div></div></div>';
        $(html).appendTo(document.body);
    }

    UtilLoading.close = function () {
        setTimeout(fun, 1000);
        function fun() {
            $("[role='UtilLoading']").remove();
        }
    }


    window.UtilLoading = UtilLoading;


})(window, jQuery)