/**
 * Created by zhangbinbin on 2017/8/31.
 */
!function (window, document, undefined) {
    var util = {};
    util.config = {
        version: "0.0.2",
        domain: "tuniu.org"
    };

    var rwebkit = /(webkit)[ \/]([\w.]+)/,
        ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
        rmsie = /(msie) ([\w.]+)/,
        rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

    util.uriTest = {
        scheme: /^([^:]+)\:.+$/,
        user: /^([^@\/]+)@.+$/,
        host: /^([^:\/\?\#]+).*$/,
        port: /^:(\d+)/,
        path: /^([^\?#]*)/,
        dirPath: /^(.*\/)[^\/]*$/,
        fragment: /^[^#]*#(.*)$/,
        absUri: /^\w(\w|\d|\+|\-|\.)*:/i
    }

    /**
     * 浏览器判断
     * @return
     *        util.browser.msie
     *        util.browser.mozilla
     *        util.browser.webkit
     *        util.browser.opera
     *        util.browser.version
     */
    util.browser = {};

    var uaMatch = function (ua) {
        ua = ua.toLowerCase();
        var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    }

    var browserMatch = uaMatch(navigator.userAgent);
    if (browserMatch.browser) {
        util.browser[browserMatch.browser] = true;
        util.browser.version = browserMatch.version;
    }

    /**
     * 类型判断
     * public method :
     *        util.type.isArray()
     *        util.type.isBoolean()
     *        util.type.isFunction()
     *        util.type.isNull()
     *        util.type.isNumber()
     *        util.type.isObject()
     *        util.type.isString()
     *        util.type.isUndefined()
     *        util.type.isDefined()
     *        util.type.isNumeric()
     *        util.type.isDate()
     */
    util.type = {
        isArray: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (Array.isArray && !Array.isArray(c) || !(util.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("Array") > -1 || c instanceof Array))) {
                    return false;
                }
            }
            return true;
        },
        isBoolean: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (!(typeof c === "boolean" || util.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("Boolean") > -1 || c instanceof Boolean))) {
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
                if (c === null || util.type.isUndefined(c)) {
                    return true;
                }
            }
            return false;
        },
        isNumber: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (!(typeof c === "number" || util.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("Number") > -1 || c instanceof Number)) || isNaN(c)) {
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
                if (!(typeof c === "string" || util.type.isObject(c) && c.constructor && (c.constructor.toString().indexOf("String") > -1 || c instanceof String))) {
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
                if (util.type.isUndefined(arguments[a])) {
                    return false;
                }
            }
            return true;
        },
        isNumeric: function () {
            for (var b = 0, c, a = arguments.length; b < a; b++) {
                c = arguments[b];
                if (!(!isNaN(c) && isFinite(c) && (c !== null) && !util.type.isBoolean(c) && !util.type.isArray(c))) {
                    return false;
                }
            }
            return true;
        },
        isDate: function () {
            for (var b = 0, a = arguments.length; b < a; b++) {
                o = arguments[b];
                if (!(util.type.isObject(o) && o.constructor && (o.constructor.toString().indexOf("Date") > -1 || o instanceof Date))) {
                    return false;
                }
            }
            return true;
        }
    };

    /**
     * JSON编解码
     * public method :
     *        util.json.encode(string)
     *        util.json.decode(object)
     */
    util.json = new function () {
        var useHasOwn = !!{}.hasOwnProperty;
        var pad = function (n) {
            return n < 10 ? "0" + n : n;
        };
        var m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"': '\\"',
            "\\": '\\\\'
        };
        var encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                    }) + '"';
            }
            return '"' + s + '"';
        };
        var encodeArray = function (o) {
            var a = ["["],
                b, i, l = o.length,
                v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : util.json.decode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };
        var encodeDate = function (o) {
            return '"' + o.getFullYear() + "-" + pad(o.getMonth() + 1) + "-" + pad(o.getDate()) + "T" + pad(o.getHours()) + ":" + pad(o.getMinutes()) + ":" + pad(o.getSeconds()) + '"';
        };
        this.decode = function (o) {
            if (typeof o == "undefined" || o === null) {
                return "null";
            } else if (o instanceof Array) {
                return encodeArray(o);
            } else if (o instanceof Date) {
                return encodeDate(o);
            } else if (typeof o == "string") {
                return encodeString(o);
            } else if (typeof o == "number") {
                return isFinite(o) ? String(o) : "null";
            } else if (typeof o == "boolean") {
                return String(o);
            } else {
                var a = ["{"],
                    b, i, v;
                for (i in o) {
                    if (!useHasOwn || o.hasOwnProperty(i)) {
                        v = o[i];
                        switch (typeof v) {
                            case "undefined":
                            case "function":
                            case "unknown":
                                break;
                            default:
                                if (b) {
                                    a.push(',');
                                }
                                a.push(this.decode(i), ":",
                                    v === null ? "null" : this.decode(v));
                                b = true;
                        }
                    }
                }
                a.push("}");
                return a.join("");
            }
        };
        this.encode = function (json) {
            return eval("(" + json + ")");
        };
    };

    /**
     * Cookie设置
     * public method :
     *        util.cookie.get(key)
     *        util.cookie.set(key, value, days, path, domain, secure)
     */
    window.Cookie = util.cookie = new function () {
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

    /**
     * GUID设置
     * public method :
     *        util.guid.guid()
     */
    util.guid = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    var cache = {};

    /**
     * 简易模板
     * @param  {html} str html模板
     * @param  {object} data 绑定的数据
     * @return {object or function} 返回结果模板或者绑定数据方法
     */
    util.tmpl = function tmpl(str, data) {
        var fn;
        if (!/\W/.test(str)) {
            cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML);
        } else {
            fn = new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
        }
        return data ? fn(data) : fn;
    };

    /**
     * 常用工具对象合并
     * @param  {object} obj 要合并的对象
     * @return {object}     合并后的对象
     */
    util.util = {};
    util.util.merge = function (obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i];
            for (var n in def) {
                if (obj[n] === undefined) obj[n] = def[n];
            }
        }
        return obj;
    };
    /**
     * Ajax操作
     */
    window.Ajax = util.ajax = new function () {
        this.request = function (options) {
            var uid = util.cookie.get("honeydukesUid") || "";
            var nickname = util.Base64.decode(localStorage.getItem("honeydukesUname") || "");
            var token = util.cookie.get("honeydukesSessionID") || "";
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
                    var functionStr = 'if ("' + i + '" == "success"){' + 'var data = arguments[0], textStatus = arguments[1];' + 'if (this.encode){' + 'try{' + 'data = util.Base64.decode(data);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行Base64编码处理！请求地址："+this.url+"返回数据："+data);' + '}' + 'try{' + 'data = util.json.encode(data);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行JSON格式检查！请求地址："+this.url+"返回数据："+data);' + '}' + '}else{' + 'data = util.json.encode(data);' + '}' + 'if(!data.success){if(this.failback){' + 'this.listener["' + i + '"].call(this, data, textStatus);' + '}else{' + 'throw new Error("后台数据报错：错误代码：" + data.errorCode + "，错误信息：" + data.msg);return;' + '}' + '}else{' + 'this.listener["' + i + '"].call(this, data, textStatus);' + '}' + '}else if("' + i + '" == "requestcomplete"){' + 'var data = arguments[0];' + 'try{' + 'data = util.Base64.decode(data.responseText);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行Base64编码处理！请求地址："+this.url+"返回数据："+data);' + '}' + 'try{' + 'data = util.json.decode(data);' + '}catch (e){' + 'throw new Error("后台数据返回格式错误，请进行JSON格式检查！请求地址："+this.url+"返回数据："+data);' + '}' + 'this.listener["' + i + '"].call(this, data, textStatus);' + '}else if("' + i + '" == "beforesuccess"){' + 'var data = arguments[0], type = arguments[1];' + 'this.listener["' + i + '"].call(this, data, type);return data' + '}else if("' + i + '" == "error"){' + 'this.listener["' + i + '"].call(this, arguments);' + '}else{' + 'this.listener["' + i + '"].call(this, arguments);' + '}';
                    this[this.addlistener[i]] = new Function(functionStr);
                }
                try {
                    //是否由服务器中转
                    var href,
                        serverHref;
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
                        delete this.data;
                    }
                    if (this.type === "POST") {
                        var defaultData = {
                            uid: uid,
                            token: token,
                            nickname: nickname,
                            r: Math.random()
                        }
                        var defaultDataStr = util.Base64.encode(util.json.decode(defaultData));

                        this.data = $.extend(true, {}, defaultData, this.data);

                        /**
                         * 将用户信息放入到post的body部分，但是要求ajax参数必须为object
                         *
                         * userData = $.extend(true, {}, defaultData, this.data);
                         * this.data = util.Base64.encode(util.json.decode(userData));
                         */
                        if (this.encode) {
                            this.data = util.Base64.encode(util.json.decode(this.data));
                        }
                    }
                    $.ajax(this);
                } catch (e) {
                    alert(e.message);
                }
            };
        };
    };
    /**
     * form域值设置和获取
     */
    window.Forms = util.form = {
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
    }
    util.datePack = {
        toString: function (date, format) {
            if (!date) return "";
            if (!Type.isDate(date)) return "";
            format = format ? format : "y-m-d";
            switch (format) {
                case "y-m":
                    return date.getFullYear() + "-" + DatePack.pad(date.getMonth() + 1, 2);
                case "y-m-d":
                    return date.getFullYear() + "-" + DatePack.pad(date.getMonth() + 1, 2) + "-" + DatePack.pad(date.getDate(), 2);
                case "h-m-s":
                    return DatePack.pad(date.getHours(), 2) + ":" + DatePack.pad(date.getMinutes(), 2) + ":" + DatePack.pad(date.getSeconds(), 2);
                case "y-m-d-h-m-s":
                    return date.getFullYear() + "-" + DatePack.pad(date.getMonth() + 1, 2) + "-" + DatePack.pad(date.getDate(), 2) + " " + DatePack.pad(date.getHours(), 2) + ":" + DatePack.pad(date.getMinutes(), 2) + ":" + DatePack.pad(date.getSeconds(), 2);
            }
        },
        pad: function (num, n) {
            if ((num + "").length >= n)
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
    }
    var Nibbler = function (options) {
        var construct, pad, dataBits, codeBits, keyString, arrayData, mask, group, max, gcd, translate, encode, decode,
            utf16to8, utf8to16;
        construct = function () {
            var i, mag, prev;
            pad = options.pad || '';
            dataBits = options.dataBits;
            codeBits = options.codeBits;
            keyString = options.keyString;
            arrayData = options.arrayData;
            mag = Math.max(dataBits, codeBits);
            prev = 0;
            mask = [];
            for (i = 0; i < mag; i += 1) {
                mask.push(prev);
                prev += prev + 1;
            }
            max = prev;
            group = dataBits / gcd(dataBits, codeBits);
        };
        gcd = function (a, b) {
            var t;
            while (b !== 0) {
                t = b;
                b = a % b;
                a = t;
            }
            return a;
        };
        encode = function (str) {
            str = utf16to8(str);
            var out = "",
                i = 0,
                len = str.length,
                c1, c2, c3, base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                out += base64EncodeChars.charAt(c3 & 0x3F);
            }
            return out;
        };
        decode = function (str) {
            var c1, c2, c3, c4;
            var i, len, out;
            var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
            len = str.length;
            i = 0;
            out = "";
            while (i < len) {
                do {
                    c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c1 == -1);
                if (c1 == -1) break;
                do {
                    c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
                } while (i < len && c2 == -1);
                if (c2 == -1) break;
                out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
                do {
                    c3 = str.charCodeAt(i++) & 0xff;
                    if (c3 == 61) {
                        out = utf8to16(out);
                        return out;
                    }
                    c3 = base64DecodeChars[c3];
                } while (i < len && c3 == -1);
                if (c3 == -1) break;
                out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
                do {
                    c4 = str.charCodeAt(i++) & 0xff;
                    if (c4 == 61) {
                        out = utf8to16(out);
                        return out;
                    }
                    c4 = base64DecodeChars[c4];
                } while (i < len && c4 == -1);
                if (c4 == -1) break;
                out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
            }
            out = utf8to16(out);
            return out;
        };
        utf16to8 = function (str) {
            var out, i, len, c;
            out = "";
            len = str.length;
            for (i = 0; i < len; i++) {
                c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
            }
            return out;
        };
        utf8to16 = function (str) {
            var out, i, len, c;
            var char2, char3;
            out = "";
            len = str.length;
            i = 0;
            while (i < len) {
                c = str.charCodeAt(i++);
                switch (c >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        out += str.charAt(i - 1);
                        break;
                    case 12:
                    case 13:
                        char2 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                        break;
                    case 14:
                        char2 = str.charCodeAt(i++);
                        char3 = str.charCodeAt(i++);
                        out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                        break;
                }
            }
            return out;
        }
        this.encode = encode;
        this.decode = decode;
        construct();
    }

    util.Base64 = new Nibbler({
        dataBits: 8,
        codeBits: 6,
        keyString: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        pad: '='
    });

    Date.prototype.tempDate = null;

    Date.prototype.pad = function (num, n) {
        if ((num + "").length >= n) return num;
        return arguments.callee("0" + num, n);
    };
    /**
     * 时间日期格式化
     * @param  {Date} date   日期对象
     * @param  {String} format 格式化内容
     * @return {String}        返回格式如：2013-01-01，如果为IE则返回2013/01/01
     */
    Date.prototype.format = function (date, format) {
        format = format ? format : "y-m-d";
        var str = "";
        if (!date) {
            return "";
        }
        switch (format) {
            case "y":
                str = date.getFullYear();
                break;
            case "y-m":
                str = date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2);
                break;
            case "y-m-d":
                str = date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2) + "-" + this.pad(date.getDate(), 2);
                break;
            case "h-m-s":
                str = this.pad(date.getHours(), 2) + ":" + this.pad(date.getMinutes(), 2) + ":" + this.pad(date.getSeconds(), 2);
                break;
            case "y-m-d-h-m-s":
                str = date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2) + "-" + this.pad(date.getDate(), 2) + " " + this.pad(date.getHours(), 2) + ":" + this.pad(date.getMinutes(), 2) + ":" + this.pad(date.getSeconds(), 2);
                break;
            case "y-m-d-h-m-s-t":
                str = date.getFullYear() + "-" + this.pad(date.getMonth() + 1, 2) + "-" + this.pad(date.getDate(), 2) + " " + this.pad(date.getHours(), 2) + ":" + this.pad(date.getMinutes(), 2) + ":" + this.pad(date.getSeconds(), 2) + ":" + this.pad(date.getMilliseconds(), 2);
                break;
        }
        if (util.browser.msie) {
            return str.replace(/-/ig, "/");
        }
        return str;
    };
    /**
     * 将字符串转化为日期对象
     * @param  {String} date   日期字符串，如2013-01-01
     * @param  {String} format 格式化字符串
     * @return {Date}        返回日期对象
     */
    Date.prototype.parseDate = function (date, format) {
        if (date.constructor == Date) {
            return new Date(date);
        }
        var parts = date.split(/\W+/);
        var against = format.split(/\W+/),
            d, m, y, h, min, now = new Date();
        for (var i = 0; i < parts.length; i++) {
            switch (against[i]) {
                case 'd':
                case 'e':
                    d = parseInt(parts[i], 10);
                    break;
                case 'm':
                    m = parseInt(parts[i], 10) - 1;
                    break;
                case 'Y':
                case 'y':
                    y = parseInt(parts[i], 10);
                    y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
                    break;
                case 'H':
                case 'I':
                case 'k':
                case 'l':
                    h = parseInt(parts[i], 10);
                    break;
                case 'P':
                case 'p':
                    if (/pm/i.test(parts[i]) && h < 12) {
                        h += 12;
                    } else if (/am/i.test(parts[i]) && h >= 12) {
                        h -= 12;
                    }
                    break;
                case 'M':
                    min = parseInt(parts[i], 10);
                    break;
            }
        }
        return new Date(y === undefined ? now.getFullYear() : y, m === undefined ? now.getMonth() : m, d === undefined ? now.getDate() : d, h === undefined ? now.getHours() : h, min === undefined ? now.getMinutes() : min, 0);
    };

    Date.prototype.addDays = function (n) {
        this.setDate(this.getDate() + n);
    };

    Date.prototype.addMonths = function (n) {
        if (this.tempDate === null) {
            this.tempDate = this.getDate();
        }
        this.setDate(1);
        this.setMonth(this.getMonth() + n);
        this.setDate(Math.min(this.tempDate, this.getMaxDays()));
    };

    Date.prototype.getMaxDays = function () {
        var tmpDate = new Date(Date.parse(this)),
            d = 28,
            m;
        m = tmpDate.getMonth();
        d = 28;
        while (tmpDate.getMonth() == m) {
            d++;
            tmpDate.setDate(d);
        }
        return d - 1;
    };

    Date.prototype.addYears = function (n) {
        if (this.tempDate === null) {
            this.tempDate = this.getDate();
        }
        this.setDate(1);
        this.setFullYear(this.getFullYear() + n);
        this.setDate(Math.min(this.tempDate, this.getMaxDays()));
    };

    Date.prototype.config = {
        s: 1000,
        m: 60000,
        h: 3600000,
        d: 86400000,
        w: 604800000,
        M: 2592000000,
        y: 31536000000
    };

    Function.prototype.bind = function () {
        if (!arguments.length) return this;
        var _ = this,
            $ = r.call(arguments),
            A = $.shift();
        return function () {
            return _.apply(A, $.concat(r.call(arguments)));
        };
    };

    util.URI = URI;

    util.md5 = MD5;


    window.Util = util;
    window.Ajax = util.ajax;
}(window, document);

BossAnaly = {
    setConfig: function () {
    },
    pushEvent: function () {
    },
    sendData: function () {
    }
}

function URI(sBase, sRel) {
    this._params = {};
    this.setHref(sBase, sRel);
}

var $p = URI.prototype;
$p._params = null;
$p._scheme = "";
$p._userInfo = "";
$p._port = "";
$p._host = "";
$p._path = "";
$p._dirPath = "";
$p._fragment = "";
$p._query = "";
$p._hrefCache = null;
$p._generic = true;

$p.toString = function () {
    return this.getHref();
}

$p.setHref = function (s, sRel) {
    if (!s) return;
    s = String(s);
    this._hrefCache = null;
    this._scheme = "";
    this._userInfo = "";
    this._host = "";
    this._port = "";
    this._path = "";
    this._dirPath = "";
    this._query = "";
    this._fragment = "";
    this._params = {};
    var ok = util.uriTest.scheme.test(s);
    if (!ok) {
        throw new Error(0x0011, "URI.setHref(s,sRel):'" + s + "' is Not a well formatted URI.");
    }
    this._scheme = RegExp.$1;
    this._generic = s.substr(this._scheme.length, 3) == "://";
    s = s.substring(this._scheme.length + (this._generic ? 3 : 1));
    if (this._generic || "mailto|news|view-source".indexOf(this._scheme) > -1) {
        ok = util.uriTest.user.test(s);
        if (ok) {
            this._userInfo = RegExp.$1;
            s = s.substring(this._userInfo.length + 1);
        }
        if (this._scheme != "file" || s.charAt(0) != "/") {
            ok = util.uriTest.host.test(s);
            if (!ok) {
                throw new Error(0x0011, "URI.setHref(s,sRel):'" + s + "' is Not a well formatted URI.");
            }
            this._host = RegExp.$1;
            s = s.substring(this._host.length);
        }
        ok = util.uriTest.port.test(s);
        if (ok) {
            this._port = Number(RegExp.$1);
            s = s.substring(RegExp.$1.length + 1);
        }
    }

    var self = this;
    parsePathAndRest(s);
    if (sRel) {
        this._hrefCache = null;
        s = String(s);
        var isAbsolute = util.uriTest.absUri.test(s);
        if (isAbsolute) {
            this.setHref(s);
            return;
        }
        var dirPath = this._dirPath;
        this._path = "";
        this._dirPath = "";
        this._query = "";
        this._fragment = "";
        this._params = {};
        s.charAt(0) == "/" ? parsePathAndRest(s) : parsePathAndRest(dirPath + s);
    }

    function parsePathAndRest(s) {
        var ok = util.uriTest.path.test(s);
        if (!ok) {
            throw new Error(0x0011, "URI.setHref(s,sRel):'" + s + "' is Not a well formatted URI.");
        }
        self._path = RegExp.$1;
        s = s.substring(self._path.length);
        if (self._path == "" && "file|https|ftp".indexOf(self._scheme) > -1) {
            self._path = "/";
        }
        var segments = self._path.split("/"),
            sb = [],
            j = 0,
            i;
        for (i = 0; i < segments.length; i++) {
            if (segments[i] == ".") continue;
            if (segments[i] == "..") {
                j--;
                delete sb[j];
                sb.length = j;
                continue;
            }
            sb[j++] = segments[i];
        }
        self._path = sb.join("/");
        if (self._path.length > 0) {
            ok = util.uriTest.dirPath.test(self._path);
            if (!ok) {
                throw new Error(0x0011, "URI.setHref(s,sRel):'" + s + "' is Not a well formatted URI.");
            }
            self._dirPath = RegExp.$1;
        }
        ok = util.uriTest.fragment.test(s);
        if (ok) {
            self._fragment = RegExp.$1;
            s = s.substring(0, s.length - self._fragment.length - 1);
            self._fragment = "#" + self._fragment.replace("#", "%23");
        }
        self._query = s;
        s = s.substring(1);
        if (self._query != "") {
            var pairs = s.split(/\;|\&/),
                parts, ptv, name;
            for (i = 0; i < pairs.length; i++) {
                parts = pairs[i].split("=");
                try {
                    name = decodeURIComponent(parts[0]);
                } catch (ex) {
                    name = unescape(parts[0]);
                }
                if (parts.length == 2) {
                    try {
                        ptv = decodeURIComponent(parts[1]);
                    } catch (ex) {
                        ptv = unescape(parts[1]);
                    }
                } else ptv = null;
                name in self._params ? self._params[name].push(ptv) : self._params[name] = [ptv];
            }
        }
    }
}
$p.getHref = function () {
    if (this._hrefCache != null) return this._hrefCache;
    var s = this._scheme + (this._generic ? "://" : ":") + this._userInfo + (this._userInfo == "" ? "" : "@") + this._host + (this._port != "" ? ":" + this._port : "") + this._path;
    if (s == "://" || s == ":") return null; //DSONet fixed @ 11:21 2006-6-4
    return this._hrefCache = s + this.getQuery() + this._fragment;
}
$p.getParam = function (sName) {
    if (sName in this._params) return this._params[sName][this._params[sName].length - 1];
    return undefined;
}
$p.setParam = function (sName, sValue) {
    this._hrefCache = null;
    return this._params[sName] = [String(sValue)];
}
$p.removeParam = function (sName) {
    this._hrefCache = null;
    delete this._params[sName];
}
$p.hasParam = function (sName) {
    return sName in this._params;
}
$p.getParams = function (sName) {
    if (sName in this._params) return this._params[sName].concat();
    return [];
}
$p.addParam = function (sName, sValue) {
    this._hrefCache = null;
    var v = sValue == null ? null : String(sValue);
    sName in this._params ? this._params[sName].push(v) : this._params[sName] = [v];
}
$p.getQuery = function () {
    var sb = [],
        sb2, sb3, v, name, i;
    for (name in this._params) {
        sb2 = [];
        for (i = 0; i < this._params[name].length; i++) {
            sb3 = [];
            v = this._params[name][i];
            try {
                name = encodeURIComponent(name);
            } catch (ex) {
                name = escape(name);
            }
            if (v == null) sb2.push(name);
            else {
                try {
                    v = encodeURIComponent(v);
                } catch (ex) {
                    v = escape(v);
                }
                sb3.push(name, "=", v);
                sb2.push(sb3.join(""));
            }
        }
        sb.push(sb2.join("&"));
    }
    return sb.length > 0 ? "?" + sb.join("&") : "";
}
$p.getScheme = function () {
    return this._scheme;
}
$p.getPath = function () {
    return this._path;
}
$p.getDirPath = function () {
    return this._dirPath;
}
$p.getHost = function () {
    return this._host;
}
$p.getPort = function () {
    return this._port;
}
$p.getFragment = function () {
    return this._fragment;
}
$p.getUserInfo = function () {
    return this._userInfo;
}
/*
 * editor: 1160155 2012年04月01日 16:01:55 kxp
 * begin
 */
$p.encode = function (o) {
    if (!o) {
        return "";
    }
    var buf = [];
    for (var key in o) {
        var ov = o[key],
            k = encodeURIComponent(key);
        var type = typeof ov;
        if (type == 'undefined') {
            buf.push(k, "=&");
        } else if (type != "function" && type != "object") {
            buf.push(k, "=", encodeURIComponent(ov), "&");
        } else if (Util.isArray(ov)) {
            if (ov.length) {
                for (var i = 0, len = ov.length; i < len; i++) {
                    buf.push(k, "=", encodeURIComponent(ov[i] === undefined ? '' : ov[i]), "&");
                }
            } else {
                buf.push(k, "=&");
            }
        }
    }
    buf.pop();
    return buf.join("");
}
$p.decode = function (string, overwrite) {
    if (!string || !string.length) {
        return {};
    }
    var obj = {};
    var pairs = string.split('&');
    var pair, name, value;
    for (var i = 0, len = pairs.length; i < len; i++) {
        pair = pairs[i].split('=');
        name = decodeURIComponent(pair[0]);
        value = decodeURIComponent(pair[1]);
        if (overwrite !== true) {
            if (typeof obj[name] == "undefined") {
                obj[name] = value;
            } else if (typeof obj[name] == "string") {
                obj[name] = [obj[name]];
                obj[name].push(value);
            } else {
                obj[name].push(value);
            }
        } else {
            obj[name] = value;
        }
    }
    return obj;
}
$p.toJSON = function () {
    var query = this.getQuery();
    if (query.length == 0) {
        return null;
    }
    var json = util.json.encode(util.Base64.decode(query.replace('?', '')));
    for (var i in json) {
        var value = json[i];
        json[i] = decodeURIComponent(value);
    }
    return json;
}
/*
 * end
 */
$p = null;

(function () {
    try {
        var window = this;
        if (!window.localStorage) {
            if (window.globalStorage) {
                try {
                    window.localStorage = window.globalStorage;
                } catch (e) {
                }
                return;
            }
            var div = document.createElement("div"),
                attrKey = "localStorage";
            div.style.display = "none";
            document.getElementsByTagName("head")[0].appendChild(div);
            if (div.addBehavior) {
                div.addBehavior("#default#userdata");
                //div.style.behavior = "url('#default#userData')";
                var localStorage = window["localStorage"] = {
                        "length": 0,
                        "setItem": function (key, value) {
                            div.load(attrKey);
                            key = cleanKey(key);
                            if (!div.getAttribute(key)) {
                                this.length++;
                            }
                            div.setAttribute(key, value);
                            div.save(attrKey);
                        },
                        "getItem": function (key) {
                            div.load(attrKey);
                            key = cleanKey(key);
                            return div.getAttribute(key);
                        },
                        "removeItem": function (key) {
                            div.load(attrKey);
                            key = cleanKey(key);
                            div.removeAttribute(key);
                            div.save(attrKey);
                            this.length--;
                            if (this.length < 0) {
                                this.length = 0;
                            }
                        },
                        "clear": function () {
                            div.load(attrKey);
                            var i = 0;
                            while (attr = div.XMLDocument.documentElement.attributes[i++]) {
                                div.removeAttribute(attr.name);
                            }
                            div.save(attrKey);
                            this.length = 0;
                        },
                        "key": function (key) {
                            div.load(attrKey);
                            return div.XMLDocument.documentElement.attributes[key];
                        }

                    },
                    cleanKey = function (key) {
                        return key.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g, "-");
                    };
                div.load(attrKey);
                localStorage["length"] = div.XMLDocument.documentElement.attributes.length;
            }
        }
    } catch (e) {
    }
})();


function MD5(hexcase, bit) {
    this.hexcase = hexcase || 0;
    this.b64pad = "";
    this.chrsz = 8;
    this.bit = bit || undefined;
}

MD5.prototype = {
    hex_md5: function (s) {
        if (this.bit && this.bit === 16) {
            return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz)).substr(8, 16);
        }
        ;
        return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    },
    b64_md5: function (s) {
        return this.binl2b64(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    },
    str_md5: function (s) {
        return this.binl2str(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    },
    hex_hmac_md5: function (key, data) {
        return this.binl2hex(this.core_hmac_md5(key, data));
    },
    b64_hmac_md5: function (key, data) {
        return this.binl2b64(this.core_hmac_md5(key, data));
    },
    str_hmac_md5: function (key, data) {
        return this.binl2str(this.core_hmac_md5(key, data));
    },
    core_md5: function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;

        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return Array(a, b, c, d);
    },
    md5_cmn: function (q, a, b, x, s, t) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    },
    md5_ff: function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    },
    md5_gg: function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    },
    md5_hh: function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    },
    md5_ii: function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    },
    core_hmac_md5: function (key, data) {
        var bkey = this.str2binl(key);
        if (bkey.length > 16) bkey = this.core_md5(bkey, key.length * this.chrsz);

        var ipad = Array(16),
            opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = this.core_md5(ipad.concat(this.str2binl(data)), 512 + data.length * this.chrsz);
        return this.core_md5(opad.concat(hash), 512 + 128);
    },
    safe_add: function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    },
    bit_rol: function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    },
    str2binl: function (str) {
        var bin = Array();
        var mask = (1 << this.chrsz) - 1;
        for (var i = 0; i < str.length * this.chrsz; i += this.chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);
        }
        return bin;
    },
    binl2str: function (bin) {
        var str = "";
        var mask = (1 << this.chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += this.chrsz) {
            str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
        }
        return str;
    },
    binl2hex: function (binarray) {
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    },
    binl2b64: function (binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) str += this.b64pad;
                else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    }
}